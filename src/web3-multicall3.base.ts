import { AbiParameter, Contract } from 'web3';
import * as AbiCoder from 'web3-eth-abi';

import { Multicall3Abi } from './constants/multicall3.abi.js';
import { MulticallRequest, MulticallResponse } from './types.js';
import { CallFailedError } from './errors/call-failed.error.js';
import { createContractCall } from './create-contract-call.js';

export class BaseWeb3Multicall3 {
  createContractCall = createContractCall;

  constructor(public contract: Contract<typeof Multicall3Abi>) {
  }

  async aggregate3<
    T extends readonly MulticallRequest[] | []
  >(
    methods: T
  ): Promise<{ -readonly [P in keyof T]: MulticallResponse<T[P]> }> {
    const params = methods.map((method: MulticallRequest) => {
      const callData = AbiCoder.encodeFunctionCall(method.abi, method.args);
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
      const decoded = AbiCoder.decodeParameters(abi.outputs as AbiParameter[], returnData as string);
      return abi.outputs?.length === 1 ? decoded[0] : decoded;
    });
    return response as any;
  }

}

