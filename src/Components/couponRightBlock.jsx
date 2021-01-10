import React from 'react';
import RadioInput from './common/radioInput';

const CouponRightBlock = ({
  data,
  currentOffer,
  radioFunction,
  handleCoupon,
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
    </div>
  );
};

export default CouponRightBlock;
