const randomstring = require('randomstring');
const { query } = require('../index');

/**
 * Check if a user exists with the given key.
 * @param  {string} key
 * @return {boolean}
 */
const checkIfKeyExists = async key => {
  console.log('checkIfKeyExists');
  const user = await getUserByKey(key);
  console.log('checkIfKeyExists result', user);
  return Object.keys(user).length > 0;
};

/**
 * Create a new unique user key
 * @return {string} The new user key
 */
const createNewKey = async () => {
  console.log('createNewKey');
  let newKey = randomstring.generate({
    length: 8,
    readable: true,
    charset: 'alphabetic'
  });
  let keyExists = await checkIfKeyExists(newKey);
  while (keyExists) {
    newKey = randomstring.generate({
      length: 8,
      readable: true,
      charset: 'alphabetic'
    });
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
  try {
    console.log('getUserById', id)
    const user = await query(`SELECT * FROM logic_user WHERE id = ?`, [id]);
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
  console.log('getUserByKey', key);
  try {
    const user = await query(`SELECT * FROM logic_user WHERE course_key = ?`, [
      key
    ]);
    if (user[0] && !user[0].admin) {
      const sectionId = await query(
        `SELECT section_id FROM student_roster WHERE student_id = ?`,
        [user[0].id]
      );
      user[0].section_id = sectionId[0].section_id;
    }
    console.log('getUserByKey returning', { ...user[0] });
    return user[0] ? { ...user[0] } : {};
  } catch (e) {}
};

module.exports = {
  createNewKey,
  createNewUser,
  getUserById,
  getUserByKey
};
