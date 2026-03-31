import 'dotenv/config';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export type NetworkId = 'TestNet' | 'DevNet' | 'MainNet';

export const NETWORK_ID = (process.env.NETWORK_ID ?? 'TestNet') as NetworkId;

// Must be called before any SDK operations
setNetworkId(NETWORK_ID);

export const CONFIG = {
  NETWORK_ID,
  indexer:     process.env.INDEXER      ?? 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
  indexerWS:   process.env.INDEXER_WS   ?? 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
  node:        process.env.MN_NODE      ?? 'https://rpc.testnet-02.midnight.network',
  proofServer: process.env.PROOF_SERVER ?? 'http://localhost:6300',
  // Path to ZK artifacts compiled by `npm run build`
  zkConfigPath: join(__dirname, 'managed'),
};
