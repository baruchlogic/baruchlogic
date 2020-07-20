import React from 'react';
import Markdown from 'react-markdown';
import { Elevation } from '@blueprintjs/core';
import styled from 'styled-components';
import { Card } from '@blueprintjs/core';

const StyledCard = styled(Card)`
  font-size: 1.5rem;
  margin: auto;
  text-align: center;
  max-width: 80%;
  overflow: ${props => (props.scroll ? 'auto' : 'visible')};
`;

import { ADMIN_EMAIL, TEXTBOOK_URL } from 'constants';

const Textbook = (text = { text: '' }) => {
  const cleanedText = text.text.replace(/<br>/g, '\n');
  return (
    <StyledCard elevation={Elevation.THREE}>
      <p>
        The textbook for this course can be found&nbsp;
        <a href={TEXTBOOK_URL}>here</a>.
        <br />
      </p>
      <p>
        If you wish to contribute to the text, or if you notice any mistakes or
        errors, feel free to file an Issue or Pull Request on GitHub or, if you
        don&apost; have a GitHub account, you may email
        <a href={`mailto:${ADMIN_EMAIL}`}>{`${ADMIN_EMAIL}`}</a>.
      </p>
      <Markdown source={cleanedText} />
    </StyledCard>
  );
};

export default Textbook;
