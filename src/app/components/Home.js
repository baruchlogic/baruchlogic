import React from 'react';
import { Card, H1, H2 } from '@blueprintjs/core';
import styled, { keyframes } from 'styled-components';

const StyledContainer = styled.div`
  width: 100% !important;
  text-align: center !important;
`;

const StyledH1 = styled(H1)`
  font-size: 64px !important;
  margin: 64px !important;
`;

const StyledH2 = styled(H2)`
  font-size: 32px !important;
  margin-bottom: 64px !important;
`;

const CardContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 80%;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;

const slideIn = keyframes`
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
  animation: ${slideIn} 1s;
  animation-delay: ${props => `${props.order * 0.5}s`};
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
  font-size: 24px;
  height: 250px;
  opacity: 0;
  transform: translateY(400px);
  width: 30%;
  @media (max-width: 750px) {
    width: 80%;
    margin: 1rem 0;
  }
`;

const StyledVideoIcon = styled.i`
  color: #669eff;
  font-size: 64px;
`;

const StyledBookIcon = styled.i`
  color: #96622d;
  font-size: 64px;
`;

const StyledHWIcon = styled.i`
  color: #d9822b;
  font-size: 64px;
`;

const Home = () => (
  <StyledContainer>
    <StyledH1>baruchlogic</StyledH1>
    <StyledH2>
      An open educational resource for teaching introductory propositional logic
    </StyledH2>
    <CardContainer>
      <StyledCard order={1}>
        <StyledHWIcon className="fas fa-table" />
        <div>Interactive, challenging problemsets</div>
      </StyledCard>
      <StyledCard order={2}>
        <StyledBookIcon className="fas fa-book-reader" />
        <div>Clear, easy to understand text</div>
      </StyledCard>
      <StyledCard order={3}>
        <StyledVideoIcon className="fas fa-video" />
        <div>Helpful videos with intuitive examples</div>
      </StyledCard>
    </CardContainer>
  </StyledContainer>
);

export default Home;
