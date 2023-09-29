import Web3 from 'web3';
import { Web3Multicall3, createContractCall } from 'web3-multicall3';
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

async function main() {
  const multicall = new Web3Multicall3({
    web3,
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  });

  const usdc = new web3.eth.Contract(UsdcAbi, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
  const result = await multicall.aggregate3([
    createContractCall(usdc, 'owner', []),
    createContractCall(usdc, 'balanceOf', ['0x0000000000000000000000000000000000000000']),
  ]);
}

main()


