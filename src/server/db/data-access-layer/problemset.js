const { query } = require('../index');

const getAllProblemsets = async () => {
  try {
    const response = await query('SELECT * FROM problemset', []);
    return response.rows;
  } catch (e) {
    console.log(e);
  }
};

const getProblemSetById = async id => {
  try {
    const response = await query('SELECT * FROM problemset WHERE id = $1', [
      id
    ]);
    return response.rows[0];
  } catch (e) {
    console.log(e);
  }
};

const getProblemsByProblemsetId = async id => {
  try {
    const response = await query(
      'SELECT row_to_json(problem) FROM (select id, type, prompt, choices, problem_v_problemset.problem_index FROM problem INNER JOIN problem_v_problemset ON problem.id = problem_v_problemset.problem_id WHERE problem_v_problemset.problemset_id = $1) problem ORDER BY problem_index ASC;',
      [id]
    );
    return response.rows.map(row => row.row_to_json);
  } catch (e) {
    console.log(e);
  }
};

const scoreResponses = async responses => {
  console.log('scoreResponses', responses);
  const ids = Object.keys(responses);
  let score = 0;
  for (const id of ids) {
    console.log(id);
    const q = await query('SELECT answer FROM problem WHERE id = $1', [
      id
    ]);
    const answer = q.rows[0].answer;
    const response = responses[id];
    console.log('answer', id, response, answer);
    score += response === answer;
  }
  console.log(Math.floor(score));
  return Math.floor(score);
};

module.exports = {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  scoreResponses
};
