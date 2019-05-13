const {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  scoreResponses
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

  app.post('/api/problemsets/:id', async (req, res) => {
    console.log('POST', req.body);
    const score = await scoreResponses(req.body);
    res.status(200).send(String(score));
  });
};

module.exports = configProblemsetRoutes;
