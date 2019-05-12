import React from 'react';
import StyledCard from 'app-styled/StyledCard';

const TrueFalse = ({ problem, setProblemResponse, value}) => (
  <div>
    <label>
      <input
      type="radio"
      checked={value}
      onChange={() => {setProblemResponse(problem.id, true);}}
      value={true}
    />
      True
    </label>
    <label>
      <input
      type="radio"
      checked={!value}
      onChange={() => {setProblemResponse(problem.id, false);}}
      value={false}
    />
      False
    </label>
  </div>
);

const Problem = ({ problem, setProblemResponse }) => {
  return (
    <StyledCard key={problem.id}>
      <div>({problem.problem_index})</div>
      <div>
        <p>{problem.prompt}</p>
        <TrueFalse problem={problem} setProblemResponse={setProblemResponse} value={true}/>
      </div>
    </StyledCard>
  );
};

export default Problem;
