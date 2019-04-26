import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { H1 } from '@blueprintjs/core';

import VideosCard from './VideosCard';

// #3a3a8f, #2bb055, #394b59, #2ed41c, #10559f
const StyledContainer = styled.div`
  background-color: #10559f;
  color: white;
  height: 1000px;
  text-align: center;
  width: 250px;
`;

const StyledH1 = styled(H1)`
  color: white !important;
`;

const VideosContainer = () => {
  const [videos, setVideos] = useState([]);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);

  const fetchVideos = async () => {
    const response = await fetch('http://localhost:5000/api/videos').then(res =>
      res.json()
    );
    setVideos(response.rows);
    setFetchIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return fetchIsLoading ? null : (
    <>
      <div>
        <StyledContainer>
          <StyledH1>Videos</StyledH1>
          <div>
            <ol>
              {videos.map(video => (
                <li key={video.id}>{video.title}</li>
              ))}
            </ol>
          </div>
        </StyledContainer>
      </div>
      <VideosCard video={videos[0]} />
    </>
  );
};

export default VideosContainer;
