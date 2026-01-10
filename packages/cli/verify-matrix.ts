import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

const TEST_DIR = path.join(process.cwd(), 'matrix-tests');

const combinations = [
    { frontend: 'nextjs', backend: 'express', auth: 'jwt', database: 'sqlite', api: 'rest' },
    { frontend: 'react-vite', backend: 'fastify', auth: 'clerk', database: 'postgresql', api: 'rest' },
    { frontend: 'nextjs', backend: 'nestjs', auth: 'supabase', database: 'supabase-db', api: 'rest' },
    { frontend: 'react-vite', backend: 'bun-elysia', auth: 'jwt', database: 'mongodb', api: 'rest' },
    { frontend: 'nextjs', backend: 'express', auth: 'authjs', database: 'sqlite', api: 'trpc' },
    { frontend: 'react-vite', backend: 'fastify', auth: 'jwt', database: 'postgresql', api: 'graphql' },
    { frontend: 'nextjs', backend: 'nestjs', auth: 'jwt', database: 'postgresql', multiTenant: true, api: 'rest' },
];

async function runTests() {
    await fs.ensureDir(TEST_DIR);

    for (const combo of combinations as any[]) {
        const projectName = `test-${combo.frontend}-${combo.backend}-${combo.auth}-${combo.database}${combo.api !== 'rest' ? '-' + combo.api : ''}${combo.multiTenant ? '-mt' : ''}`;
        const fullProjectPath = path.join(TEST_DIR, projectName);

        if (await fs.pathExists(fullProjectPath)) {
            console.log(`Skipping ${projectName}, already exists.`);
            continue;
        }

        console.log(`\n🚀 Testing Combination: ${JSON.stringify(combo)}`);

        // Pass the full path to the create command
        let cmd = `npx tsx src/index.ts create "${fullProjectPath}" --frontend ${combo.frontend} --backend ${combo.backend} --auth ${combo.auth} --database ${combo.database} --skip-install --skip-git`;
        if (combo.api && combo.api !== 'rest') cmd += ` --api ${combo.api}`;
        if (combo.multiTenant) cmd += ` --multi-tenant`;

        try {
            execSync(cmd, { cwd: process.cwd(), stdio: 'inherit' });
            console.log(`✅ Generation successful: ${projectName}`);

            // Verify key files
            const envPath = path.join(fullProjectPath, '.env.example');
            if (await fs.pathExists(envPath)) {
                const envContent = await fs.readFile(envPath, 'utf-8');
                if (!envContent.includes('PORT=3001')) {
                    console.error(`❌ Port 3001 not found in ${projectName}/.env.example`);
                }
            } else {
                console.error(`❌ .env.example missing in ${projectName}`);
            }

        } catch (error) {
            console.error(`❌ Failed to generate ${projectName}:`, error);
        }
    }
}

runTests().catch(console.error);
