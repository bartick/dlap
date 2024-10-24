import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import crypto from "crypto";

/**
 * Function to create a key pair from an email
 * 
 * @param inputString A string to generate the key pair from 
 * @returns A key pair object generated from the input string
 */
function generateKeyPairFromString(inputString: string) {
    // Hash the email to get a 32-byte seed
    const hash = crypto.createHash("sha256").update(inputString).digest();

    // Use the hash as a seed to generate a key pair
    return nacl.box.keyPair.fromSecretKey(hash);
}

/**
 * Function to generate a 24-byte nonce from a string
 * 
 * @param inputString  A string to generate the nonce from
 * @returns A 24-byte nonce generated from the input string
 */
function generateNonceFromString(inputString: string) {
    // Hash the input string using SHA-256
    const hash = crypto.createHash("sha256").update(inputString).digest();

    // Truncate the hash to the first 24 bytes (TweetNaCl requires a 24-byte nonce)
    const nonce = hash.subarray(0, 24);

    return nonce;
}

/**
 * Encrypt a message using the sender's private key and recipient's public key
 * 
 * @param message The solana secret key to encrypt
 * @param secretKey A secret key to encrypt the message with
 * @param nonce A nonce to use for encryption
 * @param recipientPublicKey The recipient's public key
 * @returns The encrypted message as a Base64 string
 */
export function encrypt(
    message: string,
    secretKey: string,
    nonce: string,
    recipientPublicKey: Uint8Array
) { 
    const keyPair = generateKeyPairFromString(secretKey); // Generate keyPair from secretKey
    const nonceUint8Array = generateNonceFromString(nonce); // Generate nonce from nonce string
    const messageUint8Array = naclUtil.decodeUTF8(message); // Convert message to Uint8Array

    // Encrypt the message
    const encryptedMessage = nacl.box(
        messageUint8Array,
        nonceUint8Array,
        recipientPublicKey,
        keyPair.secretKey
    );

    // Return the nonce and encrypted message
    return  naclUtil.encodeBase64(encryptedMessage);
}

/**
 * Decrypt a message using the recipient's secret key and sender's public key
 * 
 * @param encrypted The encrypted message as a Base64 string
 * @param nonce The nonce used for encryption
 * @param secreyKey The secret key to decrypt the message with
 * @param recipientSecretKey The recipient's secret key
 * @returns The decrypted message as a UTF-8 string, or null if decryption fails
 */
export function decrypt(
    encrypted: string,
    nonce: string,
    secreyKey: string,
    recipientSecretKey: Uint8Array,
) {

    const keyPair = generateKeyPairFromString(secreyKey); // Generate keyPair from secretKey
    const nonceUint8Array = generateNonceFromString(nonce); // Generate nonce from nonce string
    const encryptedUint8Array = naclUtil.decodeBase64(encrypted); // Decode ciphertext from Base64

    // Decrypt the message
    const decryptedMessage = nacl.box.open(
        encryptedUint8Array,
        nonceUint8Array,
        keyPair.publicKey,
        recipientSecretKey
    );

    // Return the decrypted message as a UTF-8 string, or null if decryption fails
    return decryptedMessage ? naclUtil.encodeUTF8(decryptedMessage) : null;
}
