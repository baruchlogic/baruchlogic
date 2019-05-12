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

module.exports = {
  getAllProblemsets
};
