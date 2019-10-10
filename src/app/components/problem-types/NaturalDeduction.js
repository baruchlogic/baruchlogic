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

const NaturalDeduction = ({ problem, responseData, setProblemResponse }) => {
  console.log('here', problem, responseData);
  const { premises, conclusion } = problem.deduction_prompt;

  // const [propositions, setPropositions] = useState(
  //   premises.map(premise => new Formula(premise))
  // );
  //
  // const [justifications, setJustifications] = useState(
  //   premises.map(premise => ({
  //     rule: 'Premise',
  //     lines: []
  //   }))
  // );

  const initialLines = premises.map((premise, index) => ({
    proposition: new Formula(premise),
    rule: 'Premise',
    citedLines: []
  }));

  const [lines, setLines] = useState(initialLines);

  const [newProposition, setNewProposition] = useState({
    proposition: '',
    rule: Object.values(DEDUCTION_RULES)[0],
    citedLines: ''
  });

  useEffect(() => {
    setResponse();
  }, []);

  useEffect(() => {
    setResponse();
  }, [lines]);

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
    const newLines = lines.slice();
    newLines.splice(index, 1);
    setLines(newLines);
    // const newPropositions = propositions.slice();
    // newPropositions.splice(index, 1);
    // setPropositions(newPropositions);
    // const newJustifications = justifications.slice();
    // newJustifications.splice(index, 1);
    // setJustifications(newJustifications);
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
    setLines([
      ...lines,
      { citedLines: nextLines, proposition: new Formula(proposition), rule }
    ]);
    // setPropositions([...propositions, new Formula(proposition)]);

    // setJustifications([...justifications, { rule, lines: nextLines }]);
  };

  const setResponse = () => {
    // const response = propositions.map((proposition, index) => ({
    //   citedLines: justifications[index].lines,
    //   proposition: proposition.formulaString,
    //   rule: justifications[index].rule
    // }));
    setProblemResponse(problem.id, { linesOfProof: lines });
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
          {lines.map((line, index) => (
            <div key={line.proposition.prettifiedFormula}>
              <span style={{ marginRight: '8px' }}>({index + 1})</span>
              {line.proposition.prettifiedFormula}
            </div>
          ))}
        </div>
        <div>
          Justifications:
          {lines.map((line, index) => (
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
            {Object.values(DEDUCTION_RULES).map(rule => (
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
