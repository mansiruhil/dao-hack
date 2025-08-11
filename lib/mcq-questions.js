const questions = [
{ id: 1,  question: "Which programming language is primarily used for writing Solana smart contracts?", options: ["Solidity","Rust","Go","Python"], answer: 1 },
{ id: 2,  question: "The smallest unit of SOL is called:", options: ["Gwei","Lamport","Sun","MicroSOL"], answer: 1 },
{ id: 3,  question: "Which Solana cluster is intended for real transactions?", options: ["devnet","testnet","mainnet-beta","betanet"], answer: 2 },
{ id: 4,  question: "What consensus mechanism does Solana use?", options: ["Proof of Stake only","Proof of Work","Proof of History + Proof of Stake","Delegated Proof of Stake"], answer: 2 },
{ id: 5,  question: "Which Solana CLI command requests airdrops on devnet?", options: ["solana airdrop","solana faucet","solana send","solana dev-airdrop"], answer: 0 },
{ id: 6,  question: "Solana transaction fees are paid in:", options: ["USDC","SOL","ETH","SRM"], answer: 1 },
{ id: 7,  question: "Which tool is commonly used to interact with Solana programs from JavaScript?", options: ["@solana/web3.js","solana.py","ethers.js","anchor-cli"], answer: 0 },
{ id: 8,  question: "Anchor framework is mainly used for:", options: ["Storing NFTs","Simplifying Solana program development","Staking SOL","Creating RPC nodes"], answer: 1 },
{ id: 9,  question: "Solana accounts store:", options: ["Only SOL balances","Executable code and/or data","Smart contract logs","IPFS files"], answer: 1 },
{ id: 10, question: "Which network endpoint is used to connect to Solana devnet via RPC?", options: ["https://api.mainnet-beta.solana.com","https://api.devnet.solana.com","https://devnet.solana.org","https://solana.dev"], answer: 1 }
];
export default questions;