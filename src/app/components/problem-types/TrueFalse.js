import React from 'react';
import { bool, func, object, string } from 'prop-types';

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
  isUserAuth: bool.isRequired,
  problem: object.isRequired,
  setProblemResponse: func,
  value: string
};

TrueFalse.defaultProps = {
  isUserAuth: false,
  problem: {}
};

export default TrueFalse;
