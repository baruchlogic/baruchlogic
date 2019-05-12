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
      'SELECT row_to_json(problem) FROM (select id, type, choices, problem_v_problemset.problem_index FROM problem INNER JOIN problem_v_problemset ON problem.id = problem_v_problemset.problem_id WHERE problem_v_problemset.problemset_id = $1) problem ORDER BY problem_index ASC;',
      [id]
    );
    return response.rows.map(row => row.row_to_json);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById
};
