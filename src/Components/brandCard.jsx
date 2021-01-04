import React from 'react';
// import { Lazy } from 'rrr-lazy';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {

  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const BrandCard = ({ delay, brand }) => {
  return (
    <div
      style={{ animationDelay: `${(delay += 0.1)}s` }}
      className='brandcard col-sm-4'
    >
      {/* <Lazy
        rootMargin='300px 0 300px 0'
        render={(status) => {
          if (status === 'unload') {
            return (
              <div
                className='brand-img'
                style={{
                  backgroundImage: 'url(/img/tiny.jpg)',
                }}
              ></div>
            );
          }
          if (status === 'loading') {
            return (
              <div
                className='brand-img'
                style={{
                  backgroundImage: 'url(/img/tiny.jpg)',
                }}
              ></div>
            );
          }
          if (status === 'loaded') {
            return (
              <div
                className='brand-img'
                style={{
                  backgroundImage:
                    'url(' +
                    (status === 'loaded' ? brand.img : '/img/tiny.jpg') +
                    ')',
                }}
              ></div>
            );
          }
          throw new Error('Unknown status');
        }}
      /> */}

      <Slider {...settings}>
        <div className='brand-carousel'>
          <img src={brand.img} alt='Brand' />
        </div>
        <div className='brand-carousel'>
          <img src='/img/img3.jpg' alt='Brand' />
        </div>
        <div className='brand-carousel'>
          <img src='/img/img5.jpg' alt='Brand' />
        </div>
      </Slider>

      {/* <div
        className='brand-img'
        style={{
          backgroundImage: 'url(' + brand.img + ')',
        }}
      ></div> */}
      <h2 className='brand-title'>{brand.name}</h2>
      <h3 className='brand-price'>{brand.price}$</h3>
      <div className='brand-category'>
        <div>{brand.category}</div>
      </div>
    </div>
  );
};

export default BrandCard;
