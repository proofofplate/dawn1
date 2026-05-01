import 'dotenv/config';
import { firstValueFrom, filter } from 'rxjs';
import { ZswapSecretKeys, DustSecretKey } from '@midnight-ntwrk/ledger-v8';
import { ENV, NETWORK_ID } from './config.js';
import { buildWallet } from './wallet.js';

async function main(): Promise<void> {
  const mnemonic = process.env.WALLET_SEED;
  if (!mnemonic) {
    console.error('WALLET_SEED is not set. Copy .env.example to .env and add your 24-word seed.');
    process.exit(1);
  }

  console.log(`Connecting to Midnight ${NETWORK_ID}...`);
  console.log(`  Indexer:      ${ENV.indexer}`);
  console.log(`  Node:         ${ENV.node}`);
  console.log(`  Proof server: ${ENV.proofServer}`);
  console.log('');

  const { wallet, seeds, keystore } = await buildWallet(ENV, mnemonic);

  await wallet.start(ZswapSecretKeys.fromSeed(seeds.shielded), DustSecretKey.fromSeed(seeds.dust));

  console.log('Wallet started. Syncing...');
  const synced = await firstValueFrom(wallet.state().pipe(filter((s) => s.isSynced)));

  const shieldedAddress = synced.shielded.address.toString();
  const unshieldedAddress = keystore.getBech32Address().toString();
  const dustBalance = synced.dust.balance(new Date()) ?? 0n;

  console.log('');
  console.log(`Shielded:    ${shieldedAddress}`);
  console.log(`Unshielded:  ${unshieldedAddress}`);
  console.log(`Shielded balances:   ${JSON.stringify(synced.shielded.balances ?? {})}`);
  console.log(`Unshielded balances: ${JSON.stringify(synced.unshielded.balances ?? {})}`);
  console.log(`Dust balance:        ${dustBalance.toString()}`);

  await wallet.stop();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
