# Arweave-SMT

Decentralizing centralized database with Arweave for decentralized purpose.

This is the source code for the arweave-smt.

The main purpose of the arweave-smt is to create a webservice with database based on Sparse Merkle Tree, that tracks Ethereum smart contract (that uses sparse merkle tree logic, e.g. for Plasma chain) events and stores key/values pairs to allow users to get neccessary proofs.

Arweave-SMT was built as a submission to this [Open Web Hackathon](https://github.com/ArweaveTeam/Bounties/issues/1) using Javascript, CSS, HTML.

In general the application should allow users (dapp developers) to create a personal webservice (that is deployed on Arweave net), that is a database (Sparse Merkle Tree) that will interact with the personal smart contract deployed on the Ethereum blockchain (track the events and accordingly them extend the database), that allow every contract user to take proof from this database and use them to interact with this contract.

## Development stages

- v.DEMO_0.0.1. First stage is a demo. It is a only the database based on Sparse Merkle Tree, that can be used by anyone. Users will be able to store the value, to get the proof, to read the value.
- v.DEMO_0.1.1. Second stage is a complete webservice that interacts with the demo ethereum smart contract. Users will be able to get proofs and to read the value, then to use these data to interact with the demo smart contract.
- v.0.0.1. Third stage is an application that allow every Arweave user (basically ethereum dApp developers) to create own webservice for personal ethereum smart contract. User will be able to customize new webservice to interact with custom smart contract. The creation besides the transaction fee will cost some AR.

Current Working Version (Stage#1) can be found at https://arweave.net/7hWDZTIsxs_FHx0neiedSgAUy-yqBgt0wIBqKyrM_Zc
