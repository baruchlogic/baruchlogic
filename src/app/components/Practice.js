import React, { lazy, useState } from 'react';
import { string } from 'prop-types';
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

Practice.propTypes = {
  problemType: string.required
};

export default Practice;
