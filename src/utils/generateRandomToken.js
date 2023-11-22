import crypto from 'crypto';

export function generateRandomToken(length) {
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length must be a positive number');
    }
    
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') 
        .slice(0, length);
}