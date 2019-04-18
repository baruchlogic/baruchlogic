import React, { Component } from 'react';
// import { getVideos } from '../db';

class VideosContainer extends Component {
  async componentDidMount() {
    console.log('GET VIDEOS');
    // const videos = await fetch('http://localhost:5000/api/videos');
    console.log('videos', videos);
  }

  render() {
    return <div>Videos</div>;
  }
}

export default VideosContainer;
