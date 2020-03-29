import React, { Component } from "react";
import Web3 from "web3";
import logo from "../logo.png";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Navbar from "./Navbar";
import Main from './Main';

// Through web3.js and MetaMask we can access the accounts, data on the blockchain
class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    // checking if metamask detected in browser, then makes web3 connection
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum); // create new connection to blockchain with web3
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Load smart contract
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      this.setState({ marketplace });
      this.setState({ loading: false });
    } else {
      window.alert("NBA Market contract not deployed to detected network");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <Main/> 
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
