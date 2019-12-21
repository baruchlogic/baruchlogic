const { query } = require('../index');
const { Formula, LineOfProof, Proof } = require('logically');

const getAllProblemsets = async () => {
  try {
    console.log('getAllProblemsets');
    const response = await query('SELECT * FROM problemset', []);
    console.log(response);
    return response.map(row => ({ ...row }));
  } catch (e) {
    console.log(e);
  }
};

const getProblemSetById = async id => {
  try {
    const response = await query('SELECT * FROM problemset WHERE id = ?', [id]);
    console.log('RESPONSE', response);
    return { ...response[0] };
  } catch (e) {
    console.log(e);
  }
};

const getBestResponses = async (problemsetId, studentId) => {
  try {
    console.log('GET BEST RESPONSE', problemsetId, studentId);
    const response = await query(
      `SELECT response FROM problemset_best_response
      WHERE problemset_id = ?
      AND user_id = ?`,
      [problemsetId, studentId]
    );
    console.log('RESPONSENRESONSERPSORES', response);
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
  console.log('getProblemsByProblemsetId', id);
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
    // PostgreSQL 9:
    // const response = await query(
    //   `SELECT row_to_json(problem)
    //   FROM (select id, type, prompt, choices, deduction_prompt,
    //   problem_v_problemset.problem_index
    //   FROM problem
    //   INNER JOIN problem_v_problemset
    //   ON problem.id = problem_v_problemset.problem_id
    //   WHERE problem_v_problemset.problemset_id = $1) problem
    //   ORDER BY problem_index ASC;`,
    //   [id]
    // );
    console.log('response', response);
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
  console.log('saveBestScore');
  const q = await query(
    `SELECT * FROM problemset_score
    WHERE logic_user_id = ?
    AND problemset_id = ?`,
    [studentId, problemsetId]
  );
  console.log('Q!@#', q);
  if (q && q.length) {
    await query(
      `UPDATE problemset_score
      SET score = ?
      WHERE problemset_score.problemset_id = ?
      AND problemset_score.logic_user_id = ?
      AND problemset_score.score < ?`,
      [problemsetId, studentId, score]
    );
  } else {
    await query(
      `INSERT INTO problemset_score
      (logic_user_id, problemset_id, score)
      VALUES (?, ?, ?)`,
      [studentId, problemsetId, score]
    );
  }
  // await query(
  //   `INSERT INTO problemset_score
  //   (student_id, problemset_id, score)
  //   VALUES
  //   ($1, $2, $3)
  //   ON CONFLICT ON CONSTRAINT
  //   problemset_score_unique
  //   DO
  //   UPDATE SET score = $3
  //   WHERE problemset_score.problemset_id = $2
  //   AND problemset_score.student_id = $1
  //   AND problemset_score.score < $3`,
  //   [studentId, problemsetId, score]
  // );
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

  const q = await query(
    `SELECT * FROM problemset_last_response
    WHERE problemset_last_response.problemset_id = ?
    AND problemset_last_response.user_id = ?`,
    [problemsetId, studentId]
  );
  console.log('Q!!!!', q);
  if (q && q.length) {
    await query(
      `UPDATE problemset_last_response SET response = ?
      WHERE problemset_last_response.problemset_id = ?
      AND problemset_last_response.user_id = ?`,
      [responses, problemsetId, studentId]
    );
  } else {
    await query(
      `INSERT INTO problemset_last_response
      (user_id, problemset_id, response)
      VALUES
      (?, ?, ?)`,
      [studentId, problemsetId, responses]
    );
  }
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
  console.log('saveBestResponse', responses);

  const { score } = await scoreResponses(responses, problemsetId);

  const currentScore = await getScore(problemsetId, studentId);

  console.log('current score', currentScore);

  if (currentScore === undefined || currentScore === null) {
    console.log('current score undefined - insert');
    await query(
      `INSERT INTO problemset_best_response
      (user_id, problemset_id, response)
      VALUES
      (?, ?, ?)`,
      [studentId, problemsetId, responses]
    );
  } else if (score > currentScore) {
    console.log('update best response');
    await query(
      `UPDATE problemset_best_response
      SET response = ?
      WHERE problemset_id = ?
      AND user_id = ?`,
      [responses, problemsetId, studentId]
    );
  }

  // if (!currentScore || score > currentScore) {
  //   console.log('SAVE NEW BEST RESPONSE');
  //   // Upsert best response if score is higher
  //   await query(
  //     `INSERT INTO problemset_best_response
  //     (user_id, problemset_id, response)
  //     VALUES
  //     ($1, $2, $3)
  //     ON CONFLICT ON CONSTRAINT unique_problemset_id_user_id
  //     DO
  //     UPDATE SET response = $3
  //     WHERE problemset_best_response.problemset_id = $2
  //     AND problemset_best_response.user_id = $1`,
  //     [studentId, problemsetId, responses]
  //   );
  // }
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
  console.log('SCORE NATURAL DEDUCTION', 'problem', problem, 'response', response);
  const { linesOfProof } = response;
  console.log('scoreNaturalDeduction', linesOfProof);
  const conclusion = JSON.parse(problem.deduction_prompt).conclusion;
  // const {
  //   deduction_prompt: { conclusion }
  // } = problem;
  console.log('conclusion', conclusion);
  const proof = new Proof();
  // proof.conclusion = conclusion;
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
  switch (problem.problem_type) {
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
    const q = await query('SELECT * FROM problem WHERE id = ?', [id]);
    console.log(q);
    const problem = { ...q[0] };
    debugger;
    console.log('problem', problem);
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
    'SELECT COUNT(*) as count FROM problem_v_problemset WHERE problemset_id = ?',
    [problemsetId]
  );
  console.log('Q', q);
  const count = Number(q[0].count);
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
    WHERE problemset_id = ?
    AND logic_user_id = ?`,
    [problemsetId, studentId]
  );
  console.log('getScore QUERY', q);
  return q && q[0] && q[0].score;
};

module.exports = {
  getBestResponses,
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveBestResponses,
  saveResponses,
  scoreResponses
};
