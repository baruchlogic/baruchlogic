import React, { useEffect, useState } from 'react';

const VideosContainer = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    const response = await fetch('http://localhost:5000/api/videos').then(res =>
      res.json()
    );
    setVideos(response.rows);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      Videos
      <ul>
        {videos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default VideosContainer;
