import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';

// File type categories
const FILE_CATEGORIES: Record<string, string[]> = {
    Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff'],
    Documents: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'],
    Archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso'],
    Videos: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'],
    Audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
    Code: ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.rb', '.php', '.html', '.css', '.json', '.xml', '.yaml', '.yml'],
    Data: ['.csv', '.sql', '.db', '.sqlite', '.json', '.yaml'],
    Executables: ['.exe', '.msi', '.app', '.bin', '.sh', '.bat'],
    Others: [],
};

interface OrganizeResult {
    categorized: Record<string, number>;
    duplicates: number;
}

/**
 * Calculate MD5 hash of a file
 */
async function getFileHash(filePath: string): Promise<string> {
    try {
        const content = await fs.readFile(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch {
        // Return empty string for unreadable files
        return '';
    }
}

/**
 * Detect duplicate files by hash
 */
export async function detectDuplicates(folderPath: string): Promise<Map<string, string[]>> {
    const fileHashes: Map<string, string[]> = new Map();
    const duplicates: Map<string, string[]> = new Map();

    // System folders to skip
    const skipFolders = new Set(['.git', '.env', 'node_modules', '.next', 'dist', 'build', '.DS_Store', '.vscode']);

    async function scanDirectory(dir: string) {
        try {
            const files = await fs.readdir(dir);

            for (const file of files) {
                if (skipFolders.has(file) || file.startsWith('.')) {
                    continue;
                }

                const filePath = path.join(dir, file);
                try {
                    const stats = await fs.stat(filePath);

                    if (stats.isDirectory()) {
                        await scanDirectory(filePath);
                    } else if (stats.isFile() && stats.size > 0) {
                        try {
                            const hash = await getFileHash(filePath);
                            if (hash) {
                                if (!fileHashes.has(hash)) {
                                    fileHashes.set(hash, []);
                                }
                                fileHashes.get(hash)!.push(filePath);
                            }
                        } catch {
                            // Skip files that can't be hashed
                        }
                    }
                } catch {
                    // Skip files/folders that can't be accessed
                }
            }
        } catch {
            // Skip directories that can't be read
        }
    }

    await scanDirectory(folderPath);

    // Identify actual duplicates
    for (const [hash, files] of fileHashes) {
        if (files.length > 1) {
            duplicates.set(hash, files);
        }
    }

    return duplicates;
}

/**
 * Organize files by type into categorized folders
 */
export async function organizeFilesByType(
    folderPath: string,
    duplicates: Map<string, string[]> = new Map()
): Promise<OrganizeResult> {
    const result: OrganizeResult = { categorized: {}, duplicates: 0 };
    const duplicateSet = new Set<string>();

    // Build a set of duplicate files for quick lookup
    for (const files of duplicates.values()) {
        files.forEach(f => duplicateSet.add(f));
    }

    async function scanAndOrganize(dir: string) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                // Skip special folders
                if (file === 'Duplicates' || file.startsWith('.')) {
                    continue;
                }
                await scanAndOrganize(filePath);
            } else {
                const ext = path.extname(file).toLowerCase();

                // Find category
                let category = 'Others';
                for (const [cat, extensions] of Object.entries(FILE_CATEGORIES)) {
                    if (extensions.includes(ext)) {
                        category = cat;
                        break;
                    }
                }

                const destFolder = path.join(
                    folderPath,
                    duplicateSet.has(filePath) ? 'Duplicates' : category
                );

                await fs.ensureDir(destFolder);
                await fs.move(filePath, path.join(destFolder, file), { overwrite: true });

                if (duplicateSet.has(filePath)) {
                    result.duplicates++;
                } else {
                    result.categorized[category] = (result.categorized[category] || 0) + 1;
                }
            }
        }
    }

    await scanAndOrganize(folderPath);
    return result;
}

/**
 * Organize files by date (YYYY-MM format)
 */
export async function organizeFilesByDate(
    folderPath: string,
    duplicates: Map<string, string[]> = new Map()
): Promise<OrganizeResult> {
    const result: OrganizeResult = { categorized: {}, duplicates: 0 };
    const duplicateSet = new Set<string>();

    // Build a set of duplicate files
    for (const files of duplicates.values()) {
        files.forEach(f => duplicateSet.add(f));
    }

    async function scanAndOrganize(dir: string) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {
                if (file.startsWith('.') || /^\d{4}-\d{2}$/.test(file)) {
                    continue;
                }
                await scanAndOrganize(filePath);
            } else {
                // Get file modification date
                const mtime = new Date(stats.mtime);
                const dateFolder = mtime.toISOString().slice(0, 7); // YYYY-MM

                const destFolder = path.join(
                    folderPath,
                    duplicateSet.has(filePath) ? 'Duplicates' : dateFolder
                );

                await fs.ensureDir(destFolder);
                await fs.move(filePath, path.join(destFolder, file), { overwrite: true });

                if (duplicateSet.has(filePath)) {
                    result.duplicates++;
                } else {
                    result.categorized[dateFolder] = (result.categorized[dateFolder] || 0) + 1;
                }
            }
        }
    }

    await scanAndOrganize(folderPath);
    return result;
}
