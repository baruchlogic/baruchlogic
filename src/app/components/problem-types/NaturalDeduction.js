import React, { useState } from 'react';
import { array, func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically-locally';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { DEDUCTION_RULES } from 'constants';
console.log(DEDUCTION_RULES);

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

  const [propositions, setPropositions] = useState(
    premises.map(premise => new Formula(premise))
  );

  const [justifications, setJustifications] = useState(
    premises.map(premise => ({
      rule: 'Premise',
      lines: []
    }))
  );

  const [newProposition, setNewProposition] = useState({
    proposition: '',
    rule: Object.values(DEDUCTION_RULES)[0],
    lines: ''
  });

  const handleNewLinePropositionChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, proposition: value });
  };

  const handleNewLineRuleChange = ({ target: { value } }) => {
    setNewProposition({ ...newProposition, rule: value });
  };

  const handleNewLineCitedLinesChange = ({ target: { value } }) => {
    if (value.length < newProposition.lines.length) {
      return;
    }
    const lastValue = value[value.length - 1];
    if (!isNaN(Number(lastValue))) {
      setNewProposition({ ...newProposition, lines: value });
    }
    if (lastValue === ',') {
      setNewProposition({ ...newProposition, lines: value + ' ' });
    }
  };

  const deleteLine = index => {
    const newPropositions = propositions.slice();
    newPropositions.splice(index, 1);
    setPropositions(newPropositions);

    const newJustifications = justifications.slice();
    newJustifications.splice(index, 1);
    setJustifications(newJustifications);
  };

  const handleNewLineCitedLinesKeyDown = ({ key }) => {
    let nextLines = newProposition.lines;
    if (key === 'Backspace') {
      if (newProposition.lines[newProposition.lines.length - 1] === ' ') {
        nextLines = nextLines.slice(0, nextLines.length - 3);
      } else {
        nextLines = nextLines.slice(0, nextLines.length - 1);
      }
    }
    setNewProposition({ ...newProposition, lines: nextLines });
  };

  const addNewLine = () => {
    const { lines, proposition, rule } = newProposition;
    setPropositions([...propositions, new Formula(proposition)]);

    const nextLines = lines.split(', ');
    setJustifications([...justifications, { rule, lines: nextLines }]);
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
        <div>
          Propositions:
          {propositions.map((proposition, index) => (
            <div key={proposition.formulaString}>
              <span style={{ marginRight: '8px' }}>({index + 1})</span>
              {proposition.formulaString}
            </div>
          ))}
        </div>
        <div>
          Justifications:
          {justifications.map((justification, index) => (
            <div
              key={`${justification.rule}-${index}`}
              style={{ display: 'flex' }}
            >
              {justification.rule}
              {justification.lines.length > 0 &&
                `(${justification.lines.join(', ')})`}
              <span
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  marginLeft: '8px',
                  width: '24px'
                }}
              >
                {justification.rule !== DEDUCTION_RULES.PREMISE && (
                  <Icon
                    icon={IconNames.CROSS}
                    size={24}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      deleteLine(index);
                    }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
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
            value={newProposition.justification}
          >
            {Object.values(DEDUCTION_RULES).map(rule => (
              <option key={rule} value={rule}>{rule}</option>
            ))}
          </select>
        </div>
        <div>
          Cited Lines:
          <input
            onChange={handleNewLineCitedLinesChange}
            value={newProposition.lines}
            onKeyDown={handleNewLineCitedLinesKeyDown}
          />
        </div>
        <StyledIcon icon={IconNames.ADD} iconSize={32} onClick={addNewLine} />
      </div>
    </div>
  );
};

NaturalDeduction.propTypes = {
  problem: object,
  setProblemResponse: func,
  value: array
};

export default NaturalDeduction;
