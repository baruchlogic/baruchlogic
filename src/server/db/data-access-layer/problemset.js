const { query } = require('../index');
const { Formula } = require('logically-locally');

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
      `SELECT row_to_json(problem)
      FROM (select id, type, prompt, choices,
      problem_v_problemset.problem_index
      FROM problem
      INNER JOIN problem_v_problemset
      ON problem.id = problem_v_problemset.problem_id
      WHERE problem_v_problemset.problemset_id = $1) problem
      ORDER BY problem_index ASC;`,
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
  const bestScore = await query(
    `
    SELECT score FROM problemset_score
    WHERE problemset_id = $1 AND student_id = $2
  `,
    [problemsetId, studentId]
  );
  console.log('BEST SCORE', bestScore);
  const currentScore = await scoreResponses(responses, problemsetId);
  console.log('CURRENT SCORE', currentScore);
  if (!bestScore || currentScore > bestScore) {
    await query(
      `
      INSERT INTO problemset_best_response
      (user_id, problemset_id, response)
      VALUES
      ($1, $2, $3)
      ON CONFLICT ON CONSTRAINT unique_problemset_id_user_id
      DO
      UPDATE SET response = $3
      WHERE problemset_best_response.problemset_id = $2
      AND problemset_best_response.user_id = $1
    `,
      [studentId, problemsetId, responses]
    );
  }
};

/**
 * Returns true iff two matrices have identical elements.
 * @param  {array[]} m1
 * @param  {array[]} m2
 * @return {boolean}
 */
const compareMatrices = (m1, m2) => {
  if (m1.length !== m2.length) return false;
  if (m1[0].length !== m2[0].length) return false;
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m1[0].length; j++) {
      if (m1[i][j] !== m2[i][j]) return false;
    }
  }
  return true;
};

const scoreSelectedResponse = (problem, response) =>
  problem.answer === response;

const scoreTruthTable = (problem, response) => {
  response = response.map(row =>
    row.map(el => (el === 'T' ? true : el === 'F' ? false : null))
  );
  const formula = new Formula();
  const truthTable = formula.generateTruthTable(problem.prompt);
  return compareMatrices(response, truthTable);
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
  return Number(score);
};

const scoreResponses = async (responses, problemsetId) => {
  console.log('scoreResponses', responses);
  const ids = Object.keys(responses);
  let score = 0;
  const incorrectProblemIDs = [];
  for (const id of ids) {
    console.log(id);
    const q = await query('SELECT * FROM problem WHERE id = $1', [id]);
    const problem = q.rows[0];
    const response = responses[id];
    const isCorrectResponse = scoreProblemResponse(problem, response);
    if (!isCorrectResponse) {
      incorrectProblemIDs.push(id);
    }
    score += isCorrectResponse;
  }
  console.log(Math.floor(score));
  const q = await query(
    'SELECT COUNT(*) FROM problem_v_problemset WHERE problemset_id = $1',
    [problemsetId]
  );
  const count = Number(q.rows[0].count);
  console.log('COUNT!', count);
  return {
    score: Math.floor((score / count) * 100),
    incorrectProblemIDs
  };
};

const getScore = async (problemsetId, studentId) => {
  console.log('getScore', problemsetId, studentId);
  const q = await query(
    `SELECT score
    FROM problemset_score
    WHERE problemset_id = $1
    AND student_id = $2`,
    [problemsetId, studentId]
  );
  console.log('QUERY', q);
  return q.rows[0] && q.rows[0].score;
};

module.exports = {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveResponses,
  scoreResponses
};
