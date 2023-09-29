import Web3 from 'web3';
import { Web3Multicall3, createContractCall } from '../src';
import { UsdcAbi } from './usdc.abi';

const config = {
  rpc: 'https://1rpc.io/eth',
  address: '0xcA11bde05977b3631167028862bE2a173976CA11',
}

const ZeroAddress = '0x' + '0'.repeat(40);

describe('Web3Multicall3', () => {
  const web3 = new Web3(config.rpc);
  const multicall = new Web3Multicall3({
    web3,
    address: config.address,
  });

  test('should return valid values', async () => {
    const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const usdc = new web3.eth.Contract(UsdcAbi, usdcAddress);
    const [owner, balance] = await multicall.aggregate3([
      createContractCall(usdc, 'owner', []),
      createContractCall(usdc, 'balanceOf', [ZeroAddress]),
    ]);

    const [actualOwner, actualBalance] = await Promise.all([
      usdc.methods.owner().call(),
      usdc.methods.balanceOf(ZeroAddress).call(),
    ]);

    expect(actualOwner).toBe(owner);
    expect(actualBalance).toBe(balance);
  });

});
