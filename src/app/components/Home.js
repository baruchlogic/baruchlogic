import React from 'react';
import { Card, Elevation, H1, H2 } from '@blueprintjs/core';
import styled, { keyframes } from 'styled-components';
import { object } from 'prop-types';

const StyledContainer = styled.div`
  &&& {
    width: 100%;
    text-align: center;
  }
`;

const StyledH1 = styled(H1)`
  &&& {
    font-size: 64px;
    margin: 64px;
  }
`;

const StyledH2 = styled(H2)`
  &&& {
    font-size: 32px;
    margin-bottom: 64px;
    margin: 0 1rem 64px 1rem;
  }
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
  display: flex;
  flex-direction: column;
  font-size: 24px;
  height: 250px;
  justify-content: space-around;
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
  color: #669eff;
  font-size: 64px;
`;

const StyledHWIcon = styled.i`
  color: #669eff;
  font-size: 64px;
`;

const Home = ({ history }) => (
  <StyledContainer>
    <StyledH1>baruchlogic</StyledH1>
    <StyledH2>An open educational resource for symbolic logic</StyledH2>
    <CardContainer>
      <StyledCard
        order={1}
        elevation={Elevation.THREE}
        interactive={true}
        onClick={() => {
          history.push('/homework'); // TODO: Use `/problemsets`(?)
        }}
      >
        <StyledHWIcon className="fas fa-table" />
        <div>Interactive, challenging problemsets</div>
      </StyledCard>
      <StyledCard
        order={2}
        elevation={Elevation.THREE}
        interactive={true}
        onClick={() => history.push('/text')}
      >
        <StyledBookIcon className="fas fa-book-reader" />
        <div>Clear, easy to understand text</div>
      </StyledCard>
      <StyledCard
        order={3}
        elevation={Elevation.THREE}
        interactive={true}
        onClick={() => {
          history.push('/videos');
        }}
      >
        <StyledVideoIcon className="fas fa-video" />
        <div>Helpful videos with intuitive examples</div>
      </StyledCard>
    </CardContainer>
  </StyledContainer>
);

Home.propTypes = {
  /** react-router */
  history: object.isRequired
};

export default Home;
