import { Keypair } from '@solana/web3.js';

/**
 * Generate a new wallet with a new keypair (public and secret key)
 * 
 * @returns publicKey and secretKey as strings
 */
export function createWallet() {
    // Generate a new keypair
    const keypair = Keypair.generate();

    // Return the public and secret key
    return {
        publicKey: keypair.publicKey.toString(),
        secretKey: keypair.secretKey.toString(),
    };
}