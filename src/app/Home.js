import React from 'react';
import { Card, H1 } from '@blueprintjs/core';
import styled, { keyframes } from 'styled-components';

const StyledContainer = styled.div`
  width: 100% !important;
  text-align: center !important;
`;

const StyledH1 = styled(H1)`
  font-size: 64px !important;
  margin: 64px !important;
`;

const CardContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: auto;
`;

const rotate = keyframes`
  0% {
    opacity: 0;
    transform: translateY(400px);
  }
  25% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledCard = styled(Card)`
  animation: ${rotate} 1s;
  animation-delay: ${props => `${props.order * 0.5}s`};
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
  opacity: 0;
  transform: translateY(400px);
  width: 30%;
`;

const Home = () => (
  <StyledContainer>
    <StyledH1>baruchlogic</StyledH1>
    <CardContainer>
      <StyledCard order={1}>
        An Open Educational Resource for teaching introductory propositional
        logic.
      </StyledCard>
      <StyledCard order={2}>Clear, easy to understand text</StyledCard>
      <StyledCard order={3}>Helpful videos</StyledCard>
    </CardContainer>
  </StyledContainer>
);

export default Home;
