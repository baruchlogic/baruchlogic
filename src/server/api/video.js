const { getAllVideos } = require('../db/data-access-layer/video');

const configVideoRoutes = app => {
  app.get('/api/videos', async (req, res) => {
    const videos = await getAllVideos();
    res.send(videos);
  });
};

module.exports = configVideoRoutes;
