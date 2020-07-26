const { scoreTruthTableResponse } = require('../db/data-access-layer/practice');
const { Formula } = require('logically-new');

const configPracticeRoutes = app => {
  // Submits a user's responses to a problemset.
  // Returns the incorrect problems and the score.
  app.post('/api/practice/truth-table', async (req, res) => {
    console.log('SHKFLSHKF', req.body);
    const { score } = await scoreTruthTableResponse(req.body);

    const solution = Formula.generateTruthTable(req.body.prompt);

    res.send(JSON.stringify({ solution, score }));
  });
};

module.exports = configPracticeRoutes;
