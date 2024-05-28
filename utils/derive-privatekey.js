import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

/**
 *
 * @param {string} mnemonic
 * @returns Ed25519Keypair
 */
export default function derivePrivateKey(mnemonic) {
  const keyPair = Ed25519Keypair.deriveKeypair(mnemonic);

  return keyPair;
}
