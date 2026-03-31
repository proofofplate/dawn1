/**
 * dawn1 — Midnight Network starter
 *
 * Connects a wallet, shows balance, and reads the contract state.
 *
 * Usage:
 *   npm run dev
 *
 * Setup:
 *   1. Copy .env.example → .env and add your 24-word seed phrase
 *   2. npm install
 *   3. npm run build     (compiles the Compact contract)
 *   4. npm run dev
 */
import 'dotenv/config';
import { buildWalletFromMnemonic } from './wallet.js';
import { CONFIG } from './config.js';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

async function main() {
  const mnemonic = process.env.WALLET_SEED;
  if (!mnemonic) {
    console.error('Error: WALLET_SEED not set. Copy .env.example to .env');
    process.exit(1);
  }

  console.log(`Connecting to Midnight ${CONFIG.NETWORK_ID}...`);
  console.log(`  Indexer:      ${CONFIG.indexer}`);
  console.log(`  Node:         ${CONFIG.node}`);
  console.log(`  Proof server: ${CONFIG.proofServer}`);
  console.log('');

  const wallet = await buildWalletFromMnemonic(mnemonic);

  // Wait for wallet to sync at least one state update
  const state = await firstValueFrom(
    wallet.state().pipe(filter((s: any) => s !== undefined)),
  );

  console.log('Wallet ready:');
  console.log(`  Address: ${state.address}`);
  console.log(`  DUST:    ${state.balances?.dust ?? 'syncing...'}`);
  console.log(`  NIGHT:   ${state.balances?.night ?? 'syncing...'}`);

  await wallet.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
