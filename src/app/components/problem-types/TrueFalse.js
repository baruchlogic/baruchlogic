import React from 'react';
import { func, object, string } from 'prop-types';

const TrueFalse = ({ isUserAuth, problem, setProblemResponse, value }) => (
  <div>
    <label>
      <input
        type="radio"
        checked={value === 'a'}
        onChange={() => {
          setProblemResponse(problem.id, 'a');
        }}
        value={true}
        disabled={!isUserAuth}
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
        disabled={!isUserAuth}
      />
      False
    </label>
  </div>
);

TrueFalse.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func.isRequired,
  value: string
};

export default TrueFalse;
