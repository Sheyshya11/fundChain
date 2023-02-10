# fundChain 💰

<img src="https://capsule-render.vercel.app/api?text=HeyEveryone🕹️&animation=fadeIn&type=waving&color=gradient&height=100" />

## DECENTRALIZED CROWDFUNDING PLATFORM
## Setup ⌛
- Clone the repository

  ```bash
  git clone <link>
  ```
- Install dependencies
  
  ```bash
  npm i
  ```
- Create a .env file in the third-web folder and insert your Metamask private key

  ```bash
  PRIVATE_KEY=XXXXXXX
  ```
- In the third-web folder, build and deploy your smart contract
  
  ```bash
  npm run build
  npm run deploy
  ```
- In the client folder
  
  ```bash
  npm run dev
  ```
## Requirements
- Metamask account connected to the Goerli test network.
- Can use any testnets but third web doesn't support 1337 chain ID for local/private blockchain.
- Fake Ether from [Goerli Faucet](https://goerlifaucet.com/)
