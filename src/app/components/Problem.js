import React from 'react';
import { any, func, object } from 'prop-types';
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

const Problem = ({ problem, setProblemResponse, value }) => {
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
    <StyledCard key={problem.id} elevation={Elevation.TWO}>
      <div>({problem.problem_index})</div>
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
    </StyledCard>
  );
};

Problem.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func.isRequired,
  value: any
};

export default Problem;
