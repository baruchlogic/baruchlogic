const configAdminRoutes = app => {
  app.post('/api/section', async (req, res) => {
    console.log('req', req);
    console.log('BODY', req.body);
    console.log('user', req.user);
    res.send({ a: 'b'});
  });
};

module.exports = configAdminRoutes;
