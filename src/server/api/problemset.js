const moment = require('moment');
const {
  getAllProblemsets,
  getProblemsByProblemsetId,
  getProblemSetById,
  getScore,
  saveBestScore,
  saveResponses,
  scoreResponses
} = require('../db/data-access-layer/problemset');

const {
  getDueDate
  // getUserSection
} = require('../db/data-access-layer/section');

const configProblemsetRoutes = app => {
  app.get('/api/problemsets', async (req, res) => {
    const problemsets = await getAllProblemsets();
    res.status(200).send(problemsets);
  });

  app.get('/api/problemsets/:id', async (req, res) => {
    console.log('HERE');
    const problemset = await getProblemSetById(Number(req.params.id));
    console.log(problemset);

    const { section_id: sectionId } = req.user;

    console.log('USER SECTION', sectionId);
    const dueDate = await getDueDate(problemset.id, sectionId);
    console.log('DUE DATE &&&&&', dueDate);

    const problemsetResponse = { ...problemset, due_date: dueDate };

    res.status(200).send(problemsetResponse);
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
    const { id: studentId, section_id: sectionId } = req.user;
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
      await saveBestScore(studentId, problemsetId, score);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ incorrectProblems, score }));
  });

  app.get('/api/problemsets/:id/score', async (req, res) => {
    const { id: problemsetId } = req.params;
    const { id: studentId } = req.user;
    const score = await getScore(problemsetId, studentId);
    res.status(200).send(String(score));
  });
};

module.exports = configProblemsetRoutes;
