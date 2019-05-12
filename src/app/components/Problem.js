import React from 'react';
import StyledCard from 'app-styled/StyledCard';

const Problem = ({ problem }) => {
  return (
    <StyledCard key={problem.id}>
      <div>({problem.problem_index})</div>
    </StyledCard>
  );
};

export default Problem;
