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
import type {NextApiRequest, NextApiResponse} from 'next';
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

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST || "https://api.devnet.solana.com";
const network = WalletAdapterNetwork.Devnet;

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export let balance;
export let wallet;



export const Balancuelis: FC = () => {

    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const { publicKey } = useWallet();
    const web3 = require("@solana/web3.js");


    const onClick = useCallback(async () => {


        console.log(publicKey?.toString())
        const solana = new web3.Connection(endpoint);

        const bal = await solana.getBalance(publicKey);
        console.log(bal.toString())

        const balfinal = bal / 10 ** 9;
        console.log(balfinal)

    }, [publicKey])

    return <button id="signbtn" onClick={onClick}>Get balance</button>
}



/*export const BalanceView = () => {
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
    }, [publicKey, connection, balance]);
    return (

      <Col>
          {wallet && <h4>{(balance || "Loading...").toLocaleString()} SOL</h4>
     
      }
      </Col>       
    );
  }
  
  export default BalanceView;
  
*/


export const SignMessageButton: FC = () => {
    const { publicKey, signMessage } = useWallet();

    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const onClick = useCallback(async () => {
        try {
            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) throw new Error('Wallet not connected!');
            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            // Encode anything as bytes
            const message = new TextEncoder().encode('Hello, world!');
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key
            if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');

            console.log(publicKey.toString())


            

            alert(`Message signature: ${bs58.encode(signature)}`);
            console.log(`Message signature: ${bs58.encode(signature)}`);
        } catch (error: any) {
            alert(`Signing failed: ${error?.message}`);
        }
    }, [publicKey, signMessage]);

    return signMessage ? (<button id="signbtn" onClick={onClick} disabled={!publicKey}>Sign Message</button>) : null;
    
};

export const App: FC = () => {
    return (
        <Context>
            <Content />
            <SignMessageButton></SignMessageButton>
            <Balancuelis></Balancuelis>
            <Airdrops></Airdrops>
            <Col></Col>
        </Context>
       
    );
};

export const Airdrops: FC = () => {

    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const { publicKey } = useWallet();
    const web3 = require("@solana/web3.js");

    const connection = new Connection(endpoint, 'confirmed');


    const onClick = useCallback(async () => {


        console.log(publicKey?.toString())

        const hash = await connection.requestAirdrop(publicKey, 1000000000);

        await hash;
        

    }, [publicKey])
    return (
    <button id="signbtn" onClick={onClick}>Aidrop 1 sol</button>
    )
}




const Context: FC<{ children: ReactNode }> = ({ children }) => {

    const { publicKey } = useWallet();

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);


    (async () => {

    const web3 = require("@solana/web3.js");



    if (publicKey) {
        console.log(publicKey)
    } else {
        console.log("no public key")
    }

    })();

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
          
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
        
    );
};

const Content: FC = () => {
    return <WalletMultiButton />;
};

