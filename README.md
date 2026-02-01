# World Physical Acceptance Layer

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Alpha%20Sandbox-green.svg)](releases)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-World%20Network-black.svg)](https://worldcoin.org)

**The "Last Mile" Bridge for World ID.**
An open-source, stateless middleware that allows physical merchants to accept fiat payments (Cards, SEPA) and settle instantly in Stablecoins on World Chain, without custodial risk.

---

## 🏗 Architecture
The system follows a strict **Stateless Orchestration** pattern ("The Air Gap"):
-   **POS Client (Android):** "Dumb" terminal for input/output.
-   **Core Orchestrator (Go):** Verifies payment signals from regulated PSPs and triggers settlement instructions.
-   **Liquidity Layer:** Direct-to-Merchant settlement via Liquidity Providers (LPs).

**[View Architecture Design](docs/architecture_design.md)**

## 🚀 Getting Started (Sandbox)

### 1. Run the Backend
```bash
cd core-orchestrator
cp .env.example .env
docker-compose up -d
```

### 2. Install POS Client
Build the Android APK pointing to `http://localhost:8080` (see `pos-client-android/README.md`).

### 3. Verify Flow
The system is pre-configured with Mock Adapters for immediate testing.
Check logs to see the "Zero Custody" flow in action.

## 🤝 Contributing
We welcome contributions from the World Builder community.
Please read `CONTRIBUTING.md` before submitting Pull Requests.

## 📄 License
Licensed under the Apache License, Version 2.0.
See `LICENSE` for the full text.

---
*Built with ❤️ for the World Network.*
