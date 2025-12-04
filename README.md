# Midnight Network Starter Kit 🌑

A robust, pre-configured boilerplate for building privacy-preserving decentralized applications (dApps) on the Midnight Network.

This repository bridges the gap between reading the documentation and running actual code. It includes a working Compact smart contract ("Hello World") and a fully typed TypeScript environment configured to compile Zero-Knowledge circuits and authenticate with the Midnight Testnet.

---

## 🧐 Why Use This Starter Kit?

Setting up a Zero-Knowledge (ZK) development environment is complex. This repo solves the most common "Day 1" hurdles developers face:

| Challenge | Solution |
|-----------|----------|
| **Dependency Hell** | The `@midnight-ntwrk` SDKs (`wallet`, `wallet-api`, `ledger`, `zswap`) require specific version matching. This `package.json` is pre-aligned to work together. |
| **The "Hex Seed" Trap** | The official Wallet SDK requires a 64-character hexadecimal entropy string, not a standard 24-word mnemonic. This kit handles this conversion securely using `bip39`. |
| **Automated Compilation** | Instead of remembering long CLI flags, this repo uses VS Code tasks to handle compilation with the correct flags (`--vscode --skip-zk`). |
| **WSL/Linux Ready** | Configured to work seamlessly in WSL 2, which is the required environment for the Compact compiler on Windows machines. |

---

## 📚 Key Concepts Explained

If you are new to Midnight, here is how the pieces fit together:

### Compact Language (`.compact`)
A domain-specific language for writing smart contracts. Unlike Solidity, Compact splits logic into **Public (Ledger)** and **Private (Witness)** domains. Your contract logic lives in [`src/hello.compact`](src/hello.compact).

### ZKIR (Zero-Knowledge Intermediate Representation)
When you compile your contract, it generates mathematical "circuits" (`.zkir` files). These circuits allow a user to prove they ran the code correctly **without revealing their private input data**. See [`src/managed/zkir/`](src/managed/zkir/) for generated circuits.

### Proof Server
A local service (running in Docker) that takes your private data and the ZKIR circuit to generate a cryptographic proof. This proof is what actually gets sent to the blockchain, keeping your data local and safe.

---

## 🛠️ Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js** | v18 or higher (v20+ recommended) |
| **Compact Compiler** | `compact` CLI installed and in your PATH. [Download Here](https://github.com/midnight-ntwrk/compact/releases) |
| **WSL 2** | **Required for Windows users** - no native Windows compiler exists |
| **Docker Desktop** | Required for the local Proof Server |
| **Midnight Lace Wallet** | Browser extension with Testnet tokens (tDUST) |

---

## 📂 Project Structure

```
dawn1/
├── .vscode/
│   └── tasks.json          # VS Code build task (Ctrl+Shift+B)
├── src/
│   ├── hello.compact       # 🎯 THE SMART CONTRACT
│   ├── test.ts             # 🔌 Wallet connection & testnet bridge
│   └── managed/            # ⚙️ AUTO-GENERATED (do not edit!)
│       ├── contract/       # TypeScript bindings for your contract
│       │   ├── index.cjs   # Runtime implementation
│       │   └── index.d.cts # Type definitions
│       ├── zkir/           # ZK circuits for the Proof Server
│       └── compiler/       # Contract metadata
├── .env                    # 🔐 Your seed phrase (git-ignored)
├── .env.example            # Template for .env
├── .gitignore              # Protects secrets from commits
└── package.json            # Midnight SDK dependencies
```

### File Details

| File | Purpose |
|------|---------|
| [`src/hello.compact`](src/hello.compact) | Defines a `Bytes<32>` ledger variable and a `get_message()` circuit that returns "Hello, Midnight!" |
| [`src/test.ts`](src/test.ts) | Converts mnemonic → hex, builds wallet, connects to testnet, displays balance |
| [`src/managed/contract/index.d.cts`](src/managed/contract/index.d.cts) | TypeScript types for `Contract`, `Ledger`, and `Circuits` |
| [`.vscode/tasks.json`](.vscode/tasks.json) | Runs `compact compile --vscode --skip-zk` on the active file |

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd dawn1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Add your seed phrase to `.env`:**
   ```
   WALLET_SEED="word1 word2 word3 ... word24"
   ```

> ⚠️ **Security Warning:** Never commit your `.env` file. It is already included in `.gitignore`.

---

## ⚡ Usage

### 1. Compile the Smart Contract

Compile your `.compact` code into TypeScript bindings and ZK circuits.

**Option A — VS Code (Recommended):**
1. Open `src/hello.compact`
2. Press `Ctrl + Shift + B`

**Option B — Terminal:**
```bash
npm run build
```

✅ **Success Indicator:** The `src/managed` folder will populate with `.zkir`, `.cjs`, and `.d.cts` files.

### 2. Connect to Testnet

Verify your environment is correctly connected to the Midnight Testnet:

```bash
npx ts-node src/test.ts
```

**Expected Output:**
```
🌑 Connecting to Midnight Testnet...
🔑 Converted Mnemonic to Hex Seed
✅ Wallet started!

------------------------------------------------
📦 Wallet Address: mn_shield-addr_...
💰 Coin Balance: { ... }
------------------------------------------------
```

> 💡 **Tip:** If Coin Balance shows `{}`, your balance is 0. Request tokens from the [Midnight Testnet Faucet](https://faucet.testnet.midnight.network/).

---

## 🔧 Configuration Reference

### Testnet Endpoints

Defined in `src/test.ts`:

| Service | URL |
|---------|-----|
| Indexer (GraphQL) | `https://indexer.testnet-02.midnight.network/api/v1/graphql` |
| Indexer (WebSocket) | `wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws` |
| RPC Node | `https://rpc.testnet-02.midnight.network` |
| Proof Server | `http://127.0.0.1:6300` (local Docker) |

### SDK Versions

From `package.json`:

| Package | Version |
|---------|---------|
| `@midnight-ntwrk/compact-runtime` | ^0.9.0 |
| `@midnight-ntwrk/wallet` | ^5.0.0 |
| `@midnight-ntwrk/ledger` | ^4.0.0 |
| `@midnight-ntwrk/zswap` | ^4.0.0 |

---

## 🚀 Next Steps

1. **Modify the contract** — Edit `hello.compact` to add new ledger state or circuits
2. **Call contract functions** — Use the generated types in `index.d.cts` to interact with your contract from TypeScript
3. **Deploy to testnet** — Extend `test.ts` to deploy and call your contract

---

## 📝 License

[MIT](LICENSE)
