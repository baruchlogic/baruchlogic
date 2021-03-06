const { query } = require('../index');

const getAllVideos = async () => {
  try {
    const videos = await query('SELECT * FROM video', []);
    return videos.map(video => ({ ...video }));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAllVideos
};
