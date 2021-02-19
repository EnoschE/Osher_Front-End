import React from 'react';
import { Link } from 'react-router-dom';
import Clock from 'react-live-clock';

const Footer = (props) => {
  const {
    handleNap,
    backAddress,
    mutePage,
    handleVolumeUp,
    handleVolumeDown,
    visibleBack,
    user,
  } = props;

  return (
    <div className='footer'>
      <Link to='/'>
        <img className='pc-only logo' src='/img/logo2.png' alt='OSHER' />
      </Link>

      <div className='pc-only'>
        <div className='clock-date-block'>
          <div className='clock-block'>
            <Clock
              format={'h:mm'}
              ticking={true}
              timezone={'America/Toronto'}
            />
          </div>
          <div className='date-block'>
            <Clock format={'ddd'} timezone={'America/Toronto'} />
            <Clock format={'DD MMM'} timezone={'America/Toronto'} />
          </div>
        </div>
      </div>

      <audio className='audio-element'>
        <source src='/img/audio.mp3'></source>
      </audio>

      <div className='footer-icons'>
        {visibleBack && (
          <div className='icon-block' onClick={() => backAddress()}>
            <i className='fas fa-angle-double-left'></i>
            <p>Back</p>
          </div>
        )}

        {/* <div className='icon-block'>
          <i className='fas fa-language'></i>
          <p>Language</p>
        </div> */}

        <div className='icon-block' onClick={mutePage}>
          <i className='fas fa-volume-mute'></i>
          <p>Mute</p>
        </div>

        <div className='icon-block' onClick={handleVolumeDown}>
          <i className='fas fa-volume-down'></i>
          <p>Down</p>
        </div>

        <div className='icon-block' onClick={handleVolumeUp}>
          <i className='fas fa-volume-up'></i>
          <p>Up</p>
        </div>

        {/* <div className='icon-block'>
          <i className='fas fa-sun'></i>
          <p>Brightness</p>
        </div> */}

        <div className='icon-block' onClick={handleNap}>
          <i className='far fa-moon'></i>
          <p>Nap</p>
        </div>

        {((user && !user.isAdmin) && (user && !user.isBrand)) && (
          <Link to='/profile'>
            <div className='icon-block'>
              <i className='far fa-user-tie'></i>
              <p>Driver</p>
            </div>
          </Link>
        )}

        {((user && user.isAdmin) || (user && user.isBrand)) && (
          <Link to='/dashboard'>
            <div className='icon-block'>
              <i className='far fa-th'></i>
              <p>Dashboard</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Footer;
