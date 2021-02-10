import React from 'react';

const Nap = ({ handleNap }) => {
  return (
    <div className='nap'>
      <h2>This screen will disappear after 5 minutes!</h2>
      <button onClick={handleNap}>X</button>
    </div>
  );
};

export default Nap;
