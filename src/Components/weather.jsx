import React, { useEffect } from 'react';

const Weather = ({ handleBack }) => {
  useEffect(() => {
    handleBack(true);
  }, [handleBack]);

  return (
    <div className='main-background'>
      <div className='weather-pag'>
        <h1>Weather</h1>
      </div>
    </div>
  );
};

export default Weather;
