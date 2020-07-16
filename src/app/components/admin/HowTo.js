import React from 'react';
import { Elevation } from '@blueprintjs/core';

import StyledCard from 'app-styled/StyledCard';

const HowTo = () => (
  <StyledCard elevation={Elevation.THREE}>
    <iframe
      title="Admin Tutorial"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/BcanqwmDmvU"
      frameBorder="0"
      allow="accelerometer; autoplay;
        encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </StyledCard>
);

export default HowTo;
