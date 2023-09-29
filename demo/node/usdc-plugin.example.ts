/*
yarn add web3
yarn add web3-multicall3
*/

import Web3 from 'web3';
import { createContractCall } from 'web3-multicall3';
import { Web3Multicall3Plugin } from 'web3-multicall3/plugin';
export const UsdcAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const;

const web3 = new Web3('https://1rpc.io/eth');
web3.registerPlugin(new Web3Multicall3Plugin());

async function main() {
  const usdc = new web3.eth.Contract(UsdcAbi, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
  const [owner, balance] = await web3.multicall3.aggregate3([
    createContractCall(usdc, 'owner', []),
    createContractCall(usdc, 'balanceOf', ['0x0000000000000000000000000000000000000000']),
  ]);
}

main()
