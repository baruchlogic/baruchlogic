import React from 'react';
import { Card } from '@blueprintjs/core';
import { shape, string } from 'prop-types';

const VideosCard = ({ video }) => {
  return video.id ? (
    <div>
      <h1>{video.title}</h1>
      <Card>
        <iframe
          width="560"
          height="315"
          title={video.title}
          src={video.url}
          frameBorder="0"
          allow="encrypted-media"
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
