const moment = require('moment');
const {
  getAllProblemsets,
  getBestResponses,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveBestResponses,
  saveResponses,
  scoreResponses
} = require('../db/data-access-layer/problemset');

const {
  getDueDate,
  getUserSection
} = require('../db/data-access-layer/section');

const configProblemsetRoutes = app => {
  app.get('/api/problemsets', async (req, res) => {
    console.log('configProblemsetRoutes')
    const problemsets = await getAllProblemsets();
    console.log(problemsets);
    res.status(200).send(problemsets);
  });

  app.get('/api/problemsets/:id', async (req, res) => {
    console.log('HERE');
    const problemset = await getProblemSetById(Number(req.params.id));
    console.log(problemset);

    const { section_id: sectionId } = req.user || {};

    console.log('USER SECTION', sectionId);
    const dueDate = await getDueDate(problemset.id, sectionId);
    console.log('DUE DATE &&&&&', dueDate);

    const problemsetResponse = { ...problemset, due_date: dueDate };

    res.status(200).send(problemsetResponse);
  });

  app.get('/api/problemsets/:id/problems', async (req, res) => {
    const problems = await getProblemsByProblemsetId(Number(req.params.id));
    console.log("PROBLEMS****", problems);
    res.status(200).send(problems);
  });

  app.post('/api/problemsets/:id', async (req, res) => {
    console.log('PROBLEMSETS POST', req.body);
    // console.log('USER', req.user);
    // const json = await req.json();
    // console.log('JSON', json);
    const { id: problemsetId } = req.params;
    const { id: studentId } = req.user;
    const sectionId = await getUserSection(studentId);
    const { incorrectProblems, score } = await scoreResponses(
      req.body,
      problemsetId
    );
    console.log('SCORE', score);
    console.log('INCORRECT PROBLEMS', incorrectProblems);
    console.log('USER', req.user);

    const dueDate = await getDueDate(problemsetId, sectionId);
    console.log('DUE DATE &&&&&', dueDate);

    await saveResponses(studentId, problemsetId, req.body);

    const isPastDueDate = dueDate && moment(dueDate).isBefore(moment());

    if (!isPastDueDate) {
      // Only save the best score if it's not after the due date
      console.log('save the best score@@@@!!!!');
      await saveBestResponses(studentId, problemsetId, req.body);
      await saveBestScore(studentId, problemsetId, score);
    }
    res.send(JSON.stringify({ incorrectProblems, score }));
  });

  app.get('/api/problemsets/:id/score', async (req, res) => {
    let score;
    if (req.user) {
      const { id: problemsetId } = req.params;
      const { id: studentId } = req.user;
      score = await getScore(problemsetId, studentId);
    }
    res.status(200).send(String(score) || nulls);
  });

  app.get('/api/problemsets/:problemsetId/responses', async (req, res) => {
    if (req.user) {
      const { id: studentId } = req.user;
      const { problemsetId } = req.params;
      const bestResponses = await getBestResponses(problemsetId, studentId);
      console.log('GOT THE RESPONSES', bestResponses);
      res.setHeader('Content-Type', 'application/json');
      res.send({ responses: bestResponses });
    }
  });
};

module.exports = configProblemsetRoutes;
