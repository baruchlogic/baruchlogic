const randomstring = require('randomstring');
const { query } = require('../index');

/**
 * Check if a user exists with the given key.
 * @param  {string} key
 * @return {boolean}
 */
const checkIfKeyExists = async key => {
  const user = await getUserByKey(key);
  return !!user;
};

/**
 * Create a new unique user key
 * @return {string} The new user key
 */
const createNewKey = async () => {
  let newKey = randomstring.generate(8);
  let keyExists = await checkIfKeyExists(newKey);
  while (keyExists) {
    newKey = randomstring.generate(8);
    keyExists = await checkIfKeyExists(newKey);
  }
  return newKey;
};

const createNewUser = async (admin = false) => {
  try {
    const newKey = await createNewKey();
    await query(`INSERT INTO logic_user (course_key, admin) VALUES (?, ?)`, [
      newKey,
      admin
    ]);
    return newKey;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get user from user table by user.id
 * @param  {string} id - id of the desired user
 * @return {object|undefined} - the desired user, if found
 */
const getUserById = async id => {
  console.log('getUserById');
  try {
    const user = await query(
      `SELECT * FROM logic_user
      WHERE id = ?`,
      [id]
    );
    if (!user[0].admin) {
      const sectionId = await query(
        `SELECT section_id FROM student_roster WHERE student_id = ?`,
        [user[0].id]
      );
      user[0].section_id = sectionId[0].section_id;
    }
    return { ...user[0] };
  } catch (e) {}
};

/**
 * Get user from user table by user.key
 * @param  {string} key - key of the desired user
 * @return {object|undefined} - the desired user, if found
 */
const getUserByKey = async key => {
  try {
    console.log('getUserByKey', key);
    const user = await query(`SELECT * FROM logic_user WHERE course_key = ?`, [
      key
    ]);
    console.log('QUERY', user);
    if (!user[0].admin) {
      const sectionId = await query(
        `SELECT section_id FROM student_roster WHERE student_id = ?`,
        [user[0].id]
      );
      user[0].section_id = sectionId[0].section_id;
    }
    console.log('RETURNING USER', user);
    return { ...user[0] };
  } catch (e) {}
};

module.exports = {
  createNewKey,
  createNewUser,
  getUserById,
  getUserByKey
};
