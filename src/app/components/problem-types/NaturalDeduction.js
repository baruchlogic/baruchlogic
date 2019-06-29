import React from 'react';
import { array, func, object } from 'prop-types';

const NaturalDeduction = ({ problem, setProblemResponse, value }) => {
  console.log('deduction');
  const { premises, conclusion } = problem.deduction_prompt;
  return (
    <div>
      <div>
        <div>
          Premises:
          <br />
          {premises.map( premise => (
            <div key={premise}>{premise}</div>
          ))}
        </div>
        <div>
          Conclusion:
          <br />
          {conclusion}
        </div>
      </div>
    </div>
  );
};

NaturalDeduction.propTypes = {
  problem: object,
  setProblemResponse: func,
  value: array
}

export default NaturalDeduction;
