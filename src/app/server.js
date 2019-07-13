const app = require('express')();
const port = process.env.PORT || 3000;
const path = require('path');

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
