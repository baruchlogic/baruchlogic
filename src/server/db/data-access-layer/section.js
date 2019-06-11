const { query } = require('../index');

/**
 * Create a new section in the database.
 * @param  {string} sectionId
 * @param  {string} instructorId
 * @return {void}
 */
const createNewSection = async ({ sectionId, term, year }) => {
  try {
    await query(`INSERT INTO section (id, term, year) VALUES ($1, $2, $3)`, [
      sectionId,
      term,
      year
    ]);
  } catch (e) {}
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
    VALUES ($1, $2)`,
    [instructorId, sectionId]
  );
};

/**
 * Create a new section and associate it with an instructor.
 * @param  {{object}} sectionData - { id, term, year }
 * @param  {string}  instructorId
 * @return {void}
 */
const createNewSectionWithInstructor = async (sectionData, instructorId) => {
  await Promise.all(
    createNewSection(sectionData),
    addInstructorToSection(instructorId)
  );
};

module.exports = {
  createNewSectionWithInstructor
};
