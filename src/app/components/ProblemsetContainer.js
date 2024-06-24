import React, { useEffect, useState } from 'react';
import { bool, number } from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import Problem from './Problem';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';
import { ApiBaseUrl } from '../constants';
import { saveToLocalStorage } from '../helpers/localStorage';

const StyledContainer = styled.div`
  margin: auto;
  text-align: center;
  width: ${props => (props.column ? '80%' : '60%')};
`;

const StyledButton = styled(Button)`
  margin: 8px;
`;

const StyledResetButton = styled(StyledButton)`
  background-color: #2e0f4c !important;
`;

//Initializing problemsetResponses from local storage (See 'README.md' 2023 February Update for details)
const key = 'ProblemsetResponses';
if (!localStorage.getItem(key)) saveToLocalStorage(key, {});
const fromLocalStorage = JSON.parse(localStorage.getItem(key));

const ProblemsetContainer = ({ column, isUserAuth, problemsetId }) => {
  const [problemsetResponses, setProblemsetResponses] = useState(fromLocalStorage);
  const [problemset, setProblemset] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [incorrectProblems, setIncorrectProblems] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchProblemSet = async () => {
    const result = await authFetch(
      `${ApiBaseUrl}/api/problemsets/${problemsetId}`
    ).then(res => res.json());
    setProblemset(result);
  };

  const fetchProblems = async () => {
    const result = await fetch(
      `${ApiBaseUrl}/api/problemsets/${problemsetId}/problems`
    ).then(res => res.json());
    setProblems(result);
  };

  const fetchBestScore = async () => {
    const result = await authFetch(
      `${ApiBaseUrl}/api/problemsets/${problemsetId}/score`
    ).then(res => res.text());
    setBestScore(result);
  };

  const onReset = () => {
    setCurrentScore(null);
    setIncorrectProblems({});
    setHasSubmitted(false);
    setProblemsetResponses({})
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

  // useEffect(() => {
  //   onReset();
  // }, [problemsetId]);

  useEffect(() => {
    saveToLocalStorage(key, problemsetResponses);
  }, [problemsetResponses]);

  const setProblemResponse = (problemId, response) => {
    setProblemsetResponses(problemsetResponses => ({
      ...problemsetResponses,
      [problemId]: response
    }));
  };
  function removeOtherProblemsetsResponses() { //removes saved problem responses not related to the current page's problemsetResponses (solves issue of if for e.g. problemset #6 was accidentally clicked instead of problemset #5. When problemset 5 is loaded, problemset #6's saved default (T/F) answers are still saved in problemsetResponses. This function will filter out the unwanted problemResponses)
    if (problemsetResponses === {}) return;
    const asArray = Object.entries(problemsetResponses);
    const filtered = asArray.filter(([id]) => id >= problems[0].id && id <= problems.at(-1).id);
    const filteredProblemsetResponses = Object.fromEntries(filtered);
    setProblemsetResponses(filteredProblemsetResponses);
  }
  const onSubmit = async () => {
    removeOtherProblemsetsResponses();
    const response = await authFetch(
      `${ApiBaseUrl}/api/problemsets/${problemsetId}`,
      'POST',
      { body: JSON.stringify(problemsetResponses) }
    );
    const {
      incorrectProblems: incorrectProblemsResponse,
      score
    } = await response.json();
    setCurrentScore(score);
    setIncorrectProblems(
      incorrectProblemsResponse.reduce(
        (acc, problem) => ({ ...acc, [problem.id]: problem }),
        {}
      )
    );
    fetchBestScore();
    setProblemsetResponses({});
    setHasSubmitted(true);
  };

  const onRestoreBestResponses = async () => {
    const result = await authFetch(
      `${ApiBaseUrl}/api/problemsets/${problemsetId}/responses`
    ).then(res => res.json());
    setProblemsetResponses(result.responses || {});
  };

  const dueDateMoment =
    problemset && problemset.due_date ? moment(problemset.due_date) : null;

  const styledDueDate =
    dueDateMoment && dueDateMoment.format('MMMM Do YYYY, h:mm');

  const isPastDueDate = dueDateMoment && dueDateMoment.isBefore(moment());
  return (
    <StyledContainer column={column}>
      {problemset && <h1>{`Problemset #${problemset.default_order}`}</h1>}
      {styledDueDate && <h2>{`Due date: ${styledDueDate}`}</h2>}
      {isPastDueDate && <h2>NOTE: Due date has passed</h2>}
      {!isUserAuth && <h2>Please log in to interact with the problemsets.</h2>}
      {problems.map(problem => (
        <Problem
          key={problem.id}
          isIncorrectResponse={
            !!incorrectProblems[problem.id] ||
            (hasSubmitted && problemsetResponses[problem.id] === undefined)
          }
          value={problemsetResponses[problem.id]}
          problem={problem}
          setProblemResponse={setProblemResponse}
          isUserAuth={isUserAuth}
          incorrectResponses={incorrectProblems[problem.id]}
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
          <StyledButton
            intent="success"
            large
            onClick={onSubmit}
            disabled={!isUserAuth}
          >
            SUBMIT
          </StyledButton>
        </div>
        <div>
          <StyledResetButton
            intent="success"
            large
            onClick={onReset}
            disabled={!isUserAuth}
          >
            RESET RESPONSES
          </StyledResetButton>
        </div>
        <div>
          <StyledResetButton
            intent="success"
            large
            disabled={!isUserAuth}
            onClick={onRestoreBestResponses}
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
  column: bool.isRequired,
  isUserAuth: bool.isRequired,
  problemsetId: number
};

ProblemsetContainer.defaultProps = {
  column: false,
  isUserAuth: false
};

export default ProblemsetContainer;
