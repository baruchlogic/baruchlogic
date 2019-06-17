import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StyledCard from 'app-styled/StyledCard';
import { Button, Elevation } from '@blueprintjs/core';
import { authFetch } from 'helpers/auth';

const StyledLi = styled.li`
  list-style: none;
`;

const CourseForm = () => {
  const [formValues, setFormValues] = useState({
    term: 'fall',
    year: 2019,
    sectionNumber: '',
    nStudents: ''
  });
  const [submitButtonIsEnabled, setSubmitButtonIsEnabled] = useState(false);
  const setFormValue = e => {
    e.persist();
    const { name, value } = e.target;
    if (
      (name === 'sectionNumber' && isNaN(Number(value))) ||
      (name === 'sectionNumber' && value.length === 6) ||
      (name === 'nStudents' && isNaN(Number(value)))
    ) {
      return;
    }
    setFormValues(formValues => ({
      ...formValues,
      [name]: value
    }));
  };
  useEffect(() => {
    const { sectionNumber, nStudents } = formValues;
    console.log('Submit button', sectionNumber.length, nStudents);
    if (sectionNumber.length === 5 && nStudents !== '') {
      setSubmitButtonIsEnabled(true);
    } else {
      setSubmitButtonIsEnabled(false);
    }
  }, [formValues]);

  const [newSection, setNewSection] = useState(null);

  const onSubmit = async () => {
    console.log('FORM VALUES', formValues);
    const response = await authFetch(`${API_BASE_URL}/api/section`, 'POST', {
      body: JSON.stringify(formValues)
    });
    const { status } = response;
    if (status === 400) {
      alert('Duplicate section!');
      return;
    }
    console.log('RESPONSE', response);
    const section = await response.json();
    setNewSection(section);
  };

  return (
    <div>
      <div>
        Term:
        <select
          value={formValues.term}
          onBlur={setFormValue}
          onChange={setFormValue}
          name="term"
        >
          <option key="fall" value="fall">
            Fall
          </option>
          <option key="winter-1" value="winter-1">
            Winter 1
          </option>
          <option key="winter-2" value="winter-2">
            Winter 2
          </option>
          <option key="spring" value="spring">
            Spring
          </option>
          <option key="summer-1" value="summer-1">
            Summer 1
          </option>
          <option key="summer-2" value="summer-2">
            Summer 2
          </option>
          <option key="summer-3" value="summer-3">
            Summer 3
          </option>
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
        CUNY Course Number:{' '}
        <input
          name="sectionNumber"
          value={formValues.sectionNumber || ''}
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
      <Button
        intent="success"
        large
        onClick={onSubmit}
        disabled={!submitButtonIsEnabled}
      >
        SUBMIT
      </Button>

      {newSection && (
        <StyledCard elevation={Elevation.TWO}>
          <div>
            <h2>New Section Created!</h2>
            <h4>Section Number: {newSection.sectionNumber}</h4>
            <h4>Student Keys:</h4>
            <ul>
              {newSection.studentKeys.map(key => (
                <StyledLi key={key}>
                  <div>{key}</div>
                </StyledLi>
              ))}
            </ul>
          </div>
        </StyledCard>
      )}
    </div>
  );
};

const AdminCreate = () => {
  return (
    <StyledCard elevation={Elevation.THREE}>
      <h3>Use this interface to create a new course section.</h3>
      <br />
      <CourseForm />
    </StyledCard>
  );
};

export default AdminCreate;
