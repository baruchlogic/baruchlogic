import React, { lazy } from 'react';
const TruthTable = lazy(() => import('./practice/TruthTable'));

const Practice = ({ problemType = 'truth-table' }) => {
  const P = () => <div>PROBLEM!</div>;
  let ProblemType;
  switch (problemType) {
    case 'truth-table':
      ProblemType = TruthTable;
      break;
    default:
      ProblemType = P;
      break;
  }
  return <ProblemType />;
};

export default Practice;
