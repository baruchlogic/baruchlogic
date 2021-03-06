import React, { lazy } from 'react';
import { any, bool, func, object } from 'prop-types';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import styled from 'styled-components';
const MultipleChoice = lazy(() => import('./problem-types/MultipleChoice'));
const NaturalDeduction = lazy(() => import('./problem-types/NaturalDeduction'));
const TrueFalse = lazy(() => import('./problem-types/TrueFalse'));
const TruthTable = lazy(() => import('./problem-types/TruthTable'));

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// React complains if I pass `isIncorrectResponse`
// instead of `isincorrectresponse`
const PossiblyIncorrectStyledCard = styled(StyledCard)`
  ${props =>
    props.isincorrectresponse === 'true' &&
    'border: 3px solid red; .problem__index { color: red; }'}
`;

const Problem = ({
  incorrectResponses,
  isIncorrectResponse,
  isUserAuth,
  problem,
  setProblemResponse,
  value
}) => {
  let ProblemType;
  switch (problem.problem_type) {
    case 'multiple_choice':
      ProblemType = MultipleChoice;
      break;
    case 'natural_deduction':
      ProblemType = NaturalDeduction;
      break;
    case 'true_false':
      ProblemType = TrueFalse;
      break;
    case 'truth_table':
      ProblemType = TruthTable;
      break;
    default:
      break;
  }
  const renderNewLines = text =>
    text
      .split(/(?:<br \/>)|(?:\\n)/g)
      .map((el, idx) => <div key={idx}>{renderUnderlines(el)}</div>);

  const renderUnderlines = text => {
    const split = text.split(/(?:\<u\>)|(?:\<\/u\>)/g);
    if (split.length === 3) {
      return (
        <div>
          {split[0]}
          <u>{split[1]}</u>
          {split[2]}
        </div>
      );
    } else {
      return text;
    }
  };

  return (
    <PossiblyIncorrectStyledCard
      key={problem.id}
      elevation={Elevation.TWO}
      isincorrectresponse={`${isIncorrectResponse}`}
    >
      <div className="problem__index">({problem.problem_index})</div>
      <StyledDiv>
        {problem.problem_type === 'truth_table' &&
          'Complete the truth table for the following proposition:'}
        <div>{renderNewLines(problem.prompt || '')}</div>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <ProblemType
            problem={problem}
            setProblemResponse={setProblemResponse}
            value={value}
            isUserAuth={isUserAuth}
            incorrectResponses={incorrectResponses}
          />
        </div>
      </StyledDiv>
    </PossiblyIncorrectStyledCard>
  );
};

Problem.propTypes = {
  incorrectResponses: object,
  isUserAuth: bool.isRequired,
  isIncorrectResponse: bool.isRequired,
  problem: object.isRequired,
  setProblemResponse: func,
  value: any
};

Problem.defaultProps = {
  isUserAuth: false,
  isIncorrectResponse: true,
  problem: {}
};

export default Problem;
