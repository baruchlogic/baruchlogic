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
  const [allProblemsets, setAllProblemsets] = useState([]);
  const [missingProblemsets, setMissingProblemsets] = useState([]);
  const [removeProblemsetId, setRemoveProblemsetId] = useState();
  const [addProblemsetId, setAddProblemsetId] = useState();
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
          [problemset.id]: new Date(Number(problemset.unix_due_date))
        }),
        {}
      )
    );
  };
  const fetchAllProblemSets = async () => {
    const problemsets = await fetch(
      `${API_BASE_URL}/api/problemsets`
    ).then(res => res.json());
    setAllProblemsets(problemsets);
  };
  useEffect(() => {
    fetchProblemSets();
  }, [currentSection]);
  useEffect(() => {
    fetchAllProblemSets();
  }, []);
  useEffect(() => {
    if (instructorSections.length && !currentSection.id) {
      setCurrentSection(instructorSections[0]);
    }
  }, [instructorSections, currentSection.id]);
  useEffect(() => {
    setMissingProblemsets(
      allProblemsets.filter(pset => !problemsets.find(p => p.id === pset.id))
    );
  }, [problemsets, allProblemsets]);

  const handleDateChange = (value, problemsetId) => {
    setDates({ ...dates, [problemsetId]: value });
  };

  const handleSectionChange = ({ target: { value } }) => {
    const section = instructorSections.find(
      section => section.section_number === Number(value)
    );
    setCurrentSection(section);
  };

  const removeProblemset = async () => {
    await authFetch(
      `${API_BASE_URL}/api/sections/
      ${currentSection.id}/problemsets/${removeProblemsetId}`,
      'DELETE'
    );
    fetchProblemSets();
  };

  const onRemoveSelectChange = e => {
    setRemoveProblemsetId(e.target.value);
  };

  const addProblemset = async () => {
    await authFetch(
      `${API_BASE_URL}/api/sections/
      ${currentSection.id}/problemsets/${addProblemsetId}`,
      'POST'
    );
    fetchProblemSets();
  };

  const onAddSelectChange = e => {
    setAddProblemsetId(e.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    await Promise.all(
      problemsets.map(async problemset => {
        // if (
        //   new Date(dates[problemset.id]).toISOString() !==
        //   new Date(problemset.unix_due_date).toISOString()
        // ) {
          await authFetch(
            `${API_BASE_URL}/api/sections/
            ${currentSection.id}/problemsets/due-dates/
            ${problemset.id}`,
            'POST',
            {
              body: JSON.stringify({
                date: moment(dates[problemset.id]).format(
                  'YYYY-MM-DD hh:mm:ss'
                ),
                unixDate: Math.floor(dates[problemset.id].getTime() / 1)
              })
            }
          );
        // }
      })
    );

    fetchProblemSets();
    setLoading(false);
  };

  return (
    <>
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
                    {problemset.unix_due_date
                      ? new Date(Number(problemset.unix_due_date)).toString()
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
          <Button intent={Intent.WARNING} onClick={onSubmit}>
            {loading ? 'LOADING' : 'SUBMIT CHANGES'}
          </Button>
        </div>
      </StyledCard>
      <StyledCard>
        <h2>Remove a Problemset:</h2>
        <div style={{ display: 'flex ', justifyContent: 'center' }}>
          <div>Problemset:</div>
          <select
            onChange={onRemoveSelectChange}
            onBlur={onRemoveSelectChange}
            value={removeProblemsetId}
          >
            <option key="1" value=""></option>
            {problemsets.map(problemset => (
              <option key={problemset.id} value={problemset.id}>
                problemset #{problemset.default_order}
              </option>
            ))}
          </select>
          <button onClick={removeProblemset}>REMOVE</button>
        </div>
        <br />
        <h2>Add a Problemset:</h2>
        <div style={{ display: 'flex ', justifyContent: 'center' }}>
          <div>Problemset:</div>
          <select
            onChange={onAddSelectChange}
            onBlur={onAddSelectChange}
            value={addProblemsetId}
          >
            <option key="1" value=""></option>
            {missingProblemsets.map(problemset => (
              <option key={problemset.id} value={problemset.id}>
                problemset #{problemset.default_order}
              </option>
            ))}
          </select>
          <button onClick={addProblemset}>ADD</button>
        </div>
      </StyledCard>
    </>
  );
};

export default Problemsets;
