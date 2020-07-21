import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { number, shape } from 'prop-types';
import StyledSidebar from 'app-styled/StyledSidebar';
import Textbook from './Textbook';
import textbook from 'baruchlogic-textbook';
import { useColumnView } from 'hooks';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
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
      <Link to={`/textbook/${index}`}>
        <div
          style={{
            backgroundColor: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            textAlign: 'left'
          }}
        >
          Chapter {index} - {v.title}
        </div>
      </Link>
    );
    result.push(<Li key={k} />);
  });
  return result;
};

const TextbookContainer = ({
  match: {
    params: { chapter = 0 }
  }
}) => {
  const [currentText, setCurrentText] = useState(textbook.introduction);

  useEffect(() => {
    setCurrentText(Object.values(textbook)[chapter]);
  }, [chapter]);

  const isColumnView = useColumnView();
  return (
    <StyledContainer column={isColumnView}>
      <StyledSidebar column={isColumnView}>
        <h1>Chapters</h1>
        <ul>{renderSidebarItems(setCurrentText)}</ul>
      </StyledSidebar>
      <Textbook text={currentText.text} />
    </StyledContainer>
  );
};

TextbookContainer.propTypes = {
  match: shape({
    params: shape({
      chapter: number
    })
  })
};

export default TextbookContainer;
