const { query } = require('../index');
const { Formula, LineOfProof, Proof } = require('logically-new');

const getAllProblemsets = async () => {
  try {
    const response = await query('SELECT * FROM problemset', []);
    return response.map(row => ({ ...row }));
  } catch (e) {
    console.log(e);
  }
};

const getProblemSetById = async id => {
  try {
    const response = await query('SELECT * FROM problemset WHERE id = ?', [id]);
    return { ...response[0] };
  } catch (e) {
    console.log(e);
  }
};

const getBestResponses = async (problemsetId, studentId) => {
  try {
    const response = await query(
      `SELECT response FROM problemset_best_response
      WHERE problemset_id = ?
      AND user_id = ?`,
      [problemsetId, studentId]
    );
    return (
      response &&
      response[0] &&
      response[0].response &&
      JSON.parse(response[0].response)
    );
  } catch (e) {
    console.log(e);
  }
};

const getProblemsByProblemsetId = async id => {
  try {
    // PostgreSQL 8:
    const response = await query(
      `SELECT id, problem_type, prompt, choices, deduction_prompt,
      problem_v_problemset.problem_index
      FROM problem
      INNER JOIN problem_v_problemset
      ON problem.id = problem_v_problemset.problem_id
      WHERE problem_v_problemset.problemset_id = ?
      ORDER BY problem_index ASC;`,
      [id]
    );
    return response.map(row => {
      row.choices = row.choices ? JSON.parse(row.choices) : row.choices;
      row.deduction_prompt = row.deduction_prompt
        ? JSON.parse(row.deduction_prompt)
        : row.deduction_prompt;
      return { ...row };
    });
  } catch (e) {
    console.log(e);
  }
};

const saveBestScore = async (studentId, problemsetId, score) => {
  const q = await query(
    `SELECT score FROM problemset_score
    WHERE logic_user_id = ?
    AND problemset_id = ?`,
    [studentId, problemsetId]
  );
  if (q && q.length) {
    await query(
      `UPDATE problemset_score
      SET score = ?
      WHERE problemset_score.problemset_id = ?
      AND problemset_score.logic_user_id = ?
      AND problemset_score.score < ?`,
      [score, problemsetId, studentId, score]
    );
  } else {
    await query(
      `INSERT INTO problemset_score
      (logic_user_id, problemset_id, score)
      VALUES (?, ?, ?)`,
      [studentId, problemsetId, score]
    );
  }
};

/**
 * Saves the last submitted response
 * @param  {string}  studentId
 * @param  {problemsetId}  problemsetId
 * @param  {object}  responses
 * @return {void}
 */
const saveResponses = async (studentId, problemsetId, responses) => {
  // Save to problemset_last_response
  const q = await query(
    `SELECT * FROM problemset_last_response
    WHERE problemset_last_response.problemset_id = ?
    AND problemset_last_response.user_id = ?`,
    [problemsetId, studentId]
  );
  if (q && q.length) {
    await query(
      `UPDATE problemset_last_response SET response = ?
      WHERE problemset_last_response.problemset_id = ?
      AND problemset_last_response.user_id = ?`,
      [JSON.stringify(responses), problemsetId, studentId]
    );
  } else {
    await query(
      `INSERT INTO problemset_last_response
      (user_id, problemset_id, response)
      VALUES
      (?, ?, ?)`,
      [studentId, problemsetId, JSON.stringify(responses)]
    );
  }

  // Save to problemset_all_responses
  await query(
    `INSERT INTO problemset_all_responses
    (user_id, problemset_id, response)
    VALUES
    (?, ?, ?)`,
    [studentId, problemsetId, JSON.stringify(responses)]
  );

  // Upsert last response
  // await query(
  //   `INSERT INTO problemset_last_response
  //   (student_id, problemset_id, response)
  //   VALUES
  //   ($1, $2, $3)
  //   ON CONFLICT ON CONSTRAINT problemset_id_student_id_unique
  //   DO
  //   UPDATE SET response = $3
  //   WHERE problemset_last_response.problemset_id = $2
  //   AND problemset_last_response.student_id = $1`,
  //   [studentId, problemsetId, responses]
  // );
};

const saveBestResponses = async (studentId, problemsetId, responses) => {
  const { score } = await scoreResponses(responses, problemsetId);

  const currentScore = await getScore(problemsetId, studentId);

  if (currentScore === undefined || currentScore === null) {
    await query(
      `INSERT INTO problemset_best_response
      (user_id, problemset_id, response)
      VALUES
      (?, ?, ?)`,
      [studentId, problemsetId, JSON.stringify(responses)]
    );
  } else if (score > currentScore) {
    await query(
      `UPDATE problemset_best_response
      SET response = ?
      WHERE problemset_id = ?
      AND user_id = ?`,
      [JSON.stringify(responses), problemsetId, studentId]
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
  const truthTable = Formula.generateTruthTable(problem.prompt);
  return { score: compareMatrices(response, truthTable) };
};

const scoreNaturalDeduction = (problem, response) => {
  const { linesOfProof } = response;
  const conclusion = JSON.parse(problem.deduction_prompt).conclusion;
  const proof = new Proof();
  proof.setConclusion(conclusion);
  for (const line of linesOfProof) {
    const newLineFormula = new Formula(line.proposition.cleansedFormulaString);
    proof.addLineToProof(
      new LineOfProof({ ...line, proposition: newLineFormula })
    );
  }
  return proof.evaluateProof();
};

const scoreProblemResponse = (problem, response) => {
  let score = null;
  let responseData = null;
  switch (problem.problem_type) {
    case 'true_false':
    case 'multiple_choice':
      score = scoreSelectedResponse(problem, response).score;
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
  const ids = Object.keys(responses);
  let problemsetScore = 0;
  const incorrectProblems = [];
  for (const id of ids) {
    const q = await query('SELECT * FROM problem WHERE id = ?', [id]);
    const problem = { ...q[0] };
    const response = responses[id];
    const { score, responseData } = scoreProblemResponse(problem, response);
    if (!score) {
      incorrectProblems.push({ id, responseData });
    }
    problemsetScore += score;
  }
  const q = await query(
    `SELECT COUNT(*) as count
    FROM problem_v_problemset
    WHERE problemset_id = ?`,
    [problemsetId]
  );
  const count = Number(q[0].count);
  return {
    score: Math.floor((problemsetScore / count) * 100),
    incorrectProblems
  };
};

const getScore = async (problemsetId, studentId) => {
  const q = await query(
    `SELECT score
    FROM problemset_score
    WHERE problemset_id = ?
    AND logic_user_id = ?`,
    [problemsetId, studentId]
  );
  return q && q[0] && q[0].score;
};

const scoreExists = async (studentId, problemsetId) => {
  const q = await query(
    `SELECT score FROM problemset_score
    WHERE logic_user_id = ? AND problemset_id = ?`,
    [studentId, problemsetId]
  );
  return q.rows && q.rows.length;
};

const updateProblemsetScore = async (studentId, problemsetId, score) => {
  await query(
    `UPDATE problemset_score SET score = ?
    WHERE logic_user_id = ? AND problemset_id = ?`,
    [score, studentId, problemsetId]
  );
};

const addProblemsetScore = async (studentId, problemsetId, score) => {
  await query(
    `INSERT INTO problemset_score (logic_user_id, problemset_id, score)
    VALUES (?, ?, ?)`,
    [studentId, problemsetId, score]
  );
};

module.exports = {
  addProblemsetScore,
  compareMatrices,
  getBestResponses,
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveBestResponses,
  saveResponses,
  scoreExists,
  scoreResponses,
  updateProblemsetScore
};
