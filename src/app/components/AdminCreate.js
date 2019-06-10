import React, { useState } from 'react';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';
import { authFetch } from '../helpers/auth';

const CourseForm = () => {
  const [formValues, setFormValues] = useState({});
  const setSemesterValue = e => {
    e.persist();
    setFormValues(formValues => ({
      ...formValues,
      semester: e.target.value
    }));
  };

  const onSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/section', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({a: "b"})
    }).then( res => res.json() );
    console.log("RESPONSE", response);
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
