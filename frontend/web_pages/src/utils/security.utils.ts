/**
 * Generates an RSA-OAEP key pair for temporary session-based encryption.
 * The keys stay in memory and are never stored in code or localStorage.
 */
export async function generateSecureKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );

    // Export public key to Base64 to send to backend
    const exportedPublic = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublic)));

    return {
        publicKeyString: publicKeyBase64,
        privateKey: keyPair.privateKey
    };
}

/**
 * Decrypts the API key using the temporary session-based private key
 */
export async function decryptWithRSA(encryptedHex: string, privateKey: CryptoKey): Promise<string | null> {
    try {
        const encryptedBuffer = new Uint8Array(
            encryptedHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedBuffer
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error("RSA Decryption failed:", error);
        return null;
    }
}
