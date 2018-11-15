import React from 'react';

import { blockLoaderContainer } from './styles';

const Loader = () => {
  return (
    <div className={blockLoaderContainer}>
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

export default Loader;