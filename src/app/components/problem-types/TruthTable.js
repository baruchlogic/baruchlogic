import React, { useEffect } from 'react';
import { any, func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically-locally';

const StyledInput = styled.input`
  // width: 50px;
`;

const TruthTable = ({ problem, setProblemResponse, value }) => {
  // Used for `onChange` to prevent React warning;
  const emptyFn = () => {};

  // Create initial response matrix
  const formula = new Formula();
  const columns = formula.generateTruthTableHeaders(problem.prompt);
  console.log('COLUMNS', columns);
  const initialValue = formula
    .generateTruthTable(problem.prompt, true)
    .map(row => row.map(el => (el === true ? 't' : el === false ? 'f' : '')));
  const atomicVariables = formula.getAtomicVariables(problem.prompt);
  const nRows = Math.pow(2, atomicVariables.length);
  useEffect(() => {
    console.log('SET', problem.id);
    setProblemResponse(problem.id, initialValue);
  }, []);

  // Set a value in the response matrix
  const setCellValueCopy = (matrix, i, j, value) => {
    const copy = matrix.map(row => [...row]);
    copy[i][j] = value;
    return copy;
  };

  // Functions used for keyboard navigation
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

  // Functions used to move focus around
  const focusNextElement = (j, k) => {
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
        const newValue = setCellValueCopy(value, j, k, key.toLowerCase());
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

  return (
    <table>
      <thead>
        <tr>
          {columns.map((row, i) => (
            <td key={`col-${i}-${problem.id}`}>{row}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {new Array(nRows).fill(0).map((row, j) => (
          <tr key={`row-${j}-${problem.id}`}>
            {columns.map((row, k) => (
              <td key={`cell-${k}-${problem.id}`}>
                <StyledInput
                  onKeyDown={e => {
                    handleKeyDown(e, j, k);
                  }}
                  onChange={emptyFn}
                  value={(value && value[j][k]) || ''}
                  tabIndex={`${k * 1000 + j + 1}`}
                  disabled={k < atomicVariables.length}
                />
            </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

TruthTable.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func.isRequired,
  value: any
};

export default TruthTable;
