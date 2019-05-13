import React from 'react';
import StyledCard from 'app-styled/StyledCard';

const TrueFalse = ({ problem, setProblemResponse, value }) => (
  <div>
    <label>
      <input
        type="radio"
        checked={value === 'a'}
        onChange={() => {
          setProblemResponse(problem.id, 'a');
        }}
        value={true}
      />
      True
    </label>
    <label>
      <input
        type="radio"
        checked={value === 'b'}
        onChange={() => {
          setProblemResponse(problem.id, 'b');
        }}
        value={false}
      />
      False
    </label>
  </div>
);

const Problem = ({ problem, setProblemResponse, value }) => {
  return (
    <StyledCard key={problem.id}>
      <div>({problem.problem_index})</div>
      <div>
        <p>{problem.prompt}</p>
        <TrueFalse
          problem={problem}
          setProblemResponse={setProblemResponse}
          value={value}
        />
      </div>
    </StyledCard>
  );
};

export default Problem;
