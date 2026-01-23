/**
 * Port availability checks
 */

import { execSync } from 'child_process';
import net from 'net';
import type { CheckResult, PortCheckResult } from './types.js';

/**
 * Default ports to check for ForgeStack projects
 */
const DEFAULT_PORTS = [
    { port: 3000, name: 'Backend API' },
    { port: 3001, name: 'Frontend (alternate)' },
    { port: 5173, name: 'Vite Dev Server' },
    { port: 5432, name: 'PostgreSQL' },
    { port: 27017, name: 'MongoDB' },
    { port: 3306, name: 'MySQL' },
    { port: 6379, name: 'Redis' },
];

/**
 * Check if a port is in use using net module
 */
function checkPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.once('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        
        server.listen(port, '127.0.0.1');
    });
}

/**
 * Get process ID using a port (Windows)
 */
function getProcessOnPortWindows(port: number): number | null {
    try {
        const output = execSync(`netstat -ano | findstr :${port}`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        
        const lines = output.trim().split('\n');
        for (const line of lines) {
            if (line.includes('LISTENING')) {
                const parts = line.trim().split(/\s+/);
                const pid = parseInt(parts[parts.length - 1], 10);
                if (!isNaN(pid)) return pid;
            }
        }
    } catch {
        // Port not in use or command failed
    }
    return null;
}

/**
 * Get process ID using a port (Unix)
 */
function getProcessOnPortUnix(port: number): number | null {
    try {
        const output = execSync(`lsof -i :${port} -t 2>/dev/null | head -1`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        
        const pid = parseInt(output.trim(), 10);
        if (!isNaN(pid)) return pid;
    } catch {
        // Port not in use or command failed
    }
    return null;
}

/**
 * Get process info by PID
 */
function getProcessInfo(pid: number): string | null {
    const isWindows = process.platform === 'win32';
    
    try {
        if (isWindows) {
            const output = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            const match = output.match(/"([^"]+)"/);
            return match ? match[1] : null;
        } else {
            const output = execSync(`ps -p ${pid} -o comm=`, {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            return output.trim() || null;
        }
    } catch {
        return null;
    }
}

/**
 * Check a single port
 */
async function checkSinglePort(port: number, name: string): Promise<PortCheckResult> {
    const inUse = await checkPortInUse(port);
    
    if (!inUse) {
        return { port, name, inUse: false };
    }
    
    // Try to get the process ID
    const isWindows = process.platform === 'win32';
    const pid = isWindows
        ? getProcessOnPortWindows(port)
        : getProcessOnPortUnix(port);
    
    return { port, name, inUse: true, pid: pid ?? undefined };
}

/**
 * Check common development ports
 */
export async function checkPortAvailability(ports?: Array<{ port: number; name: string }>): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const portsToCheck = ports || DEFAULT_PORTS.slice(0, 4); // Only check main app ports by default
    
    for (const { port, name } of portsToCheck) {
        const portCheck = await checkSinglePort(port, name);
        
        if (portCheck.inUse) {
            let details = `Port ${port} is in use`;
            if (portCheck.pid) {
                const processName = getProcessInfo(portCheck.pid);
                details = processName
                    ? `Port ${port} is used by ${processName} (PID: ${portCheck.pid})`
                    : `Port ${port} is used by process ${portCheck.pid}`;
            }
            
            results.push({
                name: `${name} (port ${port})`,
                status: 'fail',
                message: details,
                fix: portCheck.pid
                    ? `Stop the process or use a different port. Kill: ${process.platform === 'win32' ? `taskkill /PID ${portCheck.pid} /F` : `kill ${portCheck.pid}`}`
                    : 'Stop the process using this port or configure a different port',
            });
        } else {
            results.push({
                name: `${name} (port ${port})`,
                status: 'pass',
                message: `Port ${port} is available`,
            });
        }
    }
    
    return results;
}

/**
 * Check specific application ports based on project config
 */
export async function checkAppPorts(backendPort = 3000, frontendPort = 5173): Promise<CheckResult[]> {
    return checkPortAvailability([
        { port: backendPort, name: 'Backend' },
        { port: frontendPort, name: 'Frontend' },
    ]);
}
