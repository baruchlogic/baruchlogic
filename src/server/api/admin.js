const randomstring = require('randomstring');
const { checkIfKeyExists } = require('../db/data-access-layer/user');

const configAdminRoutes = app => {
  app.post('/api/section', async (req, res) => {
    console.log('req', req);
    console.log('BODY', req.body);
    console.log('user', req.user);
    const { courseNumber, nStudents } = req.body;
    // CREATE SECTION
    for (let i = 0; i < Number(nStudents); i++) {
      let newKey = randomstring.generate(8);
      let keyExists = await checkIfKeyExists(newKey);
      while (keyExists) {
        newKey = randomstring.generate(8);
        keyExists = await checkIfKeyExists(newKey);
      }
    }
    res.send({ a: 'b' });
  });
};

module.exports = configAdminRoutes;
