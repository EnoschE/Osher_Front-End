import React from 'react';

const Nap = ({ handleNap }) => {
  return (
    <div className='nap'>
      <h2>This screen will disappear after 2 seconds!</h2>
      <button onClick={handleNap}>X</button>
    </div>
  );
};

export default Nap;
