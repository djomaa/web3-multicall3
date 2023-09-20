import { Contract, Web3Context, Web3PluginBase } from 'web3';
import { BaseWeb3Multicall3 } from '../web3-multicall3.base';
import { Multicall3Abi } from '../constants/multicall3.abi';
import { DefaultAddress } from '../constants/config.constants';

export class Web3Multicall3Plugin extends Web3PluginBase {
  public pluginNamespace = 'multicall';
  #multicall: BaseWeb3Multicall3;

  aggregate3: BaseWeb3Multicall3['aggregate3'];

  constructor(address: string = DefaultAddress) {
    super();
    const contract = new Contract(Multicall3Abi, address)
    this.#multicall = new BaseWeb3Multicall3(contract);
    this.aggregate3 = this.#multicall.aggregate3.bind(this.#multicall);
  }

  link(ctx: Web3Context) {
    super.link(ctx);
    this.#multicall.contract.link(ctx);
  }

}

declare module 'web3' {
  interface Web3Context {
    multicall: Web3Multicall3Plugin;
  }
}
