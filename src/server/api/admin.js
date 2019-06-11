const randomstring = require('randomstring');
const {
  addStudents,
  addStudentsToSection,
  createNewSectionWithInstructor
} = require('../db/data-access-layer/section');
const { checkIfKeyExists } = require('../db/data-access-layer/user');

const configAdminRoutes = app => {
  app.post('/api/section', async (req, res) => {
    console.log('req', req);
    console.log('BODY', req.body);
    console.log('user', req.user);
    const { sectionNumber, nStudents, term, year } = req.body;
    const { id: instructorId } = req.user;
    console.log('INSTRUCTORID', instructorId, typeof instructorId);
    await createNewSectionWithInstructor(
      { sectionNumber, term, year },
      instructorId
    );
    const studentKeys = [];
    for (let i = 0; i < Number(nStudents); i++) {
      let newKey = randomstring.generate(8);
      let keyExists = await checkIfKeyExists(newKey);
      while (keyExists) {
        newKey = randomstring.generate(8);
        keyExists = await checkIfKeyExists(newKey);
      }
      studentKeys.push(newKey);
    }
    await addStudents(studentKeys);
    await addStudentsToSection({ sectionNumber, term, year }, studentKeys);
  });
};

module.exports = configAdminRoutes;
