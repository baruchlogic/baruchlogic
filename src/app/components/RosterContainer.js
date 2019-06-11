import React, { useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';

/**
 * Container for list of student rosters.
 * @return {React.Component}
 */
const RosterContainer = () => {
  const [courseNumber, setCourseNumer] = useState();
  const [inputCourseNumber, setInputCourseNumber] = useState();
  return (
    <StyledCard elevation={Elevation.THREE}>
      <div>Manage the rosters for your course sections.</div>
      <div>Select your couse section below:</div>
      <div>
        <input
          value={courseNumber}
          onChange={e => { setCourseNumer(e.target.value); }}
        />
      </div>
    </StyledCard>
  );
};

export default RosterContainer;
