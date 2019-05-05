import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';

import StyledSidebar from 'app-styled/StyledSidebar';
import VideosCard from './VideosCard';

const StyledContainer = styled.div`
  display: flex;
`;

const VideosContainer = ({
  match: {
    params: { short_title: currentShortTitle }
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

  // TODO: Call this from `fetchVideos`;
  useEffect(() => {
    getCurrentVideo();
  });

  return fetchIsLoading ? null : (
    <>
      <StyledContainer>
        <StyledSidebar>
          <H1>videos</H1>
          <ul>
            {videos.map(video => (
              <li key={video.id}>
                <Link to={`/videos/${video.short_title}`}>
                  <div>
                    <span className="numbering">
                      {video.unit_index}.{video.section_index}
                    </span>
                  </div>
                  <div>{video.title}</div>
                </Link>
              </li>
            ))}
          </ul>
        </StyledSidebar>
        {currentVideo && <VideosCard video={currentVideo} />}
      </StyledContainer>
    </>
  );
};

VideosContainer.propTypes = {
  match: object.isRequired
};

export default VideosContainer;
