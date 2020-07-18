import React from 'react';
import { bool, func, object, string } from 'prop-types';

const MultipleChoice = ({ isUserAuth, problem, setProblemResponse, value }) => {
  const { choices } = problem;
  return (
    <>
      {Object.keys(choices)
        .sort()
        .map(key => (
          <label key={key}>
            <input
              type="radio"
              checked={value === key}
              onChange={() => {
                setProblemResponse(problem.id, key);
              }}
              value={true}
              disabled={!isUserAuth}
            />
            {choices[key]}
          </label>
        ))}
    </>
  );
};

MultipleChoice.propTypes = {
  isUserAuth: bool.isRequired,
  problem: object.isRequired,
  setProblemResponse: func,
  value: string
};

MultipleChoice.defaultProps = {
  isUserAuth: false,
  problem: {}
};

export default MultipleChoice;
