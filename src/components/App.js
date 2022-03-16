import React, { Component } from "react";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from '../abis/Kryptobird.json';
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardImage, MDBBtn, MDBCardText} from 'mdb-react-ui-kit';
import './App.css';

/*
K1: https://i.ibb.co/8rZ2K4T/k1.png
K2: https://i.ibb.co/0pLGzw7/k2.png
K3: https://i.ibb.co/jhtzBDr/k3.png
K4: https://i.ibb.co/C00Fv4T/k4.png
K5: https://i.ibb.co/JqSBdbk/k5.png
K6: https://i.ibb.co/pdrsNk1/k6.png
K7: https://i.ibb.co/RbrwS4T/k7.png
* */

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
        if (!await this.loadWeb3()) {
            alert('There is no ethereum wallet connected.');
            return;
        }
        await this.loadBlockChainData();
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider();

        if (provider) {
            console.log('ethereum wallet is connected.');
            window.web3 = new Web3(provider);
            return true;
        } else {
            console.log('there is no ethereum wallet detected.');
            return false;
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
            <div className='container-filled'>
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
                                <h1 style={{color:'black'}}>KryptoBirdz - NFT Marketplace</h1>
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

                    <hr/>

                    <div className='row text-center'>
                        {this.state.kryptoBirdz.map((kryptoBird, key) => {
                            return (
                                <div key={key}>
                                    <div>
                                        <MDBCard className='token' style={{maxWidth:'22rem'}}>
                                            <MDBCardImage src={kryptoBird} position='top' height='250rem' style={{marginRight:'4px'}}/>
                                            <MDBCardBody>
                                                <MDBCardTitle style={{color:'white'}}> KryptoBirdz </MDBCardTitle>
                                                <MDBCardText style={{color:'white'}}> The KryptoBirdz are 20 uniquely generated KBirdz from the cyberpunk cloud galaxy Mystopia! There is only one of each bird and each bird can be owned by a single person on the Ethereum blockchain. </MDBCardText>
                                                <MDBBtn href={kryptoBird}>Download</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        )
    }
}

export default App;