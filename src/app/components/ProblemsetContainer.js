import React, { useEffect, useState } from 'react';
import Problem from './Problem';
import StyledCard from 'app-styled/StyledCard';
import { Button } from '@blueprintjs/core';

const ProblemsetContainer = ({ problemsetId }) => {
  const [problemset, setProblemset] = useState(null);
  const [problems, setProblems] = useState([]);
  const [problemsetResponses, setProblemsetResponses] = useState({});

  const fetchProblemSet = async () => {
    const result = await fetch(
      `http://localhost:5000/api/problemsets/${problemsetId}`
    ).then(res => res.json());
    setProblemset(result);
  };

  const fetchProblems = async () => {
    const result = await fetch(
      `http://localhost:5000/api/problemsets/${problemsetId}/problems`
    ).then(res => res.json());
    setProblems(result);
  };

  useEffect(() => {
    fetchProblemSet();
  }, problemsetId);

  useEffect(() => {
    fetchProblems();
  }, problemsetId);

  const setProblemResponse = (problemId, response) => {
    setProblemsetResponses({
      ...problemsetResponses,
      [problemId]: response
    });
    console.log(problemsetResponses);
  };

  const onSubmit = async () => {
    console.log(JSON.stringify(problemsetResponses));
    await fetch(`http://localhost:5000/api/problemsets/${problemsetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problemsetResponses)
    });
  };

  const problemsetNumber =
    problemset && problemset.unit + problemset.index_in_unit - 1;

  return (
    <div>
      <h1>{`Problemset #${problemsetNumber}`}</h1>
      {problems.map(problem => (
        <Problem
          key={problem.id}
          value={problemsetResponses[problem.id]}
          problem={problem}
          setProblemResponse={setProblemResponse}
        />
      ))}
      <StyledCard>
        <Button intent="success" large onClick={onSubmit}>
          SUBMIT
        </Button>
      </StyledCard>
    </div>
  );
};

export default ProblemsetContainer;
