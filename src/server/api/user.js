const { createNewUser } = require('../db/data-access-layer/user');
const { addStudentsToSectionById } = require('../db/data-access-layer/section');

const configUserRoutes = app => {
  app.post('/api/users', async (req, res) => {
    console.log('/api/users');
    const { sectionId } = req.body;
    const newKey = await createNewUser();
    await addStudentsToSectionById(sectionId, [newKey]);
    res.send(newKey);
  });
};

module.exports = configUserRoutes;
