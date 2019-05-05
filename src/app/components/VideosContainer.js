import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';

import VideosCard from './VideosCard';

// #3a3a8f, #2bb055, #394b59, #2ed41c, #10559f
const StyledContainer = styled.div`
  box-shadow: 1px 1px 2px 1px #2d0f4c;
  color: #2d0f4c;
  height: 1000px;
  text-align: center;
  width: 300px;
`;

const StyledH1 = styled(H1)`
  color: #2d0f4c !important;
  padding-top: 1rem !important;
`;

const StyledSpan = styled.span`
  margin-right: 1rem;
`;

const StyledListItem = styled.li`
  list-style: none;
  text-align: left;
  &:hover {
    list-style: initial;
    color: #669eff !important;
  }
`;

const StyledLink = styled(Link)`
  color: #2d0f4c;
  display: flex;
  margin: 0.25rem 0;
  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const StyledUL = styled.ul`
  font-size: 1.2rem;
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
      <div>
        <StyledContainer>
          <StyledH1>videos</StyledH1>
          <div>
            <StyledUL>
              {videos.map(video => (
                <StyledListItem key={video.id}>
                  <StyledLink to={`/videos/${video.short_title}`}>
                    <div>
                      <StyledSpan>
                        {video.unit_index}.{video.section_index}
                      </StyledSpan>
                    </div>
                    <div>{video.title}</div>
                  </StyledLink>
                </StyledListItem>
              ))}
            </StyledUL>
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
