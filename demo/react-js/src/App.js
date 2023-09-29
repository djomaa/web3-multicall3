import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { Web3Multicall3, createContractCall } from 'web3-multicall3';
import { UsdcAbi } from './usdc-abi';

function App() {
  const [owner, setOwner] = React.useState()
  const [balance, setBalance] = React.useState()


  useEffect(() => {
    async function a() {
      const web3 = new Web3('https://1rpc.io/eth');

      const multicall = new Web3Multicall3({
        web3,
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      });

      const usdc = new web3.eth.Contract(UsdcAbi, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
      const [owner, balance] = await multicall.aggregate3([
        createContractCall(usdc, 'owner', []),
        createContractCall(usdc, 'balanceOf', ['0x0000000000000000000000000000000000000000']),
      ]);
      setOwner(owner);
      setBalance(balance);
    }
    a();
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          USDC
        </p>
        <p>
          Owner: {owner ?? 'loading..'}
        </p>
        <p>
          Zero address balance: {balance?.toString() ?? 'loading..'}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
