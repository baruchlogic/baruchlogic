import React from 'react';
import StyledCard from 'app-styled/StyledCard';
import styled from 'styled-components';
import { Formula } from 'logically';

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

const MultipleChoice = ({ problem, setProblemResponse, value }) => {
  const choices = problem.choices;
  return (
    <div>
      {Object.keys(choices).sort().map(key => (
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

const StyledHeader = styled.div`
  align-items: center;
  display: flex:
  justify-content: center;
`;

const StyledTruthTable = styled.div`
  align-items: center;
  display: flex:
  flex-direction: column;
  justify-content: center;
`;

const StyledRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const TruthTable = ({ problem, setProblemResponse, value }) => {
  const getAtomicVariables = proposition => {
    const result = new Set();
    for (const letter of proposition) {
      if (/[a-z]/i.test(letter)) {
        result.add(letter);
      }
    }
    return Array.from(result).sort();
  };
  const atomicVariables = getAtomicVariables(problem.prompt);
  const nRows = 2 ** atomicVariables.length;
  const formula = new Formula.default();
  const rows = formula.generateTruthTableArray(problem.prompt);
  console.log('ROWS!!!', rows);
  return (
    <table>
      <thead>
       <tr>
         {rows.map((row, i) => (
           <td key={`row-${i}`}>{row}</td>
         ))}
       </tr>
     </thead>
     <tbody>
       {new Array(nRows).fill(0).map((row, j) => (
         <tr key={`row-${j}`}>
           {rows.map((row, k) => (
             <td key={`cell-${k}`}><input /></td>
           ))}
         </tr>
       ))}
     </tbody>
    </table>
  );
};

const Problem = ({ problem, setProblemResponse, value }) => {
  let ProblemType;
  switch (problem.type) {
    case 'true_false':
      ProblemType = TrueFalse;
      break;
    case 'multiple_choice':
      ProblemType = MultipleChoice;
      break;
    case 'truth_table':
      ProblemType = TruthTable;
      break;
    default:
      break;
  }
  return (
    <StyledCard key={problem.id}>
      <div>({problem.problem_index})</div>
      <div>
        <p>{problem.prompt}</p>
        <ProblemType
          problem={problem}
          setProblemResponse={setProblemResponse}
          value={value}
        />
      </div>
    </StyledCard>
  );
};

export default Problem;
