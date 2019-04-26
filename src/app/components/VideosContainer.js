import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
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

const VideosContainer = ({
  match: {
    params: { 'short_title': currentShortTitle }
  }
}) => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);

  const fetchVideos = async () => {
    const response = await fetch('http://localhost:5000/api/videos').then(res =>
      res.json()
    );
    setVideos(response.rows);
    setFetchIsLoading(false);
  };

  const getCurrentVideo = () => {
    const currentVideo = videos.find(
      video => video.short_title === currentShortTitle
    );
    setCurrentVideo(currentVideo);
  };

  const sortByUnitAndUnitIndex = (a, b) => {
    if (a.unit < b.unit) {
      return -1;
    } else if (a.unit > b.unit) {
      return 1;
    } else {
      if (a.unit_index < b.unit_index) {
        return -1;
      } else if (a.unit_index > b.unit_index) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const groupVideos = videos => {
    const sorted = [...videos];
    sorted.sort(sortByUnitAndUnitIndex);
    const result = {};
    for (const video of sorted) {
      const unitNumber = video.unit;
      const arr = result[unitNumber];
      result[unitNumber] = arr ? [...arr, video] : [video];
    }
    console.log('GROUP', result);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    groupVideos(videos);
  });

  useEffect(() => {
    getCurrentVideo();
  });

  return fetchIsLoading ? null : (
    <>
      <div>
        <StyledContainer>
          <StyledH1>Videos</StyledH1>
          <div>
            <ul>
              {videos.map(video => (
                <li key={video.id}>
                  <Link to={`/videos/${video.short_title}`}>
                    {video.unit_index}
                    {video.section_index}
                    {video.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </StyledContainer>
      </div>
      {currentVideo && <VideosCard video={currentVideo} />}
    </>
  );
};

VideosContainer.propTypes = {
  match: object.isRequired
};

export default VideosContainer;
