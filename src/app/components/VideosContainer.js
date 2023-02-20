import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { useColumnView } from 'hooks';

import StyledSidebar from 'app-styled/StyledSidebar';
import VideosCard from './VideosCard';
import { ApiBaseUrl } from '../constants';

const VideosContainer = ({
  match: {
    params: { short_title: currentShortTitle }
  }
}) => {
  const [videos, setVideos] = useState([]);
  const [groupedVideos, setGroupdVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const isColumnView = useColumnView();

  const groupVideos = videos => {
    const result = [];
    for (const video of videos) {
      const { index_in_section: indexInSection, section, unit } = video;
      if (!result[unit - 1]) {
        result[unit - 1] = [];
      }
      if (!result[unit - 1][section - 1]) {
        result[unit - 1][section - 1] = [];
      }
      result[unit - 1][section - 1][indexInSection - 1] = video;
    }
    return result;
  };

  const mapVideoToJSX = video => (
    <li key={video.id}>
      <Link to={`/videos/${video.short_title}`}>
        <div>
          <span className="numbering">
            {video.section}.{video.index_in_section}
          </span>
        </div>
        <div>{video.title}</div>
      </Link>
    </li>
  );

  useEffect(() => {
    const fetchVideos = async () => {
      // console.log('ApiBaseUrl', ApiBaseUrl);
      const response = await fetch(`${ApiBaseUrl}/api/videos`).then(res =>
        res.json()
      );
      const videos = response;
      const groupedVideos = groupVideos(videos);
      setVideos(videos);
      setGroupdVideos(groupedVideos);
      setFetchIsLoading(false);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const getCurrentVideo = () => {
      const currentVideo = videos.find(
        video => video.short_title === currentShortTitle
      );
      setCurrentVideo(currentVideo);
    };

    getCurrentVideo();
  }, [currentShortTitle, videos]);

  return fetchIsLoading ? null : (
    <div
      style={{
        display: 'flex',
        flexDirection: isColumnView ? 'column' : 'row'
      }}
    >
      <StyledSidebar column={isColumnView}>
        <H1>videos</H1>
        <ul>
          {groupedVideos.map((unit, unitIndex) => (
            <div key={unitIndex}>
              <h2>Unit {unitIndex + 1}</h2>
              <>
                {unit.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h3>Section {sectionIndex + 1}</h3>
                    <>{section.map(mapVideoToJSX)}</>
                  </div>
                ))}
              </>
            </div>
          ))}
        </ul>
      </StyledSidebar>
      {currentVideo && (
        <VideosCard video={currentVideo} column={isColumnView} />
      )}
    </div>
  );
};

VideosContainer.propTypes = {
  match: object.isRequired
};

VideosContainer.defaultProps = {
  match: { params: { short_title: '' } }
};

export default VideosContainer;
