import React, { useEffect, useState } from 'react';
import { array, bool, func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically';
import { authFetch } from 'helpers/auth';

const StyledInput = styled.input`
  font-size: 1rem;
  text-align: center;
  width: 50px;
  color: ${props => (props.incorrect ? 'red' : 'black' )};
`;

const StyledHeaderTD = styled.td`
  white-space: nowrap;
`;

const TruthTable = ({ setProblemResponse, value }) => {
  // Used for `onChange` to prevent React warning;
  const emptyFn = () => {};
  const [prompt, setPrompt] = useState(Formula.generateRandomFormulaString());
  const [correct, setCorrect] = useState(true);
  const [solution, setSolution] = useState();
  const [showErrors, setShowErrors] = useState(false);

  // Create initial response matrix
  const columns = Formula.generateTruthTableHeaders(prompt);
  const atomicVariables = Formula.getAtomicVariables(prompt);
  const nRows = Math.pow(2, atomicVariables.length);
  useEffect(() => {
    const initialValue = Formula.generateTruthTable(
      prompt,
      true
    ).map(row => row.map(el => (el === true ? 'T' : el === false ? 'F' : '')));
    if (Object.values(value || {}).length === 0) {
      setProblemResponse(initialValue);
    }
  }, [value]);

  const generateNewPrompt = () => {
    setPrompt(Formula.generateRandomFormulaString());
    setShowErrors(false);
  };

  useEffect(() => {
    const initialValue = Formula.generateTruthTable(
      prompt,
      true
    ).map(row => row.map(el => (el === true ? 'T' : el === false ? 'F' : '')));
    setProblemResponse(initialValue);
  }, [prompt]);

  const submitResponse = async () => {
    const response = await authFetch(
      `${API_BASE_URL}/api/practice/truth-table`,
      'POST',
      { body: JSON.stringify({
        value,
        prompt
      }) }
    ).then(res => res.json());
    const {
      solution,
      score
    } = response;
    setSolution(solution.map(a => a.map(el => el ? 'T' : 'F' )));
    console.log('HERE!!!!', solution, score);
    if (!score) {
      setCorrect(false);
    } else {
      setCorrect(true);
    }
  };

  // Set a value in the response matrix
  const setCellValueCopy = (matrix, i, j, value) => {
    const copy = matrix.map(row => [...row]);
    copy[i][j] = value;
    return copy;
  };

  // Functions used for keyboard navigation
  const getNextIndex = (j, k) => {
    if (j < nRows - 1) {
      return `${k * 1000 + j + 2}`;
    } else {
      return `${(k + 1) * 1000 + 0 + 1}`;
    }
  };
  const getPrevIndex = (j, k) => {
    if (j === 0) {
      return `${(k - 1) * 1000 + nRows}`;
    } else {
      return `${k * 1000 + j}`;
    }
  };
  const getRightIndex = (j, k) => `${(k + 1) * 1000 + j + 1}`;
  const getLeftIndex = (j, k) => `${(k - 1) * 1000 + j + 1}`;

  // Functions used to move focus around
  const focusNextElement = (j, k) => {
    // const focusedElement = document.querySelector('input:focus');
    const nextTabindex = getNextIndex(j, k);
    const nextFocusedElement = document.querySelector(
      `input[tabindex="${nextTabindex}"]`
    );
    if (nextFocusedElement) nextFocusedElement.focus();
  };
  const focusPrevElement = (j, k) => {
    // const focusedElement = document.querySelector('input:focus');
    const prevTabIndex = getPrevIndex(j, k);
    const prevFocusedElement = document.querySelector(
      `input[tabindex="${prevTabIndex}"]`
    );
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
    e.preventDefault();
    const { key } = e;
    switch (key) {
      case 't':
      case 'T':
      case 'f':
      case 'F': {
        const newValue = setCellValueCopy(value, j, k, key.toUpperCase());
        setProblemResponse(newValue);
        focusNextElement(j, k);
        break;
      }
      case 'Backspace':
        if (value[j][k]) {
          const newValue = setCellValueCopy(value, j, k, '');
          setProblemResponse(newValue);
        } else {
          focusPrevElement(j, k);
        }
        break;
      case 'ArrowUp':
        focusPrevElement(j, k);
        break;
      case 'ArrowDown':
      case 'Tab':
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

  console.log(solution, value);

  return (
    <div style={{ overflow: 'scroll', width: '100%' }}>
      <div>Complete the truth table for the following proposition</div>
      <div>{prompt}</div>
      <table style={{ margin: 'auto' }}>
        <thead>
          <tr>
            {columns.map((row, i) => (
              <StyledHeaderTD
                key={`col-${i}`}
                style={{
                  borderRight:
                    i === columns.length - 1 ? 'none' : '2px solid black'
                }}
              >
                {row}
              </StyledHeaderTD>
            ))}
          </tr>
        </thead>
        <tbody>
          {new Array(nRows).fill(0).map((row, j) => {
            return (
              <tr key={`row-${j}`}>
                {columns.map((row, k) => {
                  const s = solution && solution[j] && solution[j][k];
                  const v = value && value[j] && value[j][k];
                  const incorrect = s !== v;
                  return (
                    <td key={`cell-${k}`}>
                      <StyledInput
                        incorrect={showErrors && incorrect}
                        onKeyDown={e => {
                          handleKeyDown(e, j, k);
                        }}
                        onChange={emptyFn}
                        value={(value && value[j][k]) || ''}
                        tabIndex={`${k * 1000 + j + 1}`}
                        disabled={k < atomicVariables.length}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ textAlign: 'center' }}>
        <button onClick={submitResponse}>SUBMIT</button>
      </div>
      <div>
        RESULT: {correct ? 'CORRECT' : 'INCORRECT'}
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={generateNewPrompt}>GENERATE NEW PROPOSITION</button>
      </div>
      <div onClick={() => {setShowErrors(true);}} style={{ textAlign: 'center' }}>
        <button>SHOW INCORRECT CELLS</button>
      </div>
    </div>
  );
};

TruthTable.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func,
  value: array
};

TruthTable.defaultProps = {
  problem: {}
};

export default TruthTable;
