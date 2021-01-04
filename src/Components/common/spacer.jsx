import React from 'react';

const Spacer = (size) => {
  let height =
    size === 'small' ? '100px' : size === 'medium' ? '10px' : '300px';

  return <div style={{ height: height, width: '100%' }}></div>;
};

export default Spacer;
