import React, { useEffect, useState } from 'react';
import { number } from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
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

const ProblemsetContainer = ({ isUserAuth, problemsetId }) => {
  const [problemset, setProblemset] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problemsetResponses, setProblemsetResponses] = useState({});
  const [currentScore, setCurrentScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [incorrectProblems, setIncorrectProblems] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchProblemSet = async () => {
    const result = await authFetch(
      `${API_BASE_URL}/api/problemsets/${problemsetId}`
    ).then(res => res.json());
    setProblemset(result);
  };

  const fetchProblems = async () => {
    const result = await fetch(
      `${API_BASE_URL}/api/problemsets/${problemsetId}/problems`
    ).then(res => res.json());
    // console.log('RESULT', result);
    setProblems(result);
  };

  const fetchBestScore = async () => {
    const result = await authFetch(
      `${API_BASE_URL}/api/problemsets/${problemsetId}/score`
    ).then(res => res.text());
    setBestScore(result);
  };

  const onReset = () => {
    setProblemsetResponses({});
    setCurrentScore(null);
    setIncorrectProblems({});
    setHasSubmitted(false);
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
    onReset();
  }, [problemsetId]);

  // useEffect(() => {
  //   // console.log('problemsetResponses', problemsetResponses);
  // }, [problemsetResponses]);

  const setProblemResponse = (problemId, response) => {
    // console.log('setProblemResponse', problemsetResponses, problemId, response);
    setProblemsetResponses(problemsetResponses => ({
      ...problemsetResponses,
      [problemId]: response
    }));
  };

  const onSubmit = async () => {
    // console.log(JSON.stringify(problemsetResponses));
    const response = await authFetch(
      `${API_BASE_URL}/api/problemsets/${problemsetId}`,
      'POST',
      { body: JSON.stringify(problemsetResponses) }
    );
    const {
      incorrectProblems: incorrectProblemsResponse,
      score
    } = await response.json();
    // console.log('incorrectProblemsResponse', incorrectProblemsResponse);
    setCurrentScore(score);
    setIncorrectProblems(
      incorrectProblemsResponse.reduce(
        (acc, problem) => ({ ...acc, [problem.id]: problem }),
        {}
      )
    );
    fetchBestScore();
    setHasSubmitted(true);
  };

  const onRestoreBestResponses = async () => {
    const result = await authFetch(
      `${API_BASE_URL}/api/problemsets/${problemsetId}/responses`
    ).then(res => res.json());
    setProblemsetResponses(result.responses || {});
  };

  const dueDateMoment =
    problemset && problemset.due_date ? moment(problemset.due_date) : null;

  // console.log('dueDateMoment', dueDateMoment);

  const styledDueDate =
    dueDateMoment && dueDateMoment.format('MMMM Do YYYY, h:mm');

  // console.log('styledDueDate', styledDueDate, moment());

  const isPastDueDate = dueDateMoment && dueDateMoment.isBefore(moment());

  return (
    <StyledContainer>
      {problemset && <h1>{`Problemset #${problemset.default_order}`}</h1>}
      {styledDueDate && <h2>{`Due date: ${styledDueDate}`}</h2>}
      {isPastDueDate && <h2>NOTE: Due date has passed</h2>}
      {!isUserAuth && (
        <h2>Please log in to interact with the problemsets.</h2>
      )}
      {problems.map(problem => (
        <Problem
          key={problem.id}
          isIncorrectResponse={
            !!incorrectProblems[problem.id] ||
            (hasSubmitted && problemsetResponses[problem.id] === undefined)
          }
          responseData={
            problem
          }
          value={problemsetResponses[problem.id]}
          problem={problem}
          setProblemResponse={setProblemResponse}
          isUserAuth={isUserAuth}
        />
      ))}
      <StyledCard elevation={Elevation.THREE}>
        <div>
          {isPastDueDate && (
            <div>
              NOTE: The due date for this assignment has passed. Your score will
              not be recorded.
            </div>
          )}
          <StyledButton intent="success" large onClick={onSubmit} disabled={!isUserAuth}>
            SUBMIT
          </StyledButton>
        </div>
        <div>
          <StyledResetButton intent="success" large onClick={onReset} disabled={!isUserAuth}>
            RESET RESPONSES
          </StyledResetButton>
        </div>
        <div>
          <StyledResetButton
            intent="success"
            large
            onClick={onRestoreBestResponses}
            disabled={!isUserAuth}
          >
            RESTORE BEST RESPONSES
          </StyledResetButton>
        </div>
      </StyledCard>

      <StyledCard elevation={Elevation.THREE}>
        <div>SCORES</div>
        <div>Current Score: {currentScore}</div>
        <div>Your Best Score: {Number(bestScore) || ''}</div>
      </StyledCard>
    </StyledContainer>
  );
};

ProblemsetContainer.propTypes = {
  problemsetId: number
};

export default ProblemsetContainer;
