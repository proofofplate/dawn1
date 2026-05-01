import { FluentWalletBuilder, type EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { LedgerParameters } from '@midnight-ntwrk/ledger-v8';
import type { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import type { UnshieldedKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';

export interface WalletBundle {
  wallet: WalletFacade;
  seeds: { masterSeed: string; shielded: Uint8Array; unshielded: Uint8Array; dust: Uint8Array };
  keystore: UnshieldedKeystore;
}

export async function buildWallet(env: EnvironmentConfiguration, mnemonic: string): Promise<WalletBundle> {
  const builder = FluentWalletBuilder.forEnvironment(env).withDustOptions({
    ledgerParams: LedgerParameters.initialParameters(),
    additionalFeeOverhead: env.walletNetworkId === 'undeployed' ? 500_000_000_000_000_000n : 1_000n,
    feeBlocksMargin: 5,
  });
  const result = await builder.withMnemonic(mnemonic).buildWithoutStarting();
  return result as unknown as WalletBundle;
}
