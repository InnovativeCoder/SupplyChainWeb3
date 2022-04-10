import React, { Component } from "react";
import "./App.css";
import ItemContract from "./contracts/Item.json";
import ItemManagerContract from "./contracts/ItemManager.json";
import getWeb3 from "./getWeb3";


class App extends Component {
  state = {
    loaded: false,
    cost: 0,
    itemName: "example_1"
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.ItemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );
      this.Item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleImputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    })
  }

  handleSubmit = async () => {
    const { cost, itemName } = this.setState;
    console.log("reached")
    const res = await this.ItemManager.methods.createItem(itemName, cost).send({ from: this.accounts[2] })
    console.log("res is ", res)
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply Chain</h1>
        <h2>Items</h2>
        <h2>Add Items</h2>
        Cost in Wei : <input type="text" name="cost" value={this.state.cost} onChange={this.handleImputChange} />
        Item identifier <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleImputChange} />
        <button type="button" onClick={this.handleSubmit}>Create new item</button>
      </div>
    );
  }
}

export default App;
