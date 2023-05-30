import React from 'react';
import Tilt from 'react-parallax-tilt';

import './logo.styles.css';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 35, scale: 1.05 }}
        style={{ height: 150, width: 150 }}
      >
        <div className="Tilt-inner">
          <img className="logo-image" alt="logo" src={brain} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
