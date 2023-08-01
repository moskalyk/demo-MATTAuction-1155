import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {sequence} from '0xsequence'
import { ethers } from 'ethers'

import img0 from './imgs/0.png'
import img1 from './imgs/1.png'
import img2 from './imgs/2.png'
import img3 from './imgs/3.png'
import img4 from './imgs/4.png'
import img5 from './imgs/5.png'
import img6 from './imgs/6.png'
import img7 from './imgs/7.png'
import img8 from './imgs/8.png'
import img9 from './imgs/9.png'
import img10 from './imgs/10.png'
import img11 from './imgs/11.png'
import img12 from './imgs/12.png'

import QRCodeGenerator from './QRCodeGenerator';
import DataGrid from 'react-data-grid';

import { BrowserRouter as Router, useLocation, Route, Routes, Link, useParams } from 'react-router-dom';

const defaultTelescopes = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12]

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function EndAuction(){

  sequence.initWallet({defaultNetwork: 'polygon'})
  
  const [value, setValue] = useState<any>(0)
  const [columns, setColumns] = useState<any>([])
  const [rows, setRows] = useState<any>([])

  const [address, setAddress] = useState<any>(null)
  const [ethAuthProofString, setEthAuthProofString] = useState<any>(null)

  const connect = async () => {
    const wallet = await sequence.getWallet();
    const details = await wallet.connect({
      app: 'glass',
      authorize: true
    })

    if(details.connected && details.session?.accountAddress /*==''*/){
      console.log(details)
      setAddress(details!.session!.accountAddress)
      setEthAuthProofString(details!.proof!.proofString)
    }
  }

  const end = async () => {
    console.log('ending')
    const res = await fetch("http://155.138.139.22:5000/bids", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address: address,
        ethAuthProofString: ethAuthProofString
      }),
    })

    const json  = await res.json()
    const sum = json.prices.reduce((accumulator: any, currentObject: any) => {
      if (typeof currentObject.max === 'number') {
        return accumulator + currentObject.max;
      } else {
        return accumulator; // Ignore non-numeric values or missing 'max' key
      }
    }, 0);

    setValue(sum)

    const columnsTemp: any = []
    columnsTemp.push({ key: 'title', name: 'TokenID' })
    columnsTemp.push({ key: 'id', name: 'Bids' })

    setColumns(columnsTemp)

    const counts: any = {}
    const rowsTemp: any = []

    let index = 0
      for(let index = 0; index < 13; index++){
        if(json.bidders[index]){
          counts[index] = json.bidders[index].length
          rowsTemp.push({ id: counts[index], title: json.prices[index].tokenID })
        }
    }

    setRows(rowsTemp)
  }

  React.useEffect(() => {
  }, [columns])
  
  return(
    <>
    <div className="App">
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      {
        address 
        ? 
        <>
          <h1>possible value: {value}</h1>
          <br/>
          <button onClick={async () => await end()}>end auction</button> 
          <br/>
          <br/>
          <DataGrid style={{width: '400px', margin: 'auto'}} columns={columns} rows={rows} />;
        </>
        :
        <>
          <h1>login to end auction</h1>
          <br/>
          <button onClick={async () => await connect()}>login</button> 
        </>
      }
    </div>
    </>
  )
}

function GazingPage() {
  const [telescopes, setTelescopes] = useState<any>([img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12])
  const [message, setMessage] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)
  const [amount, setAmount] = useState<any>(null)
  const [tokenID, setTokenID] = useState<any>(1)
  const [counter, setCounter] = useState<any>(0)
  const [url, setUrl] = useState<any>(0)
  const [ethAuthProofString, setEthAuthProofString] = useState<any>(null)
  sequence.initWallet({defaultNetwork: 'polygon'})

  const bid = async () => {
      const wallet = sequence.getWallet()
      const flore1155ContractAddress = '0x62b3d280Ee9AC72BC58331669590D6793657B884'
      const flore20ContractAddress = '0x6efa2ea57b5ea64d088796af72eddc7f5393dd2b'
  
      // Craft your transaction
      const erc20Interface = new ethers.utils.Interface([
        'function approve(address spender, uint256 amount) public returns (bool)'
      ])

      // TODO: do an allowance ., check
      const data20 = erc20Interface.encodeFunctionData(
        'approve', [flore1155ContractAddress, amount]
      )

      const txn1 = {
        to: flore20ContractAddress,
        data: data20
      }

      const signer = wallet.getSigner()

      try{
        const txRes = await signer.sendTransaction([txn1])
        const res = await fetch("http://155.138.139.22:5000/bid", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            tokenID: query.get('tokenID'),
            address: address,
            ethAuthProofString: ethAuthProofString
          }),
        })
        if(res.status == 200){
          setMessage(<h1>bid placed</h1>)
        }
      } catch(err){
        setMessage(<h1>error</h1>)
      }
  }

  const connect = async () => {
    const wallet = await sequence.getWallet();
    const details = await wallet.connect({
      app: 'glass',
      authorize: true
    })

    if(details.connected){
      console.log(details)
      setAddress(details!.session!.accountAddress)
      setEthAuthProofString(details!.proof!.proofString)
      return {A: true, B: details!.session!.accountAddress, C: details!.proof!.proofString}
    }else {
      return false
    }
  }

  let query = useQuery()

  React.useEffect(() => {

  }, [telescopes, counter, address, ethAuthProofString])
 
  return (
    <div className="App">
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <br/>
      <br/>
      <br/>
      <br/>
      {
        query.get('tokenID') ? 
        <>
          <img width={'300px'}src={telescopes[query.get('tokenID')!]}/>
          <br/>
          <br/>
          <br/>
          <br/>
          {
            message ? message : 
            <>
              {
                address 
                ? 
                  <>
                    <input placeholder={'bid amount'} className={"input-bid"} onChange={(evt: any) => setAmount(evt.target.value)}></input>
                    <br/>
                    <br/>
                    <button onClick={async () => await bid()}>bid</button> 
                  </> 
                : 
                  <>
                    <button onClick={async () => await connect()}>connect to bid</button> 
                  </>
              }
            </>
          }
        </>
        :
        <>
           {
              address 
            ? 
            <>
            <br/>
            <h1>G L A S S</h1>
            <br/>
            <br/>
            <div className="grid-container">
                {telescopes.map((image: any, index: any) => (
                  <div key={index} className="grid-item" onMouseEnter={() => {
                    const tempTelescopes = telescopes
                    tempTelescopes[index] = false
                    setTelescopes(tempTelescopes)
                    setUrl(`http://155.138.139.22/?tokenID=${index}&?contract=${''}`)
                    setCounter(counter+1)
                  }} onMouseLeave={() => {
                    const tempTelescopes = telescopes
                    tempTelescopes[index] = defaultTelescopes[index]
                    setTelescopes(tempTelescopes)
                    setCounter(counter+1)
                  }}>
                    {
                      telescopes[index] ? <img width={'300px'}src={image} alt={`Image ${index + 1}`} /> : <QRCodeGenerator url={url}/>
                    }
                  </div>
                ))}
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </>
            : 
            <>
              <h1>G L A S S</h1>
              <br/>
              <h1>An Auction for telescope NFTs</h1>
              <br/>
              <br/>
              <button onClick={async () => await connect()}>connect</button> 
            </>
            }
        </>
      }
    </div>
  );
}

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<GazingPage />} />
          <Route path="/end-auction" element={<EndAuction />} />
        </Routes>
    </Router>
  );
};

export default App;