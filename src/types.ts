import { AbiFunctionFragment, ContractMethodInputParameters, ContractMethodOutputParameters } from 'web3-types';

export type MulticallRequest<
  TAbiItem extends AbiFunctionFragment = AbiFunctionFragment
> = {
  address: string,
  abi: TAbiItem,
  args: ContractMethodInputParameters<TAbiItem['inputs']>
};

export type MulticallResponse<
  T extends MulticallRequest
> = T extends MulticallRequest<infer R> ? ContractMethodOutputParameters<R['outputs']> : never;
