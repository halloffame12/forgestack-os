import crypto from 'crypto';

/**
 * Generates a cryptographically secure random secret string.
 */
export function generateRandomSecret(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
}
