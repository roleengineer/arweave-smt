# Arweave-SMT

Centralized database for decentralized purpose on top of Arweave.
This is the source code for the arweave-smt.
The main purpose of the arweave-smt is to create a centralized database that stores key/values pairs for Ethereum smart contract that is deployed on Plasma chain.
Arweave-SMT was built as a submission to this [Open Web Hackathon hosted on Gitcoin](https://gitcoin.co/issue/ArweaveTeam/Bounties/1/2929) using Javascript, CSS, HTML.

In general the application should allow users (dapp developers) to create a personal webservice (that is deployed on Arweave net), that is a centralized database (Sparse Merkle Tree) that will interact with the smart contract deployed in the Ethereum blockchain (track the events and accordingly them extend the database), that allow every contract user to take proof from this database and use this contract.

## Development stages

- First stage is a demo. It is a only the database that can be used by anyone to store the value.
- Second stage is a complete webservice that interacts with the demo smart contract.
- Third stage is an application that allow every Arweave user to create own webservice for personal purpose. The creation besides the transanction fee will cost some AR.

Current Working Version (Stage#1) can be found at 'link'

## changelog

### 0.1.1

- Error handling in a couple of views
- Fixed XSS security Vulnerability
- Added some styling to the WYSIWYG editor
- HashFragment Links (allows deeplinking)

### 0.1.0

- First release and first test version. Stage#1. It is a result (output) for demo purpose of the application that will be built in the future.

## Coming in a Future Release / Wishlist

- Clean up ApiService
- Better Typescript Coverage
- Unit Tests
- Redux
- Tipping & Upvoting
- Profiles
- Article Thumbnails
- Improved Typography
- Better Validation of incoming data
- More efficient API usage


This application was made

Deployed at: https://arweave.net/5S2y6AKvqZot6AxE-bs3oq0j1Dp3ywYadeeigzAdqE8

Here's a simple demo:

![!](some.gif)

## Setting up locally

This app was made using create-react-app. To run it locally, run `npm install` and then `npm start`

To deploy, you need to create a production build using `npm run build` and follow [the instructions to deploy on arweave network](https://docs.arweave.org/developers/tools/arweave-deploy).



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
