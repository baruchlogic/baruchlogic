const {
  addStudentsToSection,
  checkIfSectionExists,
  createNewSectionWithInstructor
} = require('../db/data-access-layer/section');
const { createNewUser } = require('../db/data-access-layer/user');

const configAdminRoutes = app => {
  // Creates a new section and returns the section number and student keys
  app.post('/api/section', async (req, res) => {
    const { sectionNumber, nStudents, term, year } = req.body;
    const sectionExists = await checkIfSectionExists(req.body);
    if (sectionExists) {
      res.sendStatus(400);
      return;
    }
    const { id: instructorId } = req.user;
    await createNewSectionWithInstructor(
      { sectionNumber, term, year },
      instructorId
    );
    const studentKeys = [];
    for (let i = 0; i < Number(nStudents); i++) {
      const newKey = await createNewUser();
      studentKeys.push(newKey);
    }
    await addStudentsToSection({ sectionNumber, term, year }, studentKeys);
    res.status(200).send({
      sectionNumber,
      studentKeys
    });
  });
};

module.exports = configAdminRoutes;
