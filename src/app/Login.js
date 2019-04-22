import React, { Component } from 'react';

class Login extends Component {
  state = {
    key: ''
  };

  async componentDidMount() {
    const res = await fetch('http://localhost:5000/api/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5000',
        Vary: 'Origin'
      },
      credentials: 'include'
    });
    console.log('res', await res.json());
  }

  onInputChange = ({ target: { value: key } }) => {
    this.setState({
      key
    });
  };

  onLogin = () => {
    const { key } = this.state;
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5000',
        Vary: 'Origin'
      },
      body: JSON.stringify({
        key,
        username: 'foo'
      }),
      credentials: 'include'
    });
  };

  onLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5000',
        Vary: 'Origin'
      },
      credentials: 'include'
    });
  };

  render() {
    const { key } = this.state;
    return (
      <div>
        <input onChange={this.onInputChange} value={key} />
        <button onClick={this.onLogin}>SUBMIT</button>
        <button onClick={this.onLogout}>LOGOUT</button>
      </div>
    );
  }
}

export default Login;
