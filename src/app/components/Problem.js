import React from 'react';
import { any, boolean, func, object } from 'prop-types';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import styled from 'styled-components';
import MultipleChoice from './problem-types/MultipleChoice';
import TrueFalse from './problem-types/TrueFalse';
import TruthTable from './problem-types/TruthTable';

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PossiblyIncorrectStyledCard = styled(StyledCard)`
  ${props => props.isIncorrectResponse && 'border: 3px solid red;'}
  ${props => props.isIncorrectResponse && '.problem__index { color: red; }'}
`;

const Problem = ({
  isIncorrectResponse,
  problem,
  setProblemResponse,
  value
}) => {
  let ProblemType;
  switch (problem.type) {
    case 'true_false':
      ProblemType = TrueFalse;
      break;
    case 'multiple_choice':
      ProblemType = MultipleChoice;
      break;
    case 'truth_table':
      ProblemType = TruthTable;
      break;
    default:
      break;
  }
  return (
    <PossiblyIncorrectStyledCard
      key={problem.id}
      elevation={Elevation.TWO}
      isIncorrectResponse={isIncorrectResponse}
    >
      <div className="problem__index">({problem.problem_index})</div>
      <StyledDiv>
        {problem.type === 'truth_table' &&
          'Complete the truth table for the following proposition:'}
        <div>{problem.prompt}</div>
        <ProblemType
          problem={problem}
          setProblemResponse={setProblemResponse}
          value={value}
        />
      </StyledDiv>
    </PossiblyIncorrectStyledCard>
  );
};

Problem.propTypes = {
  isIncorrectResponse: boolean.isRequired,
  problem: object.isRequired,
  setProblemResponse: func.isRequired,
  value: any
};

export default Problem;
