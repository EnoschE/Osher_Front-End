import React, { Component } from 'react';
import { getProduct, getProducts } from '../services/productService';
import CouponRightBlock from './couponRightBlock';
import RelatedBrands from './relatedBrands';
import CouponLeftBlock from './couponLeftBlock';
import Loader from './loader';

class CouponPage extends Component {
  state = { brand: {}, brands: [], loading: true, offer: '' };

  populateProducts = async () => {
    try {
      const { id } = this.props.match.params;
      const { data: brand } = await getProduct(id);
      const { data } = await getProducts();

      const brands = data.filter(
        (d) => d.category === brand.category && d._id !== id
      );

      const offer = brand.offers[0].price;
      
      this.setState({ brand, brands, offer, loading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    await this.populateProducts();
  }

  async componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;

    if (id !== prevProps.match.params.id) {
      window.scrollTo(0, 0);
      this.setState({ loading: true });
      await this.populateProducts();
    }
  }

  render() {
    const { brand, brands, loading, offer } = this.state;
    let delay = 0;

    return (
      <div>
        {loading ? (
          <Loader />
        ) : (
          <div className='coupon-page'>
            <div className='container'>
              <h1 className='brand-name'>{brand.name}</h1>
              <div className='brand-category'>
                <div>{brand.category}</div>
              </div>

              <div className='row'>
                <div className='col-sm-8'>
                  <CouponLeftBlock brand={brand} />
                </div>

                <div className='col-sm-4'>
                  <CouponRightBlock
                    data={brand.offers}
                    currentOffer={offer}
                    radioFunction={this.handleChange}
                  />
                </div>
              </div>

              <RelatedBrands loading={loading} brands={brands} delay={delay} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CouponPage;
