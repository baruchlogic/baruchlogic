import React, { useEffect } from 'react';
import { any, func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically';

const StyledInput = styled.input`
  font-size: 1rem;
  text-align: center;
  width: 50px;
`;

const StyledHeaderTD = styled.td`
  white-space: nowrap;
`;

const TruthTable = ({ isUserAuth, problem, setProblemResponse, value }) => {
  // Used for `onChange` to prevent React warning;
  const emptyFn = () => {};

  // Create initial response matrix
  const columns = Formula.generateTruthTableHeaders(problem.prompt);
  const atomicVariables = Formula.getAtomicVariables(problem.prompt);
  const nRows = Math.pow(2, atomicVariables.length);
  useEffect(() => {
    const initialValue = Formula.generateTruthTable(problem.prompt, true).map(
      row => row.map(el => (el === true ? 'T' : el === false ? 'F' : ''))
    );
    if (Object.values(value || {}).length === 0) {
      setProblemResponse(problem.id, initialValue);
    }
  }, [value]);

  // Set a value in the response matrix
  const setCellValueCopy = (matrix, i, j, value) => {
    const copy = matrix.map(row => [...row]);
    copy[i][j] = value;
    return copy;
  };

  // Functions used for keyboard navigation
  const getNextIndex = (j, k) => {
    if (j < nRows - 1) {
      return `${k * 1000 + j + 2}-${problem.id}`;
    } else {
      return `${(k + 1) * 1000 + 0 + 1}-${problem.id}`;
    }
  };
  const getPrevIndex = (j, k) => {
    if (j === 0) {
      return `${(k - 1) * 1000 + nRows}-${problem.id}`;
    } else {
      return `${k * 1000 + j}-${problem.id}`;
    }
  };
  const getRightIndex = (j, k) => {
    return `${(k + 1) * 1000 + j + 1}-${problem.id}`;
  };
  const getLeftIndex = (j, k) => {
    return `${(k - 1) * 1000 + j + 1}-${problem.id}`;
  };

  // Functions used to move focus around
  const focusNextElement = (j, k) => {
    const focusedElement = document.querySelector('input:focus');
    const nextTabindex = getNextIndex(j, k);
    const nextFocusedElement = document.querySelector(
      `input[tabindex="${nextTabindex}"]`
    );
    if (nextFocusedElement) nextFocusedElement.focus();
  };
  const focusPrevElement = (j, k) => {
    const focusedElement = document.querySelector('input:focus');
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
    const { key } = e;
    switch (key) {
      case 't':
      case 'T':
      case 'f':
      case 'F': {
        const newValue = setCellValueCopy(value, j, k, key.toUpperCase());
        setProblemResponse(problem.id, newValue);
        focusNextElement(j, k);
        break;
      }
      case 'Backspace':
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
            <StyledHeaderTD key={`col-${i}-${problem.id}`}>
              {row}
            </StyledHeaderTD>
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
                  tabIndex={`${k * 1000 + j + 1}-${problem.id}`}
                  disabled={k < atomicVariables.length || !isUserAuth}
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
