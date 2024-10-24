import { bls12_381 as bls } from '@noble/curves/bls12-381';
import crypto from 'crypto';

/**
 * Function to hash a message using a private key
 * 
 * @param message The message to hash
 * @param privateKey The private key to sign the message with
 * @returns signature as a hex string
 */
export function hash(message: string, privateKey: string): string {
    privateKey = crypto.createHash('sha256').update(privateKey).digest('hex'); // Hash the private key using SHA-256
    message = crypto.createHash('sha256').update(message).digest('hex'); // Hash the message using SHA-256

    // Sign the message using the private key
    const signature = bls.sign(message, privateKey);

    // Return the signature as a hex string
    return Buffer.from(signature).toString('hex');
}

/**
 * Function to verify a signature using a message and public key
 * 
 * @param signature The signature of the message
 * @param message The message to verify
 * @param privateKey The private key to verify the message with
 * @returns isValid as a boolean
 */
export function isValid(signature: string, message: string, privateKey: string): boolean {
    privateKey = crypto.createHash('sha256').update(privateKey).digest('hex'); // Hash the private key using SHA-256
    message = crypto.createHash('sha256').update(message).digest('hex'); // Hash the message using SHA-256
    
    // Get the public key from the private key
    const publicKey = bls.getPublicKey(privateKey);

    // Verify the signature
    return bls.verify(signature, message, publicKey);
}