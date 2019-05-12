const { getAllProblemsets } = require('../db/data-access-layer/problemset');

const configProblemsetRoutes = app => {
  app.get('/api/problemsets', async (req, res) => {
    const problemsets = await getAllProblemsets();
    res.status(200).send(problemsets);
  });
};

module.exports = configProblemsetRoutes;
