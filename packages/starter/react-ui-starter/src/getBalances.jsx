import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {Keypair, Transaction, SystemProgram, SOLANA_SCHEMA} from '@solana/web3.js';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState, useEffect, PropsWithChildren, ReactElement, ValidationMap } from 'react';
import { sign } from 'crypto';
import bs58 from 'bs58';
import { sign } from 'tweetnacl';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { web3 } from '@solana/web3.js';
import ReactDOM from 'react-dom';
import {
    FormGroup,
    Label,
    Col,
  } from 'reactstrap';

  export let balance;
  export let wallet;

  export const getBal = async () => {
    const { publicKey } = useWallet();
    const connection = useConnection();
    if (publicKey) {
      // @ts-ignore
    const balance = await connection.getBalance(publicKey);

    return balance / 10 ** 9;;

      };
  }


  export const BalanceView = () => {
    let [balance, setBalance] = useState();
    const { publicKey } = useWallet();
    const web3 = require("@solana/web3.js");
    const connection = useConnection();
    
    useEffect(() => {
      (async () => {
        setInterval(async function(){
        if (publicKey) {
            // @ts-ignore
          const balance = await connection.getBalance(publicKey);
          console.log(balance / LAMPORTS_PER_SOL);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      }, Math.random() * 2000 + 500);
      })();
    }, [publicKey, connection]);
    return (

      <Col>
          {wallet && <h4>{(balance || "Loading...").toLocaleString()} SOL</h4>
     
      }
      </Col>       
    );
  }
  
  export default BalanceView;
