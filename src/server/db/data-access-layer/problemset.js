const { query } = require('../index');
const { Formula } = require('logically-logically');

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

const saveBestScore = async (studentId, problemsetId, score) => {
  console.log('saveBestScore');
  await query(
    `INSERT INTO problemset_score
    (student_id, problemset_id, score)
    VALUES
    ($1, $2, $3)
    ON CONFLICT ON CONSTRAINT
    problemset_score_unique
    DO
    UPDATE SET score = $3
    WHERE problemset_score.problemset_id = $2
    AND problemset_score.student_id = $1
    AND problemset_score.score < $3`,
    [studentId, problemsetId, score]
  );
};

const saveResponses = async (studentId, problemsetId, responses) => {
  console.log('saveResponses');
  const q = await query(
    `INSERT INTO problemset_last_response
    (student_id, problemset_id, response)
    VALUES
    ($1, $2, $3)
    ON CONFLICT ON CONSTRAINT problemset_id_student_id_unique
    DO
    UPDATE SET response = $3
    WHERE problemset_last_response.problemset_id = $2
    AND problemset_last_response.student_id = $1`,
    [studentId, problemsetId, responses]
  );
  console.log('q', q);
  const r = await query('SELECT * FROM problemset_last_response');
  console.log('r', r);
};

const scoreSelectedResponse = (problem, response) =>
  problem.answer === response;

const scoreTruthTable = (problem, response) => {
  // const formula = new Formula();
};

const scoreProblemResponse = (problem, response) => {
  let score = null;
  switch (problem.type) {
    case 'true_false':
    case 'multiple_choice':
      score = scoreSelectedResponse(problem, response);
      break;
    case 'truth_table':
      score = scoreTruthTable(problem, response);
      break;
    default:
      break;
  }
  return score;
};

const scoreResponses = async responses => {
  console.log('scoreResponses', responses);
  const ids = Object.keys(responses);
  let score = 0;
  for (const id of ids) {
    console.log(id);
    const q = await query('SELECT * FROM problem WHERE id = $1', [id]);
    const problem = q.rows[0];
    const response = responses[id];
    score += scoreProblemResponse(problem, response);
  }
  console.log(Math.floor(score));
  return Math.floor(score);
};

module.exports = {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  saveBestScore,
  saveResponses,
  scoreResponses
};
