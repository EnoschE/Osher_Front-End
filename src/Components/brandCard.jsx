import React from 'react';
import { Link } from 'react-router-dom';
// import { Lazy } from 'rrr-lazy';
import Slider from 'react-slick';

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

      <Link to={`/whattodo/brand/${brand._id}`}>
        <Slider {...settings}>
          {brand.img.map((b) => (
            <div className='brand-carousel' key={b}>
              <img src={b} alt='Brand' />
            </div>
          ))}
        </Slider>

        {/* <div
        className='brand-img'
        style={{
          backgroundImage: 'url(' + brand.img + ')',
        }}
      ></div> */}
        <h2 className='brand-title'>{brand.name}</h2>
        <h3 className='brand-price'>${brand.offers[0].price}</h3>
        <div className='brand-category'>
          <div>{brand.category}</div>
        </div>
      </Link>
    </div>
  );
};

export default BrandCard;
