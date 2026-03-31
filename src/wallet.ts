import * as bip39 from 'bip39';
import { WalletBuilder } from '@midnight-ntwrk/wallet-sdk-facade';
import { CONFIG, NETWORK_ID } from './config.js';

/**
 * Build and start a wallet from a BIP39 mnemonic phrase.
 * Connects to the configured testnet indexer and node.
 */
export async function buildWalletFromMnemonic(mnemonic: string) {
  const entropy = bip39.mnemonicToEntropy(mnemonic);
  // Pad entropy to 32-byte hex seed
  const hexSeed = entropy.padStart(64, '0');

  const wallet = await WalletBuilder.buildFromSeed(
    CONFIG.indexer,
    CONFIG.indexerWS,
    CONFIG.proofServer,
    CONFIG.node,
    hexSeed,
    NETWORK_ID,
    'warn',
  );

  await wallet.start();
  return wallet;
}
