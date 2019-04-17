import React from 'react';
import { H1 } from '@blueprintjs/core';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100% !important;
  text-align: center !important;
`;

const StyledH1 = styled(H1)`
  font-size: 64px !important;
  margin: 64px !important;
`;

const Home = () => (
  <StyledContainer>
    <StyledH1>baruchlogic</StyledH1>
  </StyledContainer>
);

export default Home;
