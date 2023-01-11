import React, { useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Button, Card, Elevation, InputGroup } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';
import { useIsUserAuth } from '../hooks/admin';
import { Icon } from '@blueprintjs/core';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const FormCard = styled(Card)`
  &&& {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledInputGroup = styled(InputGroup)`
  margin: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 1rem;
`;

const Login = ({ history }) => {
  const [key, setKey] = useState('');
  const [isAuth] = useIsUserAuth();

  const onInputChange = ({ target: { value: key } }) => {
    setKey(key);
  };

  const onKeyDown = ({ key }) => {
    if (key === 'Enter') {
      onLogin();
    }
  };

  const onLogin = async () => {
    console.log('here', API_BASE_URL);
    const response = await authFetch(`${API_BASE_URL}/api/login`, 'POST', {
      body: JSON.stringify({ key, username: 'foo' })
    });
    const { admin } = await response.json();
    const { status } = response;
    if (status === 200) {
      if (admin) {
        history.push('/admin');
        window.location.reload(false);
      } else {
        history.push('/');
        window.location.reload(false);
      }
    }
  };

  const onLogout = async () => {
    const { status } = await authFetch(`${API_BASE_URL}/api/logout`, 'GET');
    if (status === 200) {
      history.push('/');
      window.location.reload(false);
    }
  };

  return (
    <FormContainer>
      <FormCard elevation={Elevation.THREE}>
        {isAuth ? (
          <StyledButton onClick={onLogout} intent="success">
            LOGOUT
          </StyledButton>
        ) : (
          <>
            <StyledInputGroup
              id="text-input"
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              value={key}
              placeholder={'Enter your password...'}
              leftIcon={<Icon icon="key" />}
            />
            <StyledButton onClick={onLogin} intent="success">
              LOGIN
            </StyledButton>
          </>
        )}
      </FormCard>
    </FormContainer>
  );
};

Login.propTypes = {
  /** react-router */
  history: object.isRequired
};

export default Login;
