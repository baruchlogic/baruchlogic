import React, { useEffect, useState } from 'react';
import { func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { CITED_LINES_COUNT, DEDUCTION_RULES } from 'logically-local';
import UpArrow from '../../assets/up-arrow.png';
import DownArrow from '../../assets/down-arrow.png';
import TrashIcon from '../../assets/trash-icon.png';

const ProofContainer = styled.div`
  display: flex;
  width: 100%;
  & > div {
    text-align: center;
    width: 50%;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const NaturalDeduction = ({
  incorrectResponses,
  problem,
  setProblemResponse,
  value
}) => {
  const { premises, conclusion } = problem.deduction_prompt;

  const incorrectMoves = incorrectResponses?.responseData?.incorrectMoves || [];

  const initialLines = premises.map((premise, index) => ({
    proposition: new Formula(premise),
    rule: 'Premise',
    citedLines: []
  }));

  const initialProposition = {
    proposition: '',
    rule: Object.values(DEDUCTION_RULES)[0],
    citedLines: ''
  };

  const [newProposition, setNewProposition] = useState(initialProposition);
  const [tempPropositionStrings, setTempPropositionStrings] = useState('');
  const [tempCitedLines, setTempCitedLines] = useState(
    new Array(premises.length)
  );

  // Populate initial lines on reset or on start
  useEffect(() => {
    if (value.linesOfProof.length === 0) {
      setProblemResponse(problem.id, { linesOfProof: initialLines });
      setNewProposition(initialProposition);
    }
  });

  useEffect(() => {
    setTempPropositionStrings(
      value.linesOfProof.map(p => p.proposition.prettifiedFormula)
    );
  }, [value.linesOfProof]);

  const handleNewLinePropositionChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, proposition: value });
  };

  const handleNewLineRuleChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, rule: value });
  };

  const handleNewLineCitedLinesChange = ({ target: { value: val } }) => {
    const lastValue = val.slice(-1);
    if (
      !(!isNaN(Number(lastValue)) || lastValue === ',' || lastValue === ' ')
    ) {
      return;
    }
    setNewProposition({ ...newProposition, citedLines: val });
  };

  console.log('newProposition', newProposition);

  const handleUpdateProposition = ({ target: { value: val } }, index) => {
    if (index < problem.deduction_prompt.premises.length) {
      return;
    }
    const copy = tempPropositionStrings.slice();
    copy[index] = val;
    setTempPropositionStrings(copy);
  };

  const submitUpdateProposition = index => {
    const response = Object.assign({}, value);
    if (Formula.isWFFString(tempPropositionStrings[index])) {
      const proposition = new Formula(tempPropositionStrings[index]);
      response.linesOfProof[index].proposition = proposition;
      setProblemResponse(problem.id, response);
    } else {
      alert('Not a well-formed proposition.');
      const copy = tempPropositionStrings.slice();
      copy[index] = value.linesOfProof[index].proposition.formulaString;
      setTempPropositionStrings(copy);
    }
  };

  const submitUpdateCitedLines = index => {
    const response = Object.assign({}, value);
    const clean = cleanCitedLinesString(tempCitedLines[index]);
    const citedLinesArray = clean.split(/[\s,]+/).map(Number);
    const rule = value.linesOfProof[index].rule;
    if (citedLinesArray.length !== CITED_LINES_COUNT[rule]) {
      alert(
        `Incorrect number of cited lines: expected ${CITED_LINES_COUNT[rule]}`
      );
      return;
    }
    response.linesOfProof[index].citedLines = citedLinesArray;
    setProblemResponse(problem.id, response);
    setTempCitedLines(lines => {
      lines[index] = clean;
      return lines;
    });
  };

  const handleUpdateRule = ({ target: { value: val } }, index) => {
    const newProblemResponse = Object.assign({}, value);
    newProblemResponse.linesOfProof[index].rule = val;
    setProblemResponse(problem.id, newProblemResponse);
  };

  const handleUpdateCitedLines = ({ target: { value: val } }, index) => {
    const lastVal = val.slice(-1);
    if (!/[\d\s,]/.test(lastVal)) {
      return;
    }
    setTempCitedLines(lines => {
      lines[index] = val;
      return lines;
    });
  };

  const deleteLine = index => {
    setProblemResponse(problem.id, {
      linesOfProof: [
        ...value.linesOfProof.slice(0, index),
        ...value.linesOfProof.slice(index + 1)
      ]
    });
    setTempCitedLines(lines => {
      lines.splice(index, 1);
      return lines;
    });
  };

  const cleanCitedLinesString = line =>
    line
      .replace(/,\s+,/g, ',')
      .replace(/[\s,]+$/, '')
      .replace(/,+/g, ',')
      .replace(/\s+/g, ' ')
      .replace(/^[\s,]+/, '')
      .replace(/,[^\d]+/, ', ');

  const addNewLine = (index = value.linesOfProof.length) => {
    console.log('INDEX', index);
    const { citedLines, proposition, rule } = newProposition;
    const clean = cleanCitedLinesString(citedLines);

    const lines = clean.split(/[\s,]+/).map(Number);
    console.log('LINES', lines, clean);
    if (!Formula.isWFFString(proposition)) {
      alert('Proposition is not a well-formed formula.');
      return;
    }
    if (lines.length !== CITED_LINES_COUNT[rule]) {
      alert(
        `Incorrect number of cited lines: expecting ${CITED_LINES_COUNT[rule]}`
      );
      return;
    }
    const newLine = {
      citedLines: lines,
      proposition: new Formula(proposition),
      rule
    };
    const copy = value.linesOfProof.slice();
    copy.splice(index, 0, newLine);
    setProblemResponse(problem.id, {
      linesOfProof: copy
    });
    setNewProposition(initialProposition);
    setTempCitedLines(lines => {
      lines.splice(index, 0, clean);
      return lines;
    });
  };

  console.log('TEMPCITEDLINES', tempCitedLines);

  return (
    <div style={{ width: '100%' }}>
      <div>
        <div>
          Premises:
          <br />
          {premises.map(premise => (
            <div key={premise}>{premise}</div>
          ))}
        </div>
        <div>
          Conclusion:
          <br />
          {conclusion}
        </div>
      </div>

      <ProofContainer>
        <table>
          <thead>
            <tr>
              <th>Line #</th>
              <th>Propositions</th>
              <th>Justifications</th>
              <th>Cited Lines</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {value.linesOfProof.map((line, index) => (
              <tr
                key={index}
                style={{ color: incorrectMoves[index] ? 'red' : 'black' }}
              >
                <td>{index}</td>
                <td>
                  <input
                    value={tempPropositionStrings[index]}
                    onChange={e => {
                      handleUpdateProposition(e, index);
                    }}
                    onBlur={() => {
                      submitUpdateProposition(index);
                    }}
                  />
                </td>
                {line.rule === DEDUCTION_RULES.PREMISE ? (
                  <td>
                    <input value={line.rule} readOnly />
                  </td>
                ) : (
                  <td>
                    <select
                      onChange={e => {
                        handleUpdateRule(e, index);
                      }}
                      onBlur={e => {
                        handleUpdateRule(e, index);
                      }}
                      value={line.rule}
                    >
                      {Object.values(DEDUCTION_RULES)
                        .filter(rule => rule !== DEDUCTION_RULES.PREMISE)
                        .map(rule => (
                          <option key={rule} value={rule}>
                            {rule}
                          </option>
                        ))}
                    </select>
                  </td>
                )}
                <td>
                  {line.rule === DEDUCTION_RULES.PREMISE ? (
                    <input value={''} />
                  ) : (
                    <input
                      value={tempCitedLines[index]}
                      onChange={e => {
                        handleUpdateCitedLines(e, index);
                      }}
                      onBlur={e => {
                        submitUpdateCitedLines(index);
                      }}
                    />
                  )}
                </td>
                <td
                  style={{
                    display: 'flex',
                    height: '25px',
                    justifyContent: 'space-around',
                    minWidth: '100px'
                  }}
                >
                  <div
                    style={{ height: '100%', width: '25%' }}
                    onClick={() => {
                      deleteLine(index);
                    }}
                    role="button"
                    onKeyDown={e => {
                      if (e.keyCode === 13) deleteLine(index);
                    }}
                    tabIndex="0"
                  >
                    <img
                      src={TrashIcon}
                      style={{
                        width: 'auto',
                        height: '25px',
                        cursor: 'pointer'
                      }}
                      alt="Trash icon"
                    />
                  </div>
                  <div
                    style={{ height: '100%', width: '25%' }}
                    onClick={() => {
                      addNewLine(index);
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === 13) addNewLine(index);
                    }}
                    role="button"
                    tabIndex="0"
                  >
                    <img
                      src={UpArrow}
                      style={{
                        width: 'auto',
                        height: '25px',
                        cursor: 'pointer'
                      }}
                      alt="Add line above icon"
                    />
                  </div>
                  <div
                    style={{ height: '100%', width: '25%' }}
                    onClick={() => {
                      addNewLine(index + 1);
                    }}
                    onKeyDown={e => {
                      if (e.keyCode === 13) addNewLine(index + 1);
                    }}
                    role="button"
                    tabIndex="0"
                  >
                    <img
                      src={DownArrow}
                      style={{
                        width: 'auto',
                        height: '25px',
                        cursor: 'pointer'
                      }}
                      alt="Add line below icon"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ProofContainer>

      <div>
        New Line:
        <br />
        <div>
          Proposition:{' '}
          <input
            onChange={handleNewLinePropositionChange}
            onBlur={handleNewLinePropositionChange}
            value={newProposition.proposition}
          />
        </div>
        <div>
          Justification:
          <select
            onChange={handleNewLineRuleChange}
            onBlur={handleNewLineRuleChange}
            value={newProposition.rule}
          >
            {Object.values(DEDUCTION_RULES)
              .filter(rule => rule !== DEDUCTION_RULES.PREMISE)
              .map(rule => (
                <option key={rule} value={rule}>
                  {rule}
                </option>
              ))}
          </select>
        </div>
        <div>
          Cited Lines:
          <input
            value={newProposition.citedLines}
            onChange={handleNewLineCitedLinesChange}
          />
        </div>
        <StyledIcon
          icon={IconNames.ADD}
          iconSize={32}
          onClick={() => {
            addNewLine();
          }}
          role="button"
          tabIndex="0"
          onKeyDown={e => {
            if (e.keyCode === 13) addNewLine();
          }}
        />
      </div>
    </div>
  );
};

NaturalDeduction.propTypes = {
  incorrectResponses: object,
  problem: object.isRequired,
  setProblemResponse: func,
  value: object.isRequired
};

NaturalDeduction.defaultProps = {
  problem: {},
  value: { linesOfProof: [] }
};

export default NaturalDeduction;
