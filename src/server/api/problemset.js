const {
  getAllProblemsets,
  getProblemSetById
} = require('../db/data-access-layer/problemset');

const configProblemsetRoutes = app => {
  app.get('/api/problemsets', async (req, res) => {
    const problemsets = await getAllProblemsets();
    res.status(200).send(problemsets);
  });

  app.get('/api/problemsets/:id', async (req, res) => {
    console.log('HERE', req.params);
    const problemset = await getProblemSetById(Number(req.params.id));
    console.log('PROBLEMSET', problemset);
    res.status(200).send(problemset);
  });
};

module.exports = configProblemsetRoutes;
