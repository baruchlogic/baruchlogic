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

const ProblemsetsContainer = ({
  match: {
    params: { problemset_id: problemsetId }
  }
}) => {
  const [problemsets, setProblemsets] = useState([]);
  const [groupedProblemsets, setGroupedProblemsets] = useState([]);
  const [currentProblemset, setCurrentProblemset] = useState(null);
  const [fetchIsLoading, setFetchIsLoading] = useState(true);

  const fetchProblemSets = async () => {
    const response = await fetch('http://localhost:5000/api/problemsets').then(
      res => res.json()
    );
    setFetchIsLoading(false);
    const problemsets = response;
    setProblemsets(problemsets);
  };

  // const getCurrentVideo = () => {
  //   const currentVideo = videos.find(
  //     video => video.short_title === currentShortTitle
  //   );
  //   setCurrentVideo(currentVideo);
  // };

  // const groupVideos = videos => {
  //   const result = [];
  //   for (const video of videos) {
  //     const { index_in_section: indexInSection, section, unit } = video;
  //     if (!result[unit - 1]) {
  //       result[unit - 1] = [];
  //     }
  //     if (!result[unit - 1][section - 1]) {
  //       result[unit - 1][section - 1] = [];
  //     }
  //     result[unit - 1][section - 1][indexInSection - 1] = video;
  //   }
  //   return result;
  // };

  // const mapVideoToJSX = video => (
  //   <li key={video.id}>
  //     <Link to={`/videos/${video.short_title}`}>
  //       <div>
  //         <span className="numbering">
  //           {video.section}.{video.index_in_section}
  //         </span>
  //       </div>
  //       <div>{video.title}</div>
  //     </Link>
  //   </li>
  // );

  useEffect(() => {
    fetchProblemSets();
  }, []);

  // useEffect(() => {
  //   getCurrentVideo();
  //   fetchProblemSets();
  // });

  const mapProblemSetToJSX = problemset => (
    <li key={problemset.id}>
      <Link to={`/problemsets/${problemset.id}`}>
        <div>
          <span className="numbering">
            Homework #{problemset.index_in_unit}
          </span>
        </div>
      </Link>
    </li>
  );

  return fetchIsLoading ? null : (
    <>
      <StyledContainer>
        <StyledSidebar>
          <H1>problemsets</H1>
          <ul>
            {problemsets.map(mapProblemSetToJSX)}
          </ul>
        </StyledSidebar>
      </StyledContainer>
    </>
  );
};

ProblemsetsContainer.propTypes = {
  match: object.isRequired
};

export default ProblemsetsContainer;
