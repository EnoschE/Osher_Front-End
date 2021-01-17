import React from 'react';
import RadioInput from './common/radioInput';
import moment from 'moment';

const CouponRightBlock = ({
  data,
  currentOffer,
  radioFunction,
  handleCoupon,
  expiry
}) => {
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

      <button className='get-coupon orange-btn' onClick={handleCoupon}>
        Get this coupon
      </button>

      <div className='choose-expiry-date'>
        <div className='linee'></div>
        <h3>
          <span>Expires on: </span>
          {moment(expiry).format('ll')}
        </h3>
      </div>
    </div>
  );
};

export default CouponRightBlock;
