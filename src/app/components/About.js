import React from 'react';
import { Divider, Elevation } from '@blueprintjs/core';

import StyledCard from 'app-styled/StyledCard';
import { ADMIN_EMAIL } from 'constants';

const About = () => (
  <StyledCard elevation={Elevation.THREE}>
    <p>
      This is the course website for PHI 1600 at Baruch College, CUNY. The
      curriculum for this course was developed by Profs. Eric Mandelbaum and
      Jesse Rappaport.
    </p>

    <p>
      Registration on this website is currently restricted to Baruch students
      who are enrolled in this course.
    </p>

    <br />
    <Divider />
    <br />

    <p>
      <a
        rel="license noopener noreferrer"
        href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >
        <img
          alt="Creative Commons License"
          src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
        />
      </a>
      <br />
      This work is licensed under a{' '}
      <a
        rel="license noopener noreferrer"
        href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >
        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
        License
      </a>
      .
    </p>

    <p>
      Please report any problems with this application to{' '}
      <a href={`mailto:${ADMIN_EMAIL}`}>
        <b>baruchlogic@gmail.com</b>
      </a>
    </p>

    {/**
      * TODO: Uncomment this when the repo has been pushed.
      <p>If you wish to contribute to this project, visit us on
        <a href="https://www.github.com/baruchlogic">GitHub!</a>
      </p>
      */}
  </StyledCard>
);

export default About;
