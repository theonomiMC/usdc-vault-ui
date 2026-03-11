# 🏦 ERC-4626 Upgradeable USDC Vault

A modern, secure, and user-friendly Vault for USDC deposits, built on the **Ethereum Sepolia** network. This project demonstrates a full-stack Web3 integration using **Solidity (Foundry)** for smart contracts and **Next.js (Wagmi/Viem)** for the frontend.

## 🚀 Live Demo
[Link to your Vercel URL here]

## ✨ Features
- **ERC-4626 Standard:** Follows the yield-bearing vault standard for maximum compatibility.
- **Upgradeable Architecture:** Built using the **UUPS (Universal Upgradeable Proxy Standard)** to allow future logic improvements while keeping the same contract address.
- **USDC Integration:** Specifically designed to handle 6-decimal tokens like USDC.
- **Modern Frontend:** Built with **Next.js 14**, **Tailwind CSS**, and **RainbowKit** for a seamless wallet connection experience.
- **Advanced UX:** Two-step deposit process (Approve -> Deposit) with automatic form resets and transaction status notifications.

## 🛠️ Tech Stack
- **Smart Contracts:** Solidity, OpenZeppelin, Foundry (Testing/Deployment).
- **Frontend:** Next.js, Wagmi, Viem, RainbowKit, Tailwind CSS.
- **Deployment:** Vercel (Frontend), Sepolia Testnet (Contracts).

## 🏗️ Architecture
The system uses a Proxy-Implementation pattern:
1. **Proxy Contract:** The static address users interact with.
2. **Implementation (V1/V2):** The logic layer that can be upgraded by the owner.
3. **Vault Storage:** Persists user balances (shares) and total assets across upgrades.



## 🔧 Getting Started

### Prerequisites
- Node.js & npm
- Foundry (for smart contract work)

### Installation
1. Clone the repo:
   ```bash
   git clone git clone https://github.com/theonomiMC/usdc-vault-ui.git
   cd usdc-vault-ui
   npm install
   npm run dev


## 📄 Smart Contracts
Contract repo: https://github.com/theonomiMC/UsdcVault/tree/vault-upgradeable
Proxy (Sepolia): `0x3D0dDdCCdCA542AB2aB1D1d328F4e4344a330589`