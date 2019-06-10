const configAdminRoutes = app => {
  app.post('/api/section', async (req, res) => {
    console.log('req', req);
    console.log('user', req.user);
    res.status(200).send({ a: 'b'});
  });
};

module.exports = configAdminRoutes;
