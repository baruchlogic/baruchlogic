import React, { Component } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Button, Card, Elevation, InputGroup } from '@blueprintjs/core';

import { Icon } from '@blueprintjs/core';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const FormCard = styled(Card)`
  display: flex !important;
  flex-direction: column;
  justify-content: center !important;
`;

const StyledInputGroup = styled(InputGroup)`
  margin: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 1rem;
`;

const fetchHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:5000',
  Vary: 'Origin'
};

class Login extends Component {
  static propTypes = {
    history: object
  };

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

  onLogin = async () => {
    const { history } = this.props;
    const { key } = this.state;
    const { status } = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        key,
        username: 'foo'
      }),
      credentials: 'include'
    });
    console.log('SUCCESS', status);
    if (status === 200) {
      history.push('/');
    }
  };

  onLogout = async () => {
    const { history } = this.props;
    const { status } = await fetch('http://localhost:5000/api/logout', {
      headers: fetchHeaders,
      credentials: 'include'
    });
    if (status === 200) {
      history.push('/');
    }
  };

  render() {
    const { key } = this.state;
    return (
      <FormContainer>
        <FormCard elevation={Elevation.THREE}>
          <StyledInputGroup
            id="text-input"
            onChange={this.onInputChange}
            value={key}
            placeholder={'Enter your password...'}
            leftIcon={<Icon icon="key" />}
          />
          <StyledButton onClick={this.onLogin} intent="success">
            SUBMIT
          </StyledButton>
          <StyledButton onClick={this.onLogout}>LOGOUT</StyledButton>
        </FormCard>
      </FormContainer>
    );
  }
}

export default Login;
