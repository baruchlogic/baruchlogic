import React from 'react';
import { Divider, Elevation } from '@blueprintjs/core';

import StyledCard from 'app-styled/StyledCard';

const HowTo = () => (
  <StyledCard elevation={Elevation.THREE}>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/BcanqwmDmvU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </StyledCard>
);

export default HowTo;
