import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Button, Card, Elevation, InputGroup } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';
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

const Login = ({ history }) => {
  const [key, setKey] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const fetchIsAuth = async () => {
    authFetch('http://localhost:5000/api/auth', 'GET').then(res => {
      if (res.status === 200) {
        setIsAuth(true);
      }
    });
  };

  useEffect(() => {
    fetchIsAuth();
  }, []);

  const onInputChange = ({ target: { value: key } }) => {
    setKey(key);
  };

  const onKeyDown = ({ key }) => {
    if (key === 'Enter') {
      onLogin();
    }
  };

  const onLogin = async () => {
    const { status } = await authFetch(
      'http://localhost:5000/api/login',
      'POST',
      {
        body: JSON.stringify({ key, username: 'foo' })
      }
    );
    if (status === 200) {
      history.push('/');
    }
  };

  const onLogout = async () => {
    const { status } = await authFetch(
      'http://localhost:5000/api/logout',
      'GET'
    );
    if (status === 200) {
      history.push('/');
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
  history: object.isRequired
};

export default Login;
