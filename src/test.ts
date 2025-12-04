import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId, setNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';
import * as bip39 from 'bip39'; // Import the converter
import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });
// 1. Set Global Network ID
setNetworkId(NetworkId.TestNet);

const CONFIG = {
    indexer: 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
    indexerWS: 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
    node: 'https://rpc.testnet-02.midnight.network',
    proofServer: 'http://127.0.0.1:6300'
};

async function main() {
    console.log("🌑 Connecting to Midnight Testnet...");

    // 2. YOUR 24 WORDS (The Mnemonic)
    // Paste your full phrase here. It is safe to use spaces.
    const mnemonic = process.env.WALLET_SEED!;

    try {
        // 3. CONVERT WORDS TO HEX SEED
        // This turns your 24 words into the 64-character hex string the SDK needs
        const hexSeed = bip39.mnemonicToEntropy(mnemonic);

        console.log("🔑 Converted Mnemonic to Hex Seed");

        // 4. Build Wallet using the HEX SEED
        const wallet = await WalletBuilder.buildFromSeed(
            CONFIG.indexer,
            CONFIG.indexerWS,
            CONFIG.proofServer,
            CONFIG.node,
            hexSeed, // <--- Passing the Hex string, not the words!
            getZswapNetworkId(), 
            'warn'
        );

        // 5. Start and Check State
        await wallet.start();
        console.log("✅ Wallet started!");

        const state = await firstValueFrom(wallet.state());
        console.log("\n------------------------------------------------");
        console.log("📦 Wallet Address:", state.address);
        console.log("💰 Coin Balance:", state.balances);
        console.log("------------------------------------------------\n");

    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}

main();