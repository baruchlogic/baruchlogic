import React from 'react';
import { func, object, string } from 'prop-types';

const MultipleChoice = ({ problem, setProblemResponse, value }) => {
  const { choices } = problem;
  return (
    <div>
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
            />
            {choices[key]}
          </label>
        ))}
    </div>
  );
};

MultipleChoice.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func.isRequired,
  value: string
};

export default MultipleChoice;
