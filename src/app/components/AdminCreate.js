import React, { useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';

const CourseForm = () => {
  const [formValues, setFormValues] = useState({
    semester: 'fall',
    year: 2019
  });
  const setFormValue = e => {
    e.persist();
    const { name, value } = e.target;
    setFormValues(formValues => ({
      ...formValues,
      [name]: value
    }));
  };

  const onSubmit = async () => {
    console.log('FORM VALUES', formValues);
    const response = await authFetch(
      'http://localhost:5000/api/section',
      'POST',
      { body: JSON.stringify(formValues) }
    );
    console.log('RESPONSE', response);
  };

  return (
    <div>
      <div>
        Semester:
        <select
          value={formValues.semester}
          onBlur={setFormValue}
          onChange={setFormValue}
          name="semester"
        >
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
        Year:
        <select
          value={formValues.year}
          onBlur={setFormValue}
          onChange={setFormValue}
          name="year"
        >
          {new Array(50).fill(0).map((el, idx) => (
            <option
              key={2000 + idx}
              value={2000 + idx}
              selected={formValues.year === 2000 + idx}
            >
              {2000 + idx}
            </option>
          ))}
        </select>
      </div>
      <div>
        Course Number:{' '}
        <input
          name="courseNumber"
          value={formValues.courseNumber || ''}
          onChange={setFormValue}
        />
      </div>
      <div>
        Number of students:
        <input
          name="nStudents"
          value={formValues.nStudents || ''}
          onChange={setFormValue}
        />
      </div>
      <Button intent="success" large onClick={onSubmit}>
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
