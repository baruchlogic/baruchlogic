const { createNewUser } = require('../db/data-access-layer/user');
const { addStudentsToSectionById } = require('../db/data-access-layer/section');

const configUserRoutes = app => {
  // Add a user to a section.
  app.post('/api/users', async (req, res) => {
    const { sectionId } = req.body;
    const newKey = await createNewUser();
    await addStudentsToSectionById(sectionId, [newKey]);
    res.send(newKey);
  });
};

module.exports = configUserRoutes;
