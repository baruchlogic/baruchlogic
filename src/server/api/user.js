async function getUserById(id) {
  try {
    const user = await query('SELECT * FROM student WHERE id = $1', [id]);
    return user.rows[0];
  } catch (e) {}
}

async function getUserByKey(key) {
  try {
    const user = await query('SELECT * FROM student WHERE key = $1', [key]);
    return user.rows[0];
  } catch (e) {}
}

module.exports = {
  getUserById,
  getUserByKey
};
