const { compareMatrices } = require('./problemset');
const { Formula } = require('logically-new');

const scoreTruthTableResponse = body => {
  response = body.value.map(row =>
    row.map(el => (el === 'T' ? true : el === 'F' ? false : null))
  );
  const truthTable = Formula.generateTruthTable(body.prompt);
  return { score: compareMatrices(response, truthTable) };
};

module.exports.scoreTruthTableResponse = scoreTruthTableResponse;
