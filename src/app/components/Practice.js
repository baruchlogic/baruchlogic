import React, { lazy, useState } from 'react';
const TruthTable = lazy(() => import('./practice/TruthTable'));

const Practice = ({ problemType = 'truth-table' }) => {
  const P = () => <div>PROBLEM!</div>;
  const [response, setResponse] = useState();
  let ProblemType;
  switch (problemType) {
    case 'truth-table':
      ProblemType = TruthTable;
      break;
    default:
      ProblemType = P;
      break;
  }
  return <ProblemType value={response} setProblemResponse={setResponse} />;
};

export default Practice;
