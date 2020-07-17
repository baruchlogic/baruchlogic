const { query } = require('../index');
const { getUserByKey } = require('./user');
const { getAllProblemsets } = require('./problemset');

/**
 * Add students to db
 * @param {string[]} studentKeys
 * @return {void}
 */
const addStudents = async studentKeys => {
  Promise.all(
    studentKeys.map(async studentKey => {
      query('INSERT INTO logic_user (course_key, admin) VALUES (?, false);', [
        studentKey
      ]);
    })
  );
};

/**
 * Add students to a section
 * @param {object} sectionData
 * @param {string[]} studentKeys    Array of student keys
 */
const addStudentsToSection = async (sectionData, studentKeys) => {
  const sectionId = await getSectionIdFromSectionNumber(sectionData);
  Promise.all(
    studentKeys.map(async studentKey => {
      const studentId = await getUserIdFromKey(studentKey);
      addStudentToSection(sectionId, studentId);
    })
  );
};

/**
 * Add students to a section by section ID
 * @param {string} sectionId
 * @param {string[]} studentKeys    Array of student keys
 */
const addStudentsToSectionById = async (sectionId, studentKeys) => {
  Promise.all(
    studentKeys.map(async studentKey => {
      const studentId = await getUserIdFromKey(studentKey);
      addStudentToSection(sectionId, studentId);
    })
  );
};

/**
 * Checks if a section with the given data exists.
 * @param  {integer}  sectionNumber
 * @param  {string}  term
 * @param  {integer}  year
 * @return {Promise}
 */
const checkIfSectionExists = async ({ sectionNumber, term, year }) => {
  const q = await query(
    `SELECT id FROM section
    WHERE section_number = ?
    AND term = ?
    AND year = ?`,
    [sectionNumber, term, year]
  );
  return q.length > 0;
};

/**
 * Get the section data for an instructor
 * @param  {string}  instructorId
 * @return {object[]} Array of section data led by instructor
 */
const getInstructorSections = async instructorId => {
  try {
    const q = await query(
      `SELECT * FROM section
      INNER JOIN instructor_v_section
      ON instructor_v_section.section_id = section.id
      WHERE instructor_v_section.instructor_id = ?`,
      [instructorId]
    );
    return q.map(el => ({ ...el }));
  } catch (e) {
    console.log(e);
  }
};

const getDueDate = async (problemsetId, sectionId) => {
  try {
    const response = await query(
      `SELECT due_date from due_date
      WHERE problemset_id = ? AND section_id = ?`,
      [problemsetId, sectionId]
    );
    return response[0] ? response[0].due_date : null;
  } catch (e) {
    console.log(e);
  }
};

