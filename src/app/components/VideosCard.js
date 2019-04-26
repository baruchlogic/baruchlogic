import React from 'react';
import { Card } from '@blueprintjs/core';
import { shape, string } from 'prop-types';

const VideosCard = ({ video }) => {
  return video.id !== undefined ? (
    <div>
      <h1>{video.title}</h1>
      <Card>
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
      </Card>
    </div>
  ) : null;
};

VideosCard.propTypes = {
  video: shape({
    title: string, // The title of the current video
    url: string // The URL of the current video
  })
};

export default VideosCard;
