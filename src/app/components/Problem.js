import React, { useEffect } from 'react';
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
  const formula = new Formula.default();
  const columns = formula.generateTruthTableHeaders(problem.prompt);
  console.log('COLUMNS!!!', columns);
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
  const newValue = new Array(nRows)
    .fill(0)
    .map(el => new Array(columns.length).fill(null));
  useEffect(() => {
    setProblemResponse(problem.id, newValue);
  }, []);
  const setCellValueCopy = (matrix, i, j, value) => {
    const copy = matrix.map(row => [...row]);
    copy[i][j] = value;
    return copy;
  };
  const getNextIndex = (j, k) => {
    console.log('j', j, 'k', k, 'nRows', nRows);
    if (j < nRows - 1) {
      return `${k * 1000 + j + 2}`;
    } else {
      return `${(k + 1) * 1000 + 0 + 1}`;
    }
  };
  const getPrevIndex = (j, k) => {
    console.log('j', j, 'k', k, 'nRows', nRows);
    if (j === 0) {
      return `${(k - 1) * 1000 + nRows}`;
    } else {
      return `${k * 1000 + j}`;
    }
  };
  const getRightIndex = (j, k) => {
    return `${(k + 1) * 1000 + j + 1}`;
  };
  const getLeftIndex = (j, k) => {
    return `${(k - 1) * 1000 + j + 1}`;
  };
  const focusNextElement = (j ,k) => {
    const focusedElement = document.querySelector('input:focus');
    console.log('FE', focusedElement);
    const nextTabindex = getNextIndex(j, k);
    console.log('nextTabindex', nextTabindex);
    const nextFocusedElement = document.querySelector(
      `input[tabindex="${nextTabindex}"]`
    );
    console.log('nextFocusedElement', nextFocusedElement);
    if (nextFocusedElement) nextFocusedElement.focus();
  };
  const focusPrevElement = (j, k) => {
    const focusedElement = document.querySelector('input:focus');
    console.log('FE', focusedElement);
    const prevTabIndex = getPrevIndex(j, k);
    console.log('prevTabIndex', prevTabIndex);
    const prevFocusedElement = document.querySelector(
      `input[tabindex="${prevTabIndex}"]`
    );
    console.log('prevFocusedElement', prevFocusedElement);
    if (prevFocusedElement) prevFocusedElement.focus();
  };
  const focusLeftElement = (j, k) => {
    const leftIndex = getLeftIndex(j, k);
    const leftFocusedElement = document.querySelector(
      `input[tabindex="${leftIndex}"]`
    );
    if (leftFocusedElement) leftFocusedElement.focus();
  };
  const focusRightElement = (j, k) => {
    const rightIndex = getRightIndex(j, k);
    const rightFocusedElement = document.querySelector(
      `input[tabindex="${rightIndex}"]`
    );
    if (rightFocusedElement) rightFocusedElement.focus();
  };
  const handleKeyDown = (e, j, k) => {
    const { key } = e;
    console.log('key', key);
    switch (key) {
      case 't':
      case 'T':
      case 'f':
      case 'F': {
        const newValue = setCellValueCopy(value, j, k, key);
        setProblemResponse(problem.id, newValue);
        focusNextElement(j, k);
        break;
      }
      case 'Backspace':
        console.log('backspace');
        if (value[j][k]) {
          const newValue = setCellValueCopy(value, j, k, '');
          setProblemResponse(problem.id, newValue);
        } else {
          focusPrevElement(j, k);
        }
        break;
      case 'ArrowUp':
        focusPrevElement(j, k);
        break;
      case 'ArrowDown':
        focusNextElement(j, k);
        break;
      case 'ArrowLeft':
        focusLeftElement(j, k);
        break;
      case 'ArrowRight':
        focusRightElement(j, k);
        break;
      default:
        break;
    }
  };
  console.log('value', value);
  return (
    <table>
      <thead>
        <tr>
          {columns.map((row, i) => (
            <td key={`col-${i}`}>{row}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {new Array(nRows).fill(0).map((row, j) => (
          <tr key={`row-${j}`}>
            {columns.map((row, k) => (
              <td key={`cell-${k}`}>
                <input
                  onKeyDown={e => {
                    handleKeyDown(e, j, k);
                  }}
                  value={(value && value[j][k]) || ''}
                  tabIndex={`${k * 1000 + j + 1}`}
                />
              </td>
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
