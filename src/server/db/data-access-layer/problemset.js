const { query } = require('../index');

const getAllProblemsets = async () => {
  try {
    const response = await query('SELECT * FROM problemset', []);
    console.log('RESPONSE', response.rows);
    return response.rows;
  } catch (e) {
    console.log(e);
  }
};

const getProblemSetById = async id => {
  console.log('getProblemSetById');
  try {
    const response = await query('SELECT * FROM problemset WHERE id = $1', [
      id
    ]);
    return response.rows[0];
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAllProblemsets,
  getProblemSetById
};
