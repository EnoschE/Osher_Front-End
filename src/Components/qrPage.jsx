import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const QrPage = ({ handleBack }) => {
  useEffect(() => {
    handleBack('');
  }, [handleBack]);

  return (
    <div className='main-background'>
      <div className='qr-page'>
        <img src='/img/qr.png' alt='QR' className='qr-code' />
        <Link to='/main'>
          <button>Continue</button>
        </Link>
        {/* <audio src='/img/audio.mp3' controls autoPlay /> */}
      </div>
    </div>
  );
};

export default QrPage;
