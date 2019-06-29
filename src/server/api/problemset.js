const {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveResponses,
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
    console.log('PROBLEMSETS POST', req.body);
    // console.log('USER', req.user);
    // const json = await req.json();
    // console.log('JSON', json);
    const { id: problemsetId } = req.params;
    const { id: studentId } = req.user;
    const { incorrectProblemIDs, score } = await scoreResponses(
      req.body,
      problemsetId
    );
    console.log('SCORE', score);
    await saveResponses(studentId, problemsetId, req.body);
    await saveBestScore(studentId, problemsetId, score);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ incorrectProblemIDs, score }));
  });

  app.get('/api/problemsets/:id/score', async (req, res) => {
    const { id: problemsetId } = req.params;
    const { id: studentId } = req.user;
    const score = await getScore(problemsetId, studentId);
    res.status(200).send(String(score));
  });
};

module.exports = configProblemsetRoutes;
