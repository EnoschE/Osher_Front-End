import React from 'react';
import { Link } from 'react-router-dom';

const Footer = (props) => {
  const { handleNap, backAddress, mutePage, handleVolumeUp , handleVolumeDown} = props;

  return (
    <div className='footer'>
      <Link to='/'>
        <h1 className='pc-only'>Osher</h1>
      </Link>
      <audio className='audio-element'>
        <source src='/img/audio.mp3'></source>
        {/* <source src='https://assets.coderrocketfuel.com/pomodoro-times-up.mp3'></source> */}
      </audio>

      <div className='footer-icons'>
        {backAddress && (
          <div className='icon-block' onClick={() => backAddress()}>
            <i className='fas fa-angle-double-left'></i>
            <p>Back</p>
          </div>
        )}

        <div className='icon-block'>
          <i className='fas fa-language'></i>
          <p>Language</p>
        </div>

        <div className='icon-block' onClick={mutePage}>
          <i className='fas fa-volume-mute'></i>
          <p>Mute</p>
        </div>

        <div className='icon-block' onClick={ handleVolumeDown}>
          <i className='fas fa-volume-down'></i>
          <p>Down</p>
        </div>

        <div className='icon-block' onClick={handleVolumeUp}>
          <i className='fas fa-volume-up'></i>
          <p>Up</p>
        </div>

        <div className='icon-block'>
          <i className='fas fa-sun'></i>
          <p>Brightness</p>
        </div>

        <div className='icon-block' onClick={handleNap}>
          <i className='far fa-moon'></i>
          <p>Nap</p>
        </div>

        <Link to='/profile'>
          <div className='icon-block'>
            <i className='far fa-user-tie'></i>
            <p>Profile</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
