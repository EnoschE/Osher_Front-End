import React from 'react';
import Loader from './loader';
import BrandCard from './brandCard';

const RelatedBrands = ({ loading, brands, delay }) => {
  return (
    <>
      {loading ? (
        <Loader />
      ) : brands.length > 0 ? (
        <div className='related-brands'>
          <div className='linee'></div>
          <h2 className='related-h2'>Related Brands</h2>

          <div className='row'>
            {brands.map((b) => (
              <BrandCard key={b._id} brand={b} delay={(delay += 0.1)} />
            ))}
            {/* : (
          <div className='no-result'>
            <h2 className='no-result'>No related brands found!</h2>
          </div>
        )} */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RelatedBrands;