import React from 'react';
import { Elevation } from '@blueprintjs/core';

import StyledCard from '../styled-components/StyledCard';

import { ADMIN_EMAIL, TEXTBOOK_URL } from 'constants';

const Textbook = () => (
  <StyledCard elevation={Elevation.THREE}>
    <p>
      The textbook for this course can be found&nbsp;
      <a href={TEXTBOOK_URL}>here</a>.
      <br />
    </p>
    <p>
      {`If you wish to contribute to the text, or if you notice any mistakes or
      errors, feel free to file an Issue or Pull Request on GitHub or, if you
      don't have a GitHub account, you may email `}
      <a href={`mailto:${ADMIN_EMAIL}`}>{`${ADMIN_EMAIL}`}</a>.
    </p>
  </StyledCard>
);

export default Textbook;
