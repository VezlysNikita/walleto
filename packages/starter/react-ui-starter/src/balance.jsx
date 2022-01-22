import React, { FC, useState, useEffect} from 'react';
import {
  FormGroup,
  Label,
  Col,
} from 'reactstrap';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { web3 } from '"@solana/web3.js';
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST || "https://api.devnet.solana.com";
const connection = new web3.Connection(rpcHost);

export let balance;
export let wallet;


export const getBal = async () => {

  if (wallet) {
    // @ts-ignore
  const balance = await connection.getBalance(wallet.publicKey);
  return balance / 10 ** 9;
}
}
export const BalanceView = () => {
  let [balance, setBalance] = useState();
  wallet = useWallet();
  //const connection = useConnection();
  useEffect(() => {
    (async () => {
      setInterval(async function(){
      if (wallet) {
          // @ts-ignore
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(balance / LAMPORTS_PER_SOL);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    }, Math.random() * 2000 + 500);
    })();
  }, [wallet, connection]);
  return (
    <FormGroup row>
    <Label style={{"textAlign": "right"}} sm="5" md="5">Balance</Label>
    <Col>
        {wallet && <h4>{(balance || "Loading...").toLocaleString()} SOL</h4>
   
    }
    </Col>
  </FormGroup>         
  );
}

export default BalanceView;
