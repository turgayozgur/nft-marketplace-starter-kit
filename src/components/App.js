import React, { Component } from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/Kryptobird.json';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: ''
        };
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider();

        if (provider) {
            console.log('ethereum wallet is connected.');
            window.web3 = new Web3(provider);
        } else {
            console.log('there is no ethereum wallet detected.');
        }
    }

    async loadBlockChainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.handleAccountsChanged(accounts);

        const networkId = await web3.eth.net.getId();
        const networkData = KryptoBird.networks[networkId];
        if (networkData) {
            const abi = KryptoBird.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            console.log(contract);
        }
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.state.account) {
            this.setState({account:accounts[0]});
        }
    }

    render() {
        return (
            <div>
                <nav className='navbar nav-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
                    <div className='navbar-brand col-sm-4 col-md-3 mr-0'
                        style={{color:'white'}}>
                        Krypto Birdz NFTs
                    </div>
                    <ul className='navbar-nav px-3'>
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                           <small className='text-white'>
                               {this.state.account}
                           </small>
                        </li>
                    </ul>
                </nav>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
}

export default App;