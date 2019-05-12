const {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById
} = require('../db/data-access-layer/problemset');

const configProblemsetRoutes = app => {
  app.get('/api/problemsets', async (req, res) => {
    const problemsets = await getAllProblemsets();
    res.status(200).send(problemsets);
  });

  app.get('/api/problemsets/:id', async (req, res) => {
    const problemset = await getProblemSetById(Number(req.params.id));
    res.status(200).send(problemset);
  });

  app.get('/api/problemsets/:id/problems', async (req, res) => {
    const problems = await getProblemsByProblemsetId(Number(req.params.id));
    res.status(200).send(problems);
  });
};

module.exports = configProblemsetRoutes;
