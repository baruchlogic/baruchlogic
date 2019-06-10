import React, { useEffect, useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';

const CourseForm = () => {
  const [formValues, setFormValues] = useState({});
  const setSemesterValue = e => {
    e.persist();
    setFormValues(formValues => ({
      ...formValues,
      semester: e.target.value
    }));
  };

  return (
    <div>
      <div>
        Semester:
        <select value={formValues.semester} onChange={setSemesterValue}>
          <option value="fall">Fall</option>
          <option value="winter-1">Winter 1</option>
          <option value="winter-2">Winter 2</option>
          <option value="spring">Spring</option>
          <option value="summer-1">Summer 1</option>
          <option value="summer-2">Summer 2</option>
          <option value="summer-3">Summer 3</option>
        </select>
      </div>
      <div>
        Course Number: <input />
      </div>
      <div>
        Number of students: <input />
      </div>
      <Button intent="success" large>
        SUBMIT
      </Button>
    </div>
  );
};

const AdminCreate = () => {
  return (
    <StyledCard elevation={Elevation.TWO}>
      <h3>Use this interface to create a new course section.</h3>
      <br />
      <CourseForm />
    </StyledCard>
  );
};

export default AdminCreate;
