import React, { useEffect, useState } from 'react';
import { Button, Elevation, Intent } from '@blueprintjs/core';
import StyledCard from 'app-styled/StyledCard';
import moment from 'moment';
import { MOMENT_FORMAT } from 'constants';
import DateTimePicker from 'react-datetime-picker';

const Problemsets = () => {
  const [problemsets, setProblemsets] = useState([]);
  const fetchProblemSets = async () => {
    const response = await fetch('http://localhost:5000/api/problemsets').then(
      res => res.json()
    );
    const problemsets = response;
    console.log('PROBLEMSETS', problemsets);
    setProblemsets(problemsets);
    setDates(new Array(problemsets.length));
  };
  useEffect(() => {
    fetchProblemSets();
  }, []);

  const [dates, setDates] = useState([]);

  const handleDateChange = (value, index) => {
    const newDates = dates.slice();
    newDates.splice(index, 1, value);
    newDates.splice(index, 1, value);
    setDates(newDates);
  };

  return (
    <StyledCard elevation={Elevation.THREE}>
      <h1>Problemsets</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <div>Problemsets</div>
          {problemsets.map(problemset => (
            <div key={problemset.id}>
              <span>Unit {problemset.unit}</span>
              <span>Number {problemset.index_in_unit}</span>
            </div>
          ))}
        </div>
        <div>
          <div>Due Dates</div>
          {problemsets.map(problemset => (
            <div key={problemset.id}>
              <span>
                {problemset.due_date
                  ? moment(problemset.due_date).format(MOMENT_FORMAT)
                  : 'N/A'}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div>Change due date:</div>
          {problemsets.map((problemset, index) => (
            <div>
              <DateTimePicker
                onChange={val => handleDateChange(val, index)}
                value={dates[index]}
              />
              <Button intent={Intent.WARNING}>SUBMIT CHANGE</Button>
            </div>
          ))}
        </div>
      </div>
    </StyledCard>
  );
};

export default Problemsets;
