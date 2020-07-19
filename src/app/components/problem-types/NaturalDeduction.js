import React, { useEffect, useState } from 'react';
import { func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { CITED_LINES_COUNT, DEDUCTION_RULES } from 'logically-local';
import EditIcon from "../../assets/edit-icon.png"
import UpArrow from "../../assets/up-arrow.png"
import DownArrow from "../../assets/down-arrow.png"

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

const NaturalDeduction = ({ problem, setProblemResponse, value }) => {
  const { premises, conclusion } = problem.deduction_prompt;

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

  // Populate initial lines on reset or on start
  useEffect(() => {
    if (value.linesOfProof.length === 0) {
      setProblemResponse(problem.id, { linesOfProof: initialLines });
      setNewProposition(initialProposition);
    }
  });

  const handleNewLinePropositionChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, proposition: value });
  };

  const handleNewLineRuleChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, rule: value });
  };

  const handleNewLineCitedLinesChange = ({ target: { value } }) => {
    if (value.length < newProposition.citedLines.length) {
      return;
    }
    const lastValue = value[value.length - 1];
    if (!isNaN(Number(lastValue))) {
      setNewProposition({ ...newProposition, citedLines: value });
    }
    if (lastValue === ',') {
      setNewProposition({ ...newProposition, citedLines: value + ' ' });
    }
  };

  const deleteLine = index => {
    setProblemResponse(problem.id, {
      linesOfProof: [
        ...value.linesOfProof.slice(0, index),
        ...value.linesOfProof.slice(index + 1)
      ]
    });
  };

  const handleNewLineCitedLinesKeyDown = ({ key }) => {
    let nextLines = newProposition.citedLines;
    if (key === 'Backspace') {
      if (
        newProposition.citedLines[newProposition.citedLines.length - 1] === ' '
      ) {
        nextLines = nextLines.slice(0, nextLines.length - 3);
      } else {
        nextLines = nextLines.slice(0, nextLines.length - 1);
      }
    }
    setNewProposition({ ...newProposition, citedLines: nextLines });
  };

  const addNewLine = () => {
    const { citedLines, proposition, rule } = newProposition;
    if (!Formula.isWFFString(proposition)) {
      alert('Proposition is not a well-formed formula.');
      return;
    }
    if (citedLines.length !== CITED_LINES_COUNT[rule]) {
      alert(
        `Incorrect number of cited lines: expecting ${CITED_LINES_COUNT[rule]}`
      );
      return;
    }
    const nextLines = (citedLines && citedLines.split(', ').map(Number)) || [];
    const newLine = {
      citedLines: nextLines,
      proposition: new Formula(proposition),
      rule
    };
    setProblemResponse(problem.id, {
      linesOfProof: value.linesOfProof.concat(newLine)
    });
    setNewProposition(initialProposition);
  };

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
              <th>Propositions</th>
              <th>Justifications</th>
              <th>Cited Lines</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {value.linesOfProof.map((line, index) => (
              <tr>
                <td><input value={line.proposition.prettifiedFormula} /></td>
                {line.rule === DEDUCTION_RULES.PREMISE ? (
                  <td><input value={line.rule} /></td>
                ) : (
                  <td>
                    <select
                      value={line.rule}
                    >
                      {Object.values(DEDUCTION_RULES)
                        .filter(rule => rule !== DEDUCTION_RULES.PREMISE)
                        .map(rule => (
                          <option key={rule} value={rule}>
                            {rule}
                          </option>
                        ))
                      }
                    </select>
                  </td>
                )}
                <td><input value={line.citedLines.join(', ')} /></td>
                <td style={{ display: 'flex', height: '25px' }}>
                  <div style={{ height: '100%', width: '33%' }}>
                    <img src={EditIcon} style={{ width: 'auto', height: '25px' }} />
                  </div>
                  <div style={{ height: '100%', width: '33%' }}>
                    <img src={UpArrow} style={{ width: 'auto', height: '25px' }} />
                  </div>
                  <div style={{ height: '100%', width: '33%' }}>
                    <img src={DownArrow} style={{ width: 'auto', height: '25px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ProofContainer>

      <div>
        Add New Line:
        <br />
        <div>
          Proposition:{' '}
          <input
            onChange={handleNewLinePropositionChange}
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
            onChange={handleNewLineCitedLinesChange}
            value={newProposition.citedLines}
            onKeyDown={handleNewLineCitedLinesKeyDown}
          />
        </div>
        <StyledIcon icon={IconNames.ADD} iconSize={32} onClick={addNewLine} />
      </div>
    </div>
  );
};

NaturalDeduction.propTypes = {
  problem: object.isRequired,
  setProblemResponse: func,
  value: object.isRequired
};

NaturalDeduction.defaultProps = {
  problem: {},
  value: { linesOfProof: [] }
};

export default NaturalDeduction;