const getUserSection = async userId => {
  try {
    const q = await query(
      `SELECT section_id FROM student_roster
      WHERE student_id = ?`,
      [userId]
    );
    return q[0].section_id;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get the section ID for a section, given the section number.
 * @param  {string}  sectionNumber
 * @return {string} The section ID.
 */
const getSectionIdFromSectionNumber = async ({ sectionNumber, term, year }) => {
  try {
    const q = await query(
      `SELECT id FROM section
      WHERE section_number = ? AND term = ? AND year = ?`,
      [sectionNumber, term, year]
    );
    const sectionId = q[0].id;
    return sectionId;
  } catch (e) {}
};

/**
 * Get student ID from key
 * @param  {string}  key
 * @return {string} ID
 */
const getUserIdFromKey = async key => {
  try {
    const q = await query(
      `SELECT id FROM logic_user
      WHERE course_key = ?`,
      [key]
    );
    const id = q[0].id;
    return id;
  } catch (e) {}
};

const getStudentsInSection = async sectionId => {
  try {
    const q = await query(
      `SELECT id, course_key FROM logic_user
      INNER JOIN student_roster
      ON logic_user.id = student_roster.student_id
      WHERE logic_user.admin = false
      AND student_roster.section_id = ?`,
      [sectionId]
    );
    return q ? q.map(el => ({ ...el })) : [];
  } catch (e) {
    console.log(e);
  }
};

/**
 * Add individual student to section by ID's.
 * @param  {string}  sectionId
 * @param  {string}  studentId
 * @return {void}
 */
const addStudentToSection = async (sectionId, studentId) => {
  const q = await query(
    `INSERT INTO student_roster (section_id, student_id)
    VALUES (?, ?)`,
    [sectionId, studentId]
  );
  console.log(q);
};

/**
 * Create a new section in the database.
 * @param  {string} sectionId
 * @param  {string} instructorId
 * @return {void}
 */
const createNewSection = async ({ sectionNumber, term, year }) => {
  try {
    await query(
      `INSERT INTO section (section_number, term, year)
      VALUES (?, ?, ?)`,
      [sectionNumber, term, year]
    );
    const r = await query(
      `SELECT id FROM section
      WHERE section_number = ?
      AND term = ? and year = ?`,
      [sectionNumber, term, year]
    );
    const newSectionId = r[0].id;
    // Assign due dates to the problemsets
    //
    // Add all problemsets to the new section.
    const problemsets = await getAllProblemsets();
    for (const problemset of problemsets) {
      await query(
        `INSERT INTO section_problemset
        VALUES (?, ?, ?)`,
        [newSectionId, problemset.id, problemset.default_order]
      );
    }
    for (const problemset of problemsets) {
      await query(
        `INSERT INTO due_date (section_id, problemset_id, due_date)
        VALUES (?, ?, NOW())`,
        [newSectionId, problemset.id]
      );
    }
    return newSectionId;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Add instructor to section
 * @param  {string}  instructorId
 * @param  {string}  sectionId
 * @return {void}
 */
const addInstructorToSection = async (instructorId, sectionId) => {
  await query(
    `INSERT INTO instructor_v_section (instructor_id, section_id)
    VALUES (?, ?)`,
    [instructorId, sectionId]
  );
};

/**
 * Create a new section and associate it with an instructor.
 * @param  {object} sectionData - { sectionNumber, term, year }
 * @param  {string}  instructorId
 * @return {void}
 */
const createNewSectionWithInstructor = async (sectionData, instructorId) => {
  const newSectionId = await createNewSection(sectionData);
  await addInstructorToSection(instructorId, newSectionId);
};

const getUserGrades = async userId => {
  const q = await query(
    `SELECT problemset_id, score FROM problemset_score
    WHERE logic_user_id = ?`,
    [userId]
  );
  const grades = q;
  return grades;
};

const getUserGradesByUserKey = async key => {
  const { id } = await getUserByKey(key);
  const q = await query(
    `SELECT problemset_id, score FROM problemset_score
    WHERE logic_user_id = ?`,
    [id]
  );
  const grades = (q || []).reduce(
    (acc, row) => Object.assign(acc, { [row.problemset_id]: row.score }),
    {}
  );
  return grades;
};

/**
 * Get the grades for all students in a section.
 * @param  {string}  sectionId
 * @return {object}  Map from user ID's to their grades.
 */
const getSectionGrades = async sectionId => {
  console.log("getSectionGrades")
  const result = {};
  const users = await getStudentsInSection(sectionId);
  console.log("users", users);
  const grades = users.map(async user => {
    const grades = await getUserGradesByUserKey(user.course_key);
    result[user.course_key] = grades;
  });
  await Promise.all(grades);
  return result;
};

const updateStudentGrade = async (studentId, problemsetId, score) => {
  console.log("updateStudentGrade", updateStudentGrade, studentId, problemsetId, score);
  await query(
    `UPDATE problemset_score SET score = ?
    WHERE logic_user_id = ? AND problemset_id = ?;
    `,
    [Number(score), studentId, problemsetId]
  );
  return;
};

const addStudentGrade = async (studentId, problemsetId, score) => {
  console.log("addStudentGrade", updateStudentGrade, studentId, problemsetId, score);
  await query(
    `INSERT INTO problemset_score (logic_user_id, problemset_id, score)
    VALUES (?, ?, ?);
    `,
    [studentId, problemsetId, score]
  );
  return;
};

const getSectionProblemsetIds = async sectionId => {
  const q = await query(
    `SELECT problemset_id AS id, section_problemset.problemset_order
    FROM section_problemset WHERE section_id = ?
    ORDER BY section_problemset.problemset_order`,
    [sectionId]
  );
  return q.map(el => ({ ...el })); // TODO: Util function
};

const getSectionProblemsets = async sectionId => {
  const q = await query(
    `SELECT due_date.section_id,
    due_date.problemset_id AS id,
    section_problemset.problemset_order,
    problemset.unit,
    problemset.index_in_unit,
    due_date,
    problemset.default_order,
    problemset.name
    FROM section_problemset
    RIGHT JOIN due_date ON
    due_date.section_id = section_problemset.section_id
    AND due_date.problemset_id = section_problemset.problemset_id
    JOIN problemset
    ON section_problemset.problemset_id = problemset.id
    WHERE due_date.section_id = ?`,
    [sectionId]
  );
  return (q || []).map(el => ({ ...el }));
};

const removeUserFromSection = async (userId, sectionId) => {
  await query(
    `DELETE FROM student_roster WHERE student_id = ? AND section_id = ?`,
    [userId, sectionId]
  );
  return;
};

const updateProblemsetDueDate = async ({ problemsetId, sectionId, date }) => {
  await query(
    `UPDATE due_date SET due_date = ?
    WHERE problemset_id = ? AND section_id = ?;`,
    [date, problemsetId, sectionId]
  );
};

const deleteProblemsetFromSection = async (psId, sectionId) => {
  await query(
    `DELETE FROM section_problemset
    WHERE section_id = ? AND problemset_id = ?;`,
    [sectionId, psId]
  );
  return;
};

const addProblemsetToSection = async (psId, sectionId) => {
  const q = await query('select default_order from problemset where id = ?', [
    psId
  ]);
  const problemsetOrder = q[0].default_order;
  await query(
    `INSERT INTO section_problemset
    (section_id, problemset_id, problemset_order)
    VALUES (?, ?, ?);`,
    [sectionId, psId, problemsetOrder]
  );
  return;
};

module.exports = {
  addProblemsetToSection,
  addStudentGrade,
  addStudents,
  addStudentsToSection,
  addStudentsToSectionById,
  checkIfSectionExists,
  createNewSectionWithInstructor,
  deleteProblemsetFromSection,
  getDueDate,
  getInstructorSections,
  getSectionGrades,
  getSectionProblemsetIds,
  getSectionProblemsets,
  getStudentsInSection,
  getUserIdFromKey,
  getUserSection,
  getUserGrades,
  removeUserFromSection,
  updateProblemsetDueDate,
  updateStudentGrade
};
