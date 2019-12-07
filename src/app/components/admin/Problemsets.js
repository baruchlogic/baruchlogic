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
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProblemSets = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/sections/${currentSection.id}/problemsets`
    ).then(res => res.json());
    const problemsets = response;
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
  }, [instructorSections, currentSection.id]);

  const handleDateChange = (value, problemsetId) => {
    setDates({ ...dates, [problemsetId]: value });
  };

  const handleSectionChange = ({ target: { value } }) => {
    const section = instructorSections.find(
      section => section.section_number === Number(value)
    );
    setCurrentSection(section);
  };

  const onSubmit = async () => {
    setLoading(true);
    await Promise.all(
      problemsets.map(async problemset => {
        if (
          new Date(dates[problemset.id]).toISOString() !==
          new Date(problemset.due_date).toISOString()
        ) {
          console.log('diff');
          await authFetch(
            `${API_BASE_URL}/api/sections/${currentSection.id}/problemsets/due-dates/${problemset.id}`,
            'POST',
            {
              body: JSON.stringify({
                date: moment(dates[problemset.id]).format('YYYY-MM-DD hh:mm:ss')
              })
            }
          );
        }
      })
    );

    fetchProblemSets();
    setLoading(false);
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
          <div key="1">Problemsets</div>
          <div key="2">Due Dates</div>
          <div key="3">Change due date:</div>
        </div>
        {problemsets
          .sort((a, b) =>
            a.default_order < b.default_order
              ? -1
              : a.default_order > b.default_order
              ? 1
              : 0
          )
          .map((problemset, index) => (
            <div
              style={{ display: 'flex', justifyContent: 'space-between' }}
              key={problemset.id}
            >
              <div key={problemset.id + 'order'}>
                <span>Problemset #{problemset.default_order}</span>
              </div>
              <div key={problemset.id + 'date'}>
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
              </div>
            </div>
          ))}
          <Button
            intent={Intent.WARNING}
            onClick={onSubmit}
          >
            {loading ? 'LOADING' : 'SUBMIT CHANGES'}
          </Button>
      </div>
    </StyledCard>
  );
};

export default Problemsets;
