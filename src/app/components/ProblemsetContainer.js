import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';
import Problem from './Problem';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';

const StyledContainer = styled.div`
  width: 80%;
`;

const StyledButton = styled(Button)`
  margin: 8px;
`;

const StyledResetButton = styled(StyledButton)`
  background-color: #2e0f4c !important;
`;

const ProblemsetContainer = ({ problemsetId }) => {
  const [problemset, setProblemset] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problemsetResponses, setProblemsetResponses] = useState({});
  const [currentScore, setCurrentScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [incorrectProblemIDs, setIncorrectProblemIDs] = useState(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchProblemSet = async () => {
    const result = await fetch(
      `http://localhost:5000/api/problemsets/${problemsetId}`
    ).then(res => res.json());
    setProblemset(result);
  };

  const fetchProblems = async () => {
    const result = await fetch(
      `http://localhost:5000/api/problemsets/${problemsetId}/problems`
    ).then(res => res.json());
    setProblems(result);
  };

  const fetchBestScore = async () => {
    const result = await authFetch(
      `http://localhost:5000/api/problemsets/${problemsetId}/score`
    ).then(res => res.text());
    setBestScore(result);
  };

  useEffect(() => {
    fetchProblemSet();
  }, [problemsetId]);

  useEffect(() => {
    fetchProblems();
  }, [problemsetId]);

  useEffect(() => {
    fetchBestScore();
  }, [problemsetId]);

  useEffect(() => {
    setCurrentScore(null);
  }, [problemsetId]);

  useEffect(() => {
    console.log('problemsetResponses', problemsetResponses);
  }, [problemsetResponses]);

  const setProblemResponse = (problemId, response) => {
    console.log('setProblemResponse', problemsetResponses, problemId, response);
    setProblemsetResponses(problemsetResponses => ({
      ...problemsetResponses,
      [problemId]: response
    }));
  };

  const onReset = () => {
    setProblemsetResponses({});
    setCurrentScore(null);
    setIncorrectProblemIDs(new Set());
    setHasSubmitted(false);
  };

  const onSubmit = async () => {
    console.log(JSON.stringify(problemsetResponses));
    const response = await authFetch(
      `http://localhost:5000/api/problemsets/${problemsetId}`,
      'POST',
      { body: JSON.stringify(problemsetResponses) }
    );
    const { incorrectProblemIDs, score } = await response.json();
    console.log('incorrectProblemIDs', incorrectProblemIDs);
    setCurrentScore(score);
    setIncorrectProblemIDs(new Set(incorrectProblemIDs.map(id => Number(id))));
    fetchBestScore();
    setHasSubmitted(true);
  };

  const problemsetNumber =
    problemset && problemset.unit + problemset.index_in_unit - 1;

  return (
    <StyledContainer>
      <h1>{`Problemset #${problemsetNumber}`}</h1>
      {problems.map(problem => (
        <Problem
          key={problem.id}
          isIncorrectResponse={
            incorrectProblemIDs.has(problem.id) ||
            (hasSubmitted && problemsetResponses[problem.id] === undefined)
          }
          value={problemsetResponses[problem.id]}
          problem={problem}
          setProblemResponse={setProblemResponse}
        />
      ))}
      <StyledCard elevation={Elevation.THREE}>
        <div>
          <StyledButton intent="success" large onClick={onSubmit}>
            SUBMIT
          </StyledButton>
        </div>
        <div>
          <StyledResetButton intent="success" large onClick={onReset}>
            RESET RESPONSES
          </StyledResetButton>
        </div>
      </StyledCard>

      <StyledCard elevation={Elevation.THREE}>
        <div>SCORES</div>
        <div>Current Score: {currentScore}</div>
        <div>Your Best Score: {bestScore}</div>
      </StyledCard>
    </StyledContainer>
  );
};

ProblemsetContainer.propTypes = {
  problemsetId: string
};

export default ProblemsetContainer;
