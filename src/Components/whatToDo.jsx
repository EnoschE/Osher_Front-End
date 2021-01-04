import React, { useEffect, useState } from 'react';
import BrandCard from './brandCard';
import ThemeCategory from './themeCategory';
import categories from '../services/categories';
import { getProducts } from '../services/productService';
import Loader from './loader';

const WhatToDo = ({ handleBack, history }) => {
  const [currentCategory, setCurrentCategory] = useState('');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  let delay = 0;

  const getAllProducts = async () => {
    const { data } = await getProducts();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    handleBack(history.goBack);
    getAllProducts();
  }, [handleBack, history]);

  const handleCategory = (cate) => {
    setCurrentCategory(cate);
  };

  const filteredBrands = () => {
    let filtered = brands;

    if (currentCategory !== 'All' && currentCategory !== '') {
      filtered = brands.filter((b) => b.category === currentCategory);
    }

    return filtered;
  };

  return (
    <div className='main-background'>
      <div className='whattodo-page'>
        <h1 className='whattodo-heading'>What to Do</h1>

        <div className='theme-categories'>
          {categories.map((c) => (
            <ThemeCategory
              category={c}
              current={currentCategory}
              setCategory={handleCategory}
            />
          ))}
        </div>

        <div className='brandcards row'>
          {/* <BrandCard
            brand={{
              name: 'McDonalds',
              price: '245',
              img: '/img/img1.jpg',
              category: 'Food',
            }}
            delay={(delay += 0.1)}
          /> */}
          {loading ? (
            <Loader />
          ) : filteredBrands().length > 0 ? (
            filteredBrands().map((b) => (
              <BrandCard brand={b} delay={(delay += 0.1)} />
            ))
          ) : (
            <div className='no-result'>
              <h2 className='no-result'>No result found!</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatToDo;
