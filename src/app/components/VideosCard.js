import React from 'react';
import styled from 'styled-components';
import StyledCard from 'app-styled/StyledCard';
import { Elevation } from '@blueprintjs/core';
import { bool, shape, string } from 'prop-types';

const StyledContainer = styled.div`
  margin: ${props => (props.column ? '0px' : '1rem')};
  overflow: scroll;
  text-align: center;
  width: 100%;
`;

const StyledH1 = styled.h1`
  margin: 0 0 1rem 0;
  font-size: ${props => (props.column ? '32px' : '48px')};
`;

const StyledStyledCard = styled(StyledCard)`
  min-width: 600px;
`;

const VideosCard = ({ column, video }) =>
  video.id !== undefined ? (
    <StyledContainer column={column}>
      <StyledStyledCard elevation={Elevation.THREE}>
        <StyledH1 column={column}>{video.title}</StyledH1>
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

VideosCard.propTypes = {
  column: bool,
  video: shape({
    title: string, // The title of the current video
    url: string // The URL of the current video
  })
};

export default VideosCard;
