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
    citedLines: []
  };

  const [newProposition, setNewProposition] = useState(initialProposition);
  const [tempPropositionStrings, setTempPropositionStrings] = useState('');
  const [tempCitedLines, setTempCitedLines] = useState([]);

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
    response.linesOfProof[index].citedLines = tempCitedLines;
    setProblemResponse(problem.id, response);
    // if (Formula.isWFFString(tempPropositionStrings[index])) {
    //   const proposition = new Formula(tempPropositionStrings[index]);
    //   response.linesOfProof[index].proposition = proposition;
    //   setProblemResponse(problem.id, response);
    // } else {
    //   alert('Not a well-formed proposition.');
    //   const copy = tempPropositionStrings.slice();
    //   copy[index] = value.linesOfProof[index].proposition.formulaString;
    //   setTempPropositionStrings(copy);
    // }
  };

  const handleUpdateRule = ({ target: { value: val } }, index) => {
    const newProblemResponse = Object.assign({}, value);
    newProblemResponse.linesOfProof[index].rule = val;
    setProblemResponse(problem.id, newProblemResponse);
  };

  const handleUpdateCitedLines = ({ target: { value: val } }, index) => {
    console.log(val, val === ',');
    if (isNaN(Number(val)) && val.slice(-1) !== ',' && val.slice(-1) !== ' ') {
      return;
    }
    let arr;
    if (val.includes(',')) {
      arr = val.split(',').map(x => Number(x));
    } else {
      arr = [Number(val)];
    }
    // console.log('handleUpdateCitedLines', val, index, arr);
    // const copy = tempCitedLines.slice()
    // copy[index] = arr;
    setTempCitedLines(arr);
    console.log('tempCitedLines', tempCitedLines);
  };

  const deleteLine = index => {
    setProblemResponse(problem.id, {
      linesOfProof: [
        ...value.linesOfProof.slice(0, index),
        ...value.linesOfProof.slice(index + 1)
      ]
    });
  };

  const addNewLine = () => {
    const { citedLines, proposition, rule } = newProposition;
    const lines = citedLines
      .replace(/,\s+,/g, ',')
      .replace(/,\s*$/, '')
      .split(/[\s,]+/)
      .map(Number);
    console.log('LINES', lines);
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
    setProblemResponse(problem.id, {
      linesOfProof: value.linesOfProof.concat(newLine)
    });
    setNewProposition(initialProposition);
    setTempCitedLines(lines);
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
                      value={value.linesOfProof[index].citedLines.join(', ')}
                      onChange={e => {
                        handleUpdateCitedLines(e, index);
                      }}
                      onBlur={e => {
                        submitUpdateCitedLines(index);
                      }}
                    />
                  )}
                </td>
                <td style={{ display: 'flex', height: '25px' }}>
                  <div
                    style={{ height: '100%', width: '25%' }}
                    onClick={() => {
                      deleteLine(index);
                    }}
                    role="button"
                    onKeyDown={addNewLine}
                    tabIndex="0"
                  >
                    <img
                      src={TrashIcon}
                      style={{ width: 'auto', height: '25px' }}
                      alt="Trash icon"
                    />
                  </div>
                  <div style={{ height: '100%', width: '25%' }}>
                    <img
                      src={UpArrow}
                      style={{ width: 'auto', height: '25px' }}
                      alt="Add line above icon"
                    />
                  </div>
                  <div style={{ height: '100%', width: '25%' }}>
                    <img
                      src={DownArrow}
                      style={{ width: 'auto', height: '25px' }}
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
          onClick={addNewLine}
          role="button"
          tabIndex="0"
          onKeyDown={addNewLine}
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
