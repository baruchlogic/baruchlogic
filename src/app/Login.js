import React, { Component } from 'react';

class Login extends Component {
  state = {
    key: ''
  };

  async componentDidMount() {
    const res = await fetch('http://localhost:5000/api/auth');
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        username: 'foo'
      })
    });
  };

  render() {
    const { key } = this.state;
    return (
      <div>
      <input onChange={this.onInputChange} value={key} />
      <button onClick={this.onLogin}>SUBMIT</button>
      </div>
    )
  }
};

export default Login;
