import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import { logo, superboard_icon, jackpot_machine, profile, chevron_down } from './assets';
import peanut from '@squirrel-labs/peanut-sdk';
import { providers } from 'ethers';
import { useSDK } from '@metamask/sdk-react';

import { useDebounce } from 'use-debounce'

import { ethers } from 'ethers';


const tokenamount = 0.001;

const App = () => {

  const [amount, setAmount] = useState('');
  const [to, setTo] = useState('');
  const [tokenType, setTokenType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const { sdk } = useSDK();
  const [link, setLink] = useState('');

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      const accAdress = accounts?.[0];
      const trimAddress = accAdress?.slice(0, 6) + '....' + accAdress?.slice(-4);
      setAccount(trimAddress);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    if (account === '') {
      connect();
    }
  }, [account]);

  const generatelink = async () => {

    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer)
    setIsLoading(true);
    const linkDetails = {
      chainId: 80001,
      tokenAmount: amount,
      tokenType: 0,
      tokenAddress: '0x0000000000000000000000000000000000000000'
    }

    try {
      const response = await peanut.createLink({
        structSigner: {
          signer: signer,
        },
        linkDetails,
      })
      setIsLoading(false);
      setLink(response.link[0])
      console.log(response.link[0])
    } catch (w) {
      console.log(w);
    }
  }

  return (
    <div className="App bg-[url('./assets/icon/background.png')] bg-repeat-round">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 m-2 ml-6 md:h-24 md:w-24 " />
        </div>
        <div className="flex flex-row items-center mr-6 space-x-4">
          <img src={superboard_icon} alt="Feature 1" className="h-10 w-10 m-2 md:h-20 md:w-20 " onClick={connect} />
          <p className='text-[20px] font-[500] hidden md:block md:text-2xl '>Superboard</p>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center'>
        {/* MAIN CONTAINER */}
        <div div className="flex flex-col w-[75%] h-80 mt-7 self-center relative bg-black border border-[#BA59FD] rounded-xl md:w-[35rem] md:h-[30rem] md:mt-24 ">
          <div className='flex flex-row items-center mt-10'>
            <p className='text-sm italic ml-4 mr-2 md:text-2xl  ' >To:</p>
            <input type='email' className='w-[80%] bg-transparent border-t-transparent border-x-transparent border-b-2 border-b-[#808080] italic text-sm md:text-2xl md:w-[27rem] ' placeholder='Enter address, ENS, Email Address' onChange={(e) => setTo(e.target.value)} value={to} />
          </div>
          <div className='flex flex-row items-center mt-4'>
            <p className='text-sm italic ml-4 mr-2 md:text-2xl'>Amount:</p>
            <select className='bg-[#1E1134] rounded-full text-xs py-[5px] px-[10px] text-[#BA59FD] md:text-2xl' onChange={(e) => setTokenType(e.target.value)}
              value={tokenType}>
              <option value="Matic">Matic</option>
              <option value="Eth">Ethereum</option>
            </select>
            {tokenType !== '' && (
              <input
                type='number'
                className='bg-transparent w-24 border-t-transparent border-x-transparent ml-6 border-b-2 border-b-[#808080] italic text-sm md:text-2xl md:w-[13rem]'
                placeholder='Enter amount'
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            )}
          </div>
          <div className='flex flex-row items-center mt-4'>
            <p className='text-sm italic ml-4 mr-2 md:text-2xl '>PS: The Network Fees is</p>
            <input type='text' className='bg-transparent w-32 border-t-transparent border-x-transparent border-b-2 border-b-[#808080] italic text-sm md:text-2xl md:w-[14rem] ' placeholder='(shows spoiler effect)' />
          </div>

          <button className='flex flex-row w-[90%] h-[22%] bg-[#1E1134] self-center items-center justify-center rounded-[10px] mt-10 md:w-[33rem] md:h-[7rem] md:mt-[5rem] ' >
            <img src={jackpot_machine} className='w-14 h-14 ml-2 md:w-24 md:h-24 ' />
            <p className='text-[14px] text-[#BA59FD] text-left ml-4 md:text-xl '>Watch this Ad and waive your network fees</p>
          </button>

          <div className='flex flex-row w-full h-[15%] px-4 bg-transparent items-center justify-between absolute inset-x-0 bottom-0 rounded-b-xl border border-[#BA59FD] md:h-[5rem] '>
            <p className='text-xs text-[#808080] md:text-xl '>SEND USING</p>
            <div className='flex flex-row items-center '>
              <img src={profile} className='w-6 h-6 md:w-10 md:h-10 ' />
              <p className='text-xs ml-2 md:text-lg'>{account}</p>
              <img src={chevron_down} className='w-2 h-2 ml-4 md:w-6 md:h-6 ' />
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button className='flex w-[75%] h-14 bg-[#BA59FD] self-center items-center justify-center rounded-xl mt-4 md:w-[35rem] ' onClick={generatelink}>
          <div className='flex w-[50%] h-[60%] bg-[#1C0C27] self-center items-center justify-center rounded-full md:h-[3rem] md:w-[10rem] md:my-2 '>
            <p className='text-sm italic font-[500] underline text-[#BA59FD] md:text-lg '>Send {amount === '' ? 0 : amount} ETH</p>
          </div>
        </button>
      </div>
      {isLoading && <p className='mt-4'>Processing...</p>}
      {link !== '' && <a href={link} >Access Link</a>}
    </div >
  );
}

export default App;
