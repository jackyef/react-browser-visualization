import React from 'react';

import { loaderContainer } from './styles';

const LoaderFullscreen = () => {
  return (
    <div className={loaderContainer}>
      <div>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
};

export default LoaderFullscreen;