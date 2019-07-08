import React, { useEffect, useState } from 'react';
import { Button, Elevation, Intent } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import moment from 'moment';
import { MOMENT_FORMAT } from 'constants';
import DateTimePicker from 'react-datetime-picker';
import { authFetch } from 'helpers/auth';
import { useInstructorSections } from 'hooks';

const Problemsets = () => {
  const instructorSections = useInstructorSections();
  const [currentSection, setCurrentSection] = useState({});
  const [problemsets, setProblemsets] = useState([]);
  const fetchProblemSets = async () => {
    const response = await fetch(
      `http://localhost:5000/api/sections/${currentSection.id}/problemsets`
    ).then(res => res.json());
    const problemsets = response;
    console.log('PROBLEMSETS', problemsets);
    setProblemsets(problemsets);
    setDates(
      problemsets.reduce(
        (acc, problemset) => ({
          ...acc,
          [problemset.id]: new Date(problemset.due_date)
        }),
        {}
      )
    );
  };
  useEffect(() => {
    fetchProblemSets();
  }, [currentSection]);

  useEffect(() => {
    if (instructorSections.length && !currentSection.id) {
      setCurrentSection(instructorSections[0]);
    }
  }, [instructorSections]);

  const [dates, setDates] = useState({});

  const handleDateChange = (value, problemsetId) => {
    console.log(value, typeof value);
    setDates({ ...dates, [problemsetId]: value });
  };

  useEffect(() => {
    console.log('dates', dates);
  });

  const handleSectionChange = ({ target: { value } }) => {
    const section = instructorSections.find(
      section => section.section_number === Number(value)
    );
    setCurrentSection(section);
  };

  const onSubmit = async index => {
    const problemset = problemsets[index];
    await authFetch(
      `http://localhost:5000/api/sections/${
        currentSection.id
      }/problemsets/due-dates/${problemset.id}`,
      'POST',
      {
        body: JSON.stringify({ date: dates[problemset.id].toUTCString() })
      }
    );
    fetchProblemSets();
  };

  return (
    <StyledCard elevation={Elevation.THREE}>
      <h1>Problemsets</h1>
      <section>
        <h2>Pick a section:</h2>
        <select onChange={handleSectionChange} onBlur={handleSectionChange}>
          {instructorSections.map(section => (
            <option value={section.section_number} key={section.id}>
              {section.section_number}
            </option>
          ))}
        </select>
      </section>
      <div>
        <div style={{ display: 'flex' }}>
          <div>Problemsets</div>
          <div>Due Dates</div>
          <div>Change due date:</div>
        </div>
        {problemsets.sort((a, b) => a.order - b.order).map((problemset, index) => (
          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            key={problemset.id}
          >
            <div key={problemset.id}>
              <span>Unit {problemset.unit}</span>
              <span>Number {problemset.index_in_unit}</span>
            </div>
            <div key={problemset.id}>
              <span>
                {problemset.due_date
                  ? moment(problemset.due_date).format(MOMENT_FORMAT)
                  : 'N/A'}
              </span>
            </div>
            <div>
              <DateTimePicker
                onChange={val => handleDateChange(val, problemset.id)}
                value={dates[problemset.id]}
              />
              <Button
                intent={Intent.WARNING}
                onClick={() => {
                  onSubmit(index);
                }}
              >
                SUBMIT CHANGE
              </Button>
            </div>
          </div>
        ))}
      </div>
    </StyledCard>
  );
};

export default Problemsets;
