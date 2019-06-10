import React from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';

const AdminCreate = () => {
  return (
    <StyledCard elevation={Elevation.TWO}>
      <h3>Use this interface to create a new course section.</h3>
    </StyledCard>
  );
};

export default AdminCreate;
