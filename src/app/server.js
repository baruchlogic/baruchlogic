const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
