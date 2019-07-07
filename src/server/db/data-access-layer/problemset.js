const { query } = require('../index');
const { Formula, LineOfProof, Proof } = require('logically-locally');

const getAllProblemsets = async () => {
  try {
    const response = await query(
      `SELECT * FROM problemset
      FULL OUTER JOIN due_date
      ON problemset.id = due_date.problemset_id`,
      []
    );
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
  console.log('getProblemsByProblemsetId', id);
  try {
    const response = await query(
      `SELECT row_to_json(problem)
      FROM (select id, type, prompt, choices, deduction_prompt,
      problem_v_problemset.problem_index
      FROM problem
      INNER JOIN problem_v_problemset
      ON problem.id = problem_v_problemset.problem_id
      WHERE problem_v_problemset.problemset_id = $1) problem
      ORDER BY problem_index ASC;`,
      [id]
    );
    console.log('response', response);
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

/**
 * Saves the last submitted response
 * @param  {string}  studentId
 * @param  {problemsetId}  problemsetId
 * @param  {object}  responses
 * @return {void}
 */
const saveResponses = async (studentId, problemsetId, responses) => {
  console.log('saveResponses');

  // Upsert last response
  await query(
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
};

const saveBestResponses = async (studentId, problemsetId, responses) => {
  console.log('saveBestResponse', responses);

  const { score } = await scoreResponses(responses, problemsetId);

  const currentScore = await getScore(problemsetId, studentId);

  if (!currentScore || score > currentScore) {
    console.log('SAVE NEW BEST RESPONSE');
    // Upsert best response if score is higher
    await query(
      `INSERT INTO problemset_best_response
      (user_id, problemset_id, response)
      VALUES
      ($1, $2, $3)
      ON CONFLICT ON CONSTRAINT unique_problemset_id_user_id
      DO
      UPDATE SET response = $3
      WHERE problemset_best_response.problemset_id = $2
      AND problemset_best_response.user_id = $1`,
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

const scoreSelectedResponse = (problem, response) => ({
  score: problem.answer === response
});

const scoreTruthTable = (problem, response) => {
  response = response.map(row =>
    row.map(el => (el === 'T' ? true : el === 'F' ? false : null))
  );
  const formula = new Formula();
  const truthTable = formula.generateTruthTable(problem.prompt);
  return { score: compareMatrices(response, truthTable) };
};

const scoreNaturalDeduction = (problem, response) => {
  const { linesOfProof } = response;
  console.log('scoreNaturalDeduction', linesOfProof);
  const {
    deduction_prompt: { conclusion }
  } = problem;
  const proof = new Proof();
  proof.setConclusion(conclusion);
  for (const line of linesOfProof) {
    const newLineFormula = new Formula(line.proposition.cleansedFormulaString);
    proof.addLineToProof(
      new LineOfProof({ ...line, proposition: newLineFormula })
    );
  }
  console.log('PROOF!', proof);
  return proof.evaluateProof();
};

const scoreProblemResponse = (problem, response) => {
  console.log('scoreProblemResponse', problem, response);
  let score = null;
  let responseData = null;
  switch (problem.type) {
    case 'true_false':
    case 'multiple_choice':
      score = scoreSelectedResponse(problem, response).score;
      console.log('true_false', score);
      break;
    case 'natural_deduction':
      const result = scoreNaturalDeduction(problem, response);
      score = result.score;
      responseData = result.responseData;
      break;
    case 'truth_table': {
      score = scoreTruthTable(problem, response).score;
      break;
    }
    default:
      break;
  }
  return { score: Number(score), responseData };
};

const scoreResponses = async (responses, problemsetId) => {
  console.log('scoreResponses', responses);
  const ids = Object.keys(responses);
  let problemsetScore = 0;
  const incorrectProblems = [];
  for (const id of ids) {
    console.log(id);
    const q = await query('SELECT * FROM problem WHERE id = $1', [id]);
    const problem = q.rows[0];
    const response = responses[id];
    const { score, responseData } = scoreProblemResponse(problem, response);
    if (!score) {
      incorrectProblems.push({ id, responseData });
    }
    problemsetScore += score;
    console.log('score', score);
  }
  console.log('problemsetScore', problemsetScore);
  console.log('incorrectProblems', incorrectProblems);
  const q = await query(
    'SELECT COUNT(*) FROM problem_v_problemset WHERE problemset_id = $1',
    [problemsetId]
  );
  const count = Number(q.rows[0].count);
  console.log('COUNT!', count);
  return {
    score: Math.floor((problemsetScore / count) * 100),
    incorrectProblems
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
  saveBestResponses,
  saveResponses,
  scoreResponses
};
