import React, { useState, useEffect } from 'react';
import RadioInput from './common/radioInput';
import moment from 'moment';

const CouponRightBlock = ({
  data,
  currentOffer,
  radioFunction,
  handleCoupon,
  expiry,
}) => {
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    var countDownDate = new Date(expiry).getTime();

    setInterval(() => {
      var now = new Date().getTime();
      var timeleft = countDownDate - now;

      if (timeleft < 0) {
        setExpired(true);
      }

      setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
      setHours(
        Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      setMinutes(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((timeleft % (1000 * 60)) / 1000));
    }, 1000);
  }, [expiry]);

  return (
    <div className='coupon-right-block'>
      {data.map((o) => (
        <RadioInput
          key={o.price}
          order={o}
          currentOffer={currentOffer}
          handleChange={radioFunction}
        />
      ))}

      <button
        disabled={new Date() - new Date(expiry) > 0}
        className='get-coupon orange-btn'
        onClick={handleCoupon}
      >
        Get this coupon
      </button>

      <div className='choose-expiry-date'>
        <div className='linee'></div>
        <h3>
          <span>Expiry: </span>
          {moment(expiry).format('ll')}
        </h3>
        <div className='expiry-countdown'>
          <span>Expire in: </span>
          {expired ? (
            <p>EXPIRED!!</p>
          ) : (
            <>
              <p>{days}d </p>
              <p>{hours}h </p>
              <p>{minutes}m </p>
              <p>{seconds}s </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponRightBlock;
