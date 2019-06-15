const { createNewUser } = require('../db/data-access-layer/user');
const { addStudentsToSectionById } = require('../db/data-access-layer/section');

const configUserRoutes = app => {
  app.post('/api/user', async (req, res) => {
    console.log('/api/user');
    const { action, sectionId } = req.body;
    switch (action) {
      case 'CREATE':
        const newKey = await createNewUser();
        await addStudentsToSectionById(sectionId, [newKey]);
        res.status(200).send(newKey);
        return;
      default:
        break;
    }
    res.status(200);
  });
};

module.exports = configUserRoutes;
