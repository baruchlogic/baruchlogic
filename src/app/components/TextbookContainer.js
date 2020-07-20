import React, { useState } from 'react';
import styled from 'styled-components';
import StyledSidebar from 'app-styled/StyledSidebar';
import Textbook from './Textbook';
import textbook from 'baruchlogic-textbook';

const StyledContainer = styled.div`
  display: flex;
`;

const renderSidebarItems = setCurrentText => {
  const result = [];
  let currentUnit = 0;
  Object.entries(textbook).forEach(([k, v], index) => {
    const e = /^unit_(\d)/.exec(k);
    const unit = e && e[1];
    if (unit !== currentUnit && unit > 0) {
      currentUnit = unit;
      const H1 = () => <h1>Unit #{unit}</h1>;
      result.push(<H1 key={`h1-${k}`} />);
    }
    const Li = () => (
      <li>
        <button
          style={{
            backgroundColor: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            textAlign: 'left'
          }}
          onClick={() => {
            setCurrentText(v);
          }}
          onKeyDown={e => {
            if (e.keyCode === 13) setCurrentText(v);
          }}
        >
          Chapter {index} - {v.title}
        </button>
      </li>
    );
    result.push(<Li key={k} />);
  });
  return result;
};

const TextbookContainer = () => {
  const [currentText, setCurrentText] = useState(textbook.introduction);
  return (
    <StyledContainer>
      <StyledSidebar>
        <h1>Chapters</h1>
        <ul>{renderSidebarItems(setCurrentText)}</ul>
      </StyledSidebar>
      <Textbook text={currentText.text} />
    </StyledContainer>
  );
};

export default TextbookContainer;
