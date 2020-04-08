import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
class App extends Component {
  state = {
    partners: [],
  }
  componentWillMount() {
    this.callBackendAPI()
    .then(res => {this.setState({ partners: res.partners });})
    .catch(err => {console.log('ERROR:', err)});
  }
  
  callBackendAPI = async () => {
    const response = await fetch('/partners');
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    // console.log(body);
    return body;
  }
  render() {
    var items = _.map(this.state.partners, (partner) => {
      return {
        // id: partner.id,
        name: partner.name,
        display_name: partner.display_name,
        create_date: partner.create_date
      }
    })
    items = _.compact(items);
    items = _.map(items, (item) => {
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.display_name}</td>
          <td>{item.create_date}</td>
        </tr>
      );
    });

    return (
      <div className='App'>
        <header className='App-header'>
          <img className='App-logo' src={logo} alt="logo" />
        </header>
        <div className='container'>
          <h1>Welcome partners</h1>
          <table className='table'>
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Display</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>            
              {items}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default App;