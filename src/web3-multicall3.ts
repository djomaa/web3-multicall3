import Web3 from 'web3';
import { Multicall3Abi } from './constants/multicall3.abi.js';
import { BaseWeb3Multicall3 } from './web3-multicall3.base.js';
import { DefaultAddress } from './constants/config.constants.js';

interface Web3Multicall3Parameters {
  web3: Web3;
  address?: string;
}
export class Web3Multicall3 extends BaseWeb3Multicall3 {
  constructor(opts: Web3Multicall3Parameters) {
    const address = opts.address ?? DefaultAddress;
    const contract = new opts.web3.eth.Contract(Multicall3Abi, address);
    super(contract);
  }
}

