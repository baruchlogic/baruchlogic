import React from 'react';
import { shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { useColumnView } from 'hooks';

import Practice from './Practice';
import StyledSidebar from 'app-styled/StyledSidebar';

const PracticeContainer = ({
  match: {
    params: { problem_type: problemType }
  }
}) => {
  const isColumnView = useColumnView();
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: isColumnView ? 'column' : 'row'
        }}
      >
        <StyledSidebar column={isColumnView}>
          <H1>practice</H1>
          <ul>
            <Link to="/practice/translations">Translations</Link>
            <Link to="/practice/truth-table">Truth Tables</Link>
            <Link to="/practice/natural-deduction">Natural Deduction</Link>
          </ul>
        </StyledSidebar>
        <Practice problemType={problemType} />
      </div>
    </>
  );
};

PracticeContainer.propTypes = {
  match: shape({
    params: shape({
      problem_type: string
    })
  })
};

export default PracticeContainer;
