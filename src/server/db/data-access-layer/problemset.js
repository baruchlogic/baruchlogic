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
      'SELECT (id, type, choices, prompt) FROM problem INNER JOIN problem_v_problemset ON problem.id = problem_v_problemset.problem_id WHERE problem_v_problemset.problemset_id = $1', [id]
    );
    return response.rows;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById
};
