import React from 'react';
import styled from 'styled-components';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import { shape, string } from 'prop-types';

const StyledContainer = styled.div`
  margin: 1rem;
  overflow: scroll;
  text-align: center;
  width: 100%;
`;

const StyledH1 = styled.h1`
  margin: 0 0 1rem 0;
`;

const StyledStyledCard = styled(StyledCard)`
  min-width: 600px;
`;

const VideosCard = ({ video }) => {
  return video.id !== undefined ? (
    <StyledContainer>
      <StyledStyledCard elevation={Elevation.THREE}>
        <StyledH1>{video.title}</StyledH1>
        <iframe
          title={video.title}
          width="560"
          height="315"
          src={video.url}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media;
                 gyroscope; picture-in-picture"
          allowFullScreen
        />
      </StyledStyledCard>
    </StyledContainer>
  ) : null;
};

VideosCard.propTypes = {
  video: shape({
    title: string, // The title of the current video
    url: string // The URL of the current video
  })
};

export default VideosCard;
