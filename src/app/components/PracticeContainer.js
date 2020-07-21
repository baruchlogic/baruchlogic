import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { useColumnView } from 'hooks';

import Practice from './Practice';
import StyledSidebar from 'app-styled/StyledSidebar';

const PracticeContainer = () => {
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
            <li>Translations</li>
            <li>Truth Tables</li>
            <li>Natural Deduction</li>
          </ul>
        </StyledSidebar>
        <Practice />
      </div>
    </>
  );
};

PracticeContainer.propTypes = {
};

export default PracticeContainer;
