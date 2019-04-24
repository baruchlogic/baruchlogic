import React, { Component } from 'react';

class VideosContainer extends Component {
  async componentDidMount() {
    console.log('GET VIDEOS');
    // NOTE: The first instance of getting data ftom the API
    // TODO: Use the libraries/wrappers
    const videos = await fetch('http://localhost:5000/api/videos').then(res =>
      res.json()
    );
    console.log('videos', videos.rows);
  }

  render() {
    return <div>Videos</div>;
  }
}

export default VideosContainer;
