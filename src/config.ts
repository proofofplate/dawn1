import 'dotenv/config';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export type NetworkLabel = 'preprod' | 'preview' | 'undeployed';

export const NETWORK_ID = (process.env.NETWORK_ID ?? 'preprod') as NetworkLabel;

setNetworkId(NETWORK_ID);

const PREPROD: EnvironmentConfiguration = {
  walletNetworkId: 'preprod',
  networkId: 'preprod',
  indexer: 'https://indexer.preprod.midnight.network/api/v3/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  proofServer: process.env.PROOF_SERVER ?? 'http://localhost:6300',
  faucet: 'https://faucet.preprod.midnight.network/api/request-tokens',
};

const PREVIEW: EnvironmentConfiguration = {
  walletNetworkId: 'preview',
  networkId: 'preview',
  indexer: 'https://indexer.preview.midnight.network/api/v3/graphql',
  indexerWS: 'wss://indexer.preview.midnight.network/api/v3/graphql/ws',
  node: 'https://rpc.preview.midnight.network',
  nodeWS: 'wss://rpc.preview.midnight.network',
  proofServer: process.env.PROOF_SERVER ?? 'http://localhost:6300',
  faucet: 'https://faucet.preview.midnight.network/api/request-tokens',
};

const ENVIRONMENTS: Record<NetworkLabel, EnvironmentConfiguration | null> = {
  preprod: PREPROD,
  preview: PREVIEW,
  undeployed: null,
};

export const ENV: EnvironmentConfiguration = (() => {
  const cfg = ENVIRONMENTS[NETWORK_ID];
  if (!cfg) {
    throw new Error(`NETWORK_ID="${NETWORK_ID}" not supported (expected: preprod | preview).`);
  }
  return {
    ...cfg,
    indexer: process.env.INDEXER ?? cfg.indexer,
    indexerWS: process.env.INDEXER_WS ?? cfg.indexerWS,
    node: process.env.MN_NODE ?? cfg.node,
    nodeWS: process.env.MN_NODE_WS ?? cfg.nodeWS,
  };
})();

export const ZK_CONFIG_PATH = join(__dirname, 'managed');
export const PRIVATE_STATE_DIR = join(__dirname, '..', '.private-state');
