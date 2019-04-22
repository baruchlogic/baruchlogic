// Configure headers so that client app can communicate with API
const configHeaders = app => {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    next();
  });
};

module.exports = configHeaders;
