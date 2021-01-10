import React from 'react';
import Slider from 'react-slick';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const CouponLeftBlock = ({ brand }) => {
  return (
    <>
      <Slider {...settings}>
        {brand.img.map((b) => (
          <div className='coupon-page-carousel' key={b}>
            <img src={b} alt='Brand' />
          </div>
        ))}
      </Slider>

      <div className='coupon-details'>
        <h3>About this deal</h3>
        <p>{brand.details}</p>

        <h3>Need to know</h3>
        <p>{brand.description}</p>
      </div>
    </>
  );
};

export default CouponLeftBlock;
