import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {sequence} from '0xsequence'

function App() {
  const [address, setAddress] = useState<any>(null)
  const [amount, setAmount] = useState<any>(null)
  const [tokenID, setTokenID] = useState<any>(1)

  const [ethAuthProofString, setEthAuthProofString] = useState<any>(null)
  sequence.initWallet({defaultNetwork: 'polygon'})

  const bid = async () => {
    const res = await fetch("http://localhost:5000/bid", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        tokenID: tokenID,
        address: address,
        ethAuthProofString: ethAuthProofString
      }),
    })
  }

  const connect = async () => {
    const wallet = await sequence.getWallet();
    const details = await wallet.connect({
      app: 'observe',
      authorize: true
    })

    if(details.connected){
      console.log(details)
      setAddress(details!.session!.accountAddress)
      setEthAuthProofString(details!.proof!.proofString)
    }
  }

  return (
    <div className="App">

     {
        address 
      ? 
      <>
      <input onChange={(evt: any) => setAmount(evt.target.value)}></input>
        <button onClick={async () => await bid()}>bid</button> 
      </>
      : 
        <button onClick={async () => await connect()}>connect</button> 
      }
    </div>
  );
}

export default App;
