import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {Keypair, Transaction, SystemProgram} from '@solana/web3.js';
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
import React, { FC, ReactNode, useMemo, useCallback } from 'react';
import type {NextApiRequest, NextApiResponse} from 'next';
import { sign } from 'crypto';
import bs58 from 'bs58';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export const App: FC = () => {
    return (
        <Context>
            <Content />
            <SignMessageButton></SignMessageButton>
        </Context>
       
    );
};

export const SignMessageButton: FC = () => {
    const { publicKey, signMessage } = useWallet();

    const onClick = useCallback(async () => {
        try {
            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) console.log('Wallet not connected!');
            console.log('Wallet not connected!');
            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            // Encode anything as bytes
            const message = new TextEncoder().encode('Hello, world!');
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key

            const lol = JSON.stringify(publicKey)

            console.log(`Message signature: ${bs58.encode(signature)}`);
            console.log(lol)
        } catch (error: any) {
            alert(`Signing failed: ${error?.message}`);
        }
    }, [publicKey, signMessage]);

    return signMessage ? (<button onClick={onClick} disabled={!publicKey}>Sign Message</button>) : null;
};


const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);


    (async () => {

    const web3 = require("@solana/web3.js");

    const { publicKey } = useWallet();


    if (publicKey) {
        console.log(publicKey)
    } else {
        console.log("no public key")
    }


    const publicKeyz = new web3.PublicKey(
        "59rozoMHuVtmQXeozMQstZQLnr9fMUc8ciEntqxQ5HYh"
      );
    const solana = new web3.Connection(endpoint);

    const balance = await solana.getBalance(publicKeyz);

    const balances = Math.round((balance + Number.EPSILON) * 100) / 100000000000;
    const balancefinal = balances.toFixed(2)
    console.log(balancefinal);
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

