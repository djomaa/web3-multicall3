import Contract from 'web3-eth-contract';
import { AbiFunctionFragment, ContractAbi, ContractMethodInputParameters, FilterAbis } from 'web3-types';
import { MulticallRequest } from './types';
import { ContractHasNoAddressError } from './errors/contract-has-no-address.error';

export function createContractCall<
  TAbi extends ContractAbi,
  TKey extends FilterAbis<TAbi, AbiFunctionFragment & {
    type: 'function';
  }>['name'],
  TAbiItem extends FilterAbis<TAbi, AbiFunctionFragment & {
    type: 'function';
    name: TKey,
  }>
>(
  contract: Contract<TAbi>,
  fnName: TKey,
  args: ContractMethodInputParameters<TAbiItem['inputs']>
): MulticallRequest<TAbiItem> {
  if (!contract.options.address) {
    throw new ContractHasNoAddressError(fnName);
  }
  const abi = contract.options.jsonInterface as unknown as TAbi;
  const abiItem = abi.find((abiItem) => {
    if (abiItem.type !== 'function') {
      return false
    }
    if ('name' in abiItem) {
      return abiItem.name === fnName;
    }
    return false;
  });
  if (!abiItem) {
    throw new Error(`Web3Multicall.contractCall: Unexpected exception: Abi item not found`)
  }
  return {
    address: contract.options.address,
    abi: abiItem as TAbiItem,
    args,
  }
}
