import React, { useEffect, useState } from 'react';
import { func, object } from 'prop-types';
import styled from 'styled-components';
import { Formula } from 'logically';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { DEDUCTION_RULES } from 'logically';

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

const NaturalDeduction = ({ problem, setProblemResponse, value = {} }) => {
  console.log('here', problem, value);
  const { premises, conclusion } = problem.deduction_prompt;

  const initialLines = premises.map((premise, index) => ({
    proposition: new Formula(premise),
    rule: 'Premise',
    citedLines: []
  }));

  const [newProposition, setNewProposition] = useState({
    proposition: '',
    rule: Object.values(DEDUCTION_RULES)[0],
    citedLines: ''
  });

  useEffect(() => {
    setProblemResponse(problem.id, { linesOfProof: initialLines });
  }, []);

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
      linesOfProof: value.linesOfProof.slice().splice(index, 1)
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
    const nextLines = (citedLines && citedLines.split(', ').map(Number)) || [];
    const newLine = { citedLines: nextLines, proposition: new Formula(proposition), rule };
    setProblemResponse(problem.id, {
      linesOfProof: value.linesOfProof.concat(newLine)
    });
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
          {(value.linesOfProof || []).map((line, index) => (
            <div key={line.proposition.prettifiedFormula}>
              <span style={{ marginRight: '8px' }}>({index + 1})</span>
              {line.proposition.prettifiedFormula}
            </div>
          ))}
        </div>
        <div>
          Justifications:
          {(value.linesOfProof || []).map((line, index) => (
            <div key={`${line.rule}-${index}`} style={{ display: 'flex' }}>
              {line.rule}
              {line.citedLines.length > 0 && `(${line.citedLines.join(', ')})`}
              <span
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  marginLeft: '8px',
                  width: '24px'
                }}
              >
                {line.rule !== DEDUCTION_RULES.PREMISE && (
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
            value={newProposition.rule}
          >
            {Object.values(DEDUCTION_RULES).filter(
              rule => rule !== DEDUCTION_RULES.PREMISE
            ).map(rule => (
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
  problem: object,
  responseData: object,
  setProblemResponse: func
};

export default NaturalDeduction;
