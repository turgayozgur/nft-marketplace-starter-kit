import React, { Component } from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/Kryptobird.json';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            kryptoBirdz: [],
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
            this.setState({contract});

            const totalSupply = await contract.methods.totalSupply().call();
            this.setState({totalSupply});
            for (let i = 1; i <= totalSupply; i++) {
                const kryptoBird = await contract.methods.kryptoBirdz(i -1).call();
                this.setState({kryptoBirdz:[...this.state.kryptoBirdz, kryptoBird]});
            }
            console.log(this.state.kryptoBirdz);
        } else {
            window.alert('Smart contract not deployed.');
        }
    }

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.state.account) {
            this.setState({account:accounts[0]});
        }
    }

    mint = (kryptoBird) => {
        this.state.contract.methods.mint(kryptoBird).send({
            from: this.state.account,
        }).once('receipt', (receipt) => {
            this.setState({kryptoBirdz:[...this.state.kryptoBirdz, kryptoBird]})
        });
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

                <div className='container-fluid mt-1'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className='content mr-auto ml-auto'
                                style={{opacity: '0.8'}}>
                                <h1 style={{color:'white'}}>KryptoBirdz - NFT Marketplace</h1>
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    const kryptoBird = this.kryptoBird.value;
                                    this.mint(kryptoBird);
                                }}>
                                    <input type='text' placeholder='Add a file location' className='form-control mb-1'
                                        ref={(input) => this.kryptoBird = input}/>
                                    <input type='submit' className='btn btn-primary' value='MINT'
                                        style={{margin: '6px'}}/>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>

            </div>
        )
    }
}

export default App;