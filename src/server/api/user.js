const { createNewUser } = require('../db/data-access-layer/user');
const {
  addStudentsToSectionById,
  getUserGrades
} = require('../db/data-access-layer/section');

const configUserRoutes = app => {
  // Add a user to a section.
  app.post('/api/users', async (req, res) => {
    const { sectionId } = req.body;
    const newKey = await createNewUser();
    await addStudentsToSectionById(sectionId, [newKey]);
    res.send(newKey);
  });

  app.get('/api/user/grades', async (req, res) => {
    const { id } = req.user;
    const grades = await getUserGrades(id);
    console.log('GRADES!!!!', grades);
    res.send(grades);
  });
};

module.exports = configUserRoutes;
