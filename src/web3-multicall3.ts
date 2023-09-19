import Web3, { AbiParameter, Contract } from 'web3';
import { Multicall3Abi } from './multicall3.abi';
import { MulticallRequest, MulticallResponse } from './types';
import { CallFailedError } from './errors/call-failed.error';
import { createContractCall } from './create-contract-call';

interface Web3Multicall3Parameters {
  web3: Web3;
  address: string;
}
export class Web3Multicall3 {
  private web3: Web3;
  contract: Contract<typeof Multicall3Abi>;

  createContractCall = createContractCall;

  constructor({ web3, address }: Web3Multicall3Parameters) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(Multicall3Abi, address);
  }

  async aggregate3<
    T extends readonly MulticallRequest[] | []
  >(
    methods: T
  ): Promise<{ -readonly [P in keyof T]: MulticallResponse<T[P]> }> {
    const params = methods.map((method: MulticallRequest) => {
      const callData = this.web3.eth.abi.encodeFunctionCall(method.abi, method.args);
      return {
        target: method.address,
        callData,
        allowFailure: true,
      };
    });
    const result = await this.contract.methods.aggregate3(params).call();
    const response = result.map(({ success, returnData }, i) => {
      if (!success) {
        return new CallFailedError(`i=${i}`);
      }
      const { abi } = methods[i];
      const decoded = this.web3.eth.abi.decodeParameters(abi.outputs as AbiParameter[], returnData as string);
      return abi.outputs?.length === 1 ? decoded[0] : decoded;
    });
    return response as any;
  }

}

