import React, { Component } from 'react';
import { getProduct, getProducts } from '../services/productService';
import Joi from 'joi-browser';
import CouponRightBlock from './couponRightBlock';
import RelatedBrands from './relatedBrands';
import CouponLeftBlock from './couponLeftBlock';
import Loader from './loader';
import Input from './common/input';
import { getUsers } from '../services/userService';
import * as customerService from '../services/customerService';
import * as orderService from '../services/orderService';

class CouponPage extends Component {
  state = {
    brand: {},
    brands: [],
    loading: true,
    offer: '',
    emailModal: false,
    displayModal: false,
    currentModal: 'email',
    oldCust: false,
    isProcessing: false,
    agreesToReceive: false,
    userInfo: {
      email: '',
      name: '',
      phone: '',
    },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label('Email'),
    name: Joi.string().required().label('Full Name'),
    phone: Joi.string().required().label('Phone'),
  };

  populateProducts = async () => {
    try {
      const { id } = this.props.match.params;
      const { data: brand } = await getProduct(id);
      let { data } = await getProducts();
      const { data: userz } = await getUsers();
      this.setState({ userz: userz });



      var activeBundles = [];

      for (var i = 0; i < data.length; i++) {
        var currentBrand = {};
  
        for (var j = 0; j < userz.length; j++) {
          if (userz[j]._id === data[i].brandId) currentBrand = userz[j];
        }
  
        if (currentBrand.isActive) {
          if (new Date() - new Date(data[i].expiryDate) < 0)
            activeBundles.push(data[i]);
  
          currentBrand = {};
        }
      } 
  
      data = activeBundles;

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

  handleCheckBox = ({ target }) => {
    this.setState({ agreesToReceive: target.checked });
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleInput = ({ currentTarget }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(currentTarget);
    if (errorMessage) errors[currentTarget.name] = errorMessage;
    else delete errors[currentTarget.name];

    const userInfo = { ...this.state.userInfo };
    userInfo[currentTarget.name] = currentTarget.value;

    this.setState({ userInfo, errors });
  };

  handleCoupon = () => {
    this.setState({ emailModal: true, displayModal: true });
  };

  hideModal = () => {
    this.setState({
      emailModal: false,
      currentModal: 'email',
      userInfo: { name: '', email: '', phone: '' },
    });
    setTimeout(() => {
      this.setState({ displayModal: false });
    }, 600);
  };

  handleEmail = async () => {
    try {
      const { userInfo } = this.state;

      const response = await customerService.register(userInfo);

      if (response.data.isOld) {
        this.setState({ oldCust: true });

        this.setState({ userInfo: response.data.oldCustomer });

        const userInfo = { ...this.state.userInfo };

        if (response.data.oldCustomer.name === '-') userInfo.name = '';
        if (response.data.oldCustomer.phone === '-') userInfo.phone = '';

        this.props.handleNotification({
          message: `Welcome back,  ${
            userInfo.name ? userInfo.name : userInfo.email
          }!`,
          // img: user.profilePic,
        });

        this.setState({ userInfo });
      } else {
        this.setState({ userInfo: response.data });

        const userInfo = { ...this.state.userInfo };

        if (response.data.name === '-') userInfo.name = '';
        if (response.data.phone === '-') userInfo.phone = '';

        this.setState({ userInfo });
      }

      this.setState({ currentModal: 'name' });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  handleName = async () => {
    try {
      const userInfo = { ...this.state.userInfo };

      if (userInfo.phone === '') userInfo.phone = '-';

      await customerService.updateCustomer(userInfo);

      this.setState({ currentModal: 'phone' });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  handlePhone = async () => {
    try {
      this.setState({ isProcessing: true });
      const userInfo = { ...this.state.userInfo };
      const { brand, offer } = this.state;

      await customerService.updateCustomer(userInfo);

      const brandOffer = brand.offers.filter((o) => o.price === offer);

      const order = {
        userId: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        brandId: brand.brandId,
        bundleName: brand.name,
        bundleId: brand._id,
        brandCategory: brand.category,
        offerPrice: offer,
        offerDetail: brandOffer[0].offerDetails,
        expiryDate: brand.expiryDate,
        branches: brand.branches,
        coupon: '',
        orderStatus: 'Active',
      };

      const res = await orderService.saveOrder(order);
      this.setState({ coupon: res.data.coupon });

      const newOrder = { ...order };
      newOrder.coupon = res.data.coupon;

      await orderService.sendCoupon(newOrder);
      // this.hideModal();

      this.props.handleNotification({
        message: `Coupon sent to your email!`,
        img: '/img/success.png',
      });

      this.setState({ currentModal: 'coupon' });
    } catch (ex) {
      if (
        (ex.response && ex.response.status === 400) ||
        (ex.response && ex.response.status === 403)
      ) {
        this.setState({ isProcessing: false });
        const errors = { ...this.state.errors };
        errors.phone = ex.response.data;
        this.setState({ errors });
      }
    }
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
    const {
      brand,
      brands,
      loading,
      offer,
      userInfo,
      emailModal,
      displayModal,
      currentModal,
      errors,
      coupon,
      agreesToReceive,
      isProcessing,
    } = this.state;
    let delay = 0;

    return (
      <>
        {displayModal && (
          <div className={emailModal ? 'info-page' : 'info-page hide-modal-bg'}>
            <div
              className={emailModal ? 'getuserinfo' : 'getuserinfo hide-modal'}
            >
              {currentModal !== 'coupon' && (
                <button className='modal-hide-btn' onClick={this.hideModal}>
                  X
                </button>
              )}

              {currentModal === 'email' && (
                <div className='modal-animation'>
                  <h3>Enter your email to recieve this coupon</h3>
                  <Input
                    type='text'
                    placeholder='Email'
                    name='email'
                    value={userInfo.email}
                    onChange={this.handleInput}
                    error={errors.email}
                  />
                  <button
                    className='modal-continue-btn'
                    onClick={this.handleEmail}
                    disabled={!userInfo.email}
                  >
                    Continue
                  </button>
                </div>
              )}

              {currentModal === 'name' && (
                <div className='modal-animation'>
                  <h3>Enter your full name</h3>
                  <Input
                    type='text'
                    placeholder='Full name'
                    name='name'
                    value={userInfo.name}
                    onChange={this.handleInput}
                    error={errors.name}
                  />
                  <button
                    className='modal-continue-btn'
                    onClick={this.handleName}
                    disabled={!userInfo.name}
                  >
                    Continue
                  </button>
                  <div className='modal-back-btn'>
                    <p onClick={() => this.setState({ currentModal: 'email' })}>
                      Back
                    </p>
                  </div>
                </div>
              )}

              {currentModal === 'phone' && (
                <div className='modal-animation'>
                  <h3>Enter your phone number</h3>
                  <Input
                    type='text'
                    placeholder='Phone number'
                    name='phone'
                    value={userInfo.phone}
                    onChange={this.handleInput}
                    error={errors.phone}
                  />
                  <div>
                    <div className='form-check modal-checkbox'>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        id='exampleCheck1'
                        checked={agreesToReceive}
                        onChange={this.handleCheckBox}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='exampleCheck1'
                      >
                        I agree to receive coupons and promotions on my email.
                      </label>
                    </div>
                  </div>
                  <button
                    className='modal-continue-btn continue-to-shipping'
                    onClick={this.handlePhone}
                    disabled={
                      !userInfo.phone || !agreesToReceive || isProcessing
                    }
                  >
                    {!isProcessing ? (
                      'Receive Coupon'
                    ) : (
                      <span>
                        Processing... <i className='fas fa-circle-notch'></i>
                      </span>
                    )}
                  </button>
                  <div className='modal-back-btn'>
                    <p onClick={() => this.setState({ currentModal: 'name' })}>
                      Back
                    </p>
                  </div>
                </div>
              )}

              {currentModal === 'coupon' && (
                <div className='modal-animation'>
                  <h1>Congratulations!</h1>
                  <h4>Your coupon is</h4>

                  <div className='coupon-box'>
                    <h1>{coupon}</h1>
                  </div>

                  <button
                    className='modal-continue-btn'
                    onClick={() => this.props.history.push('/')}
                    disabled={!userInfo.phone}
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
                      expiry={brand.expiryDate}
                      data={brand.offers}
                      currentOffer={offer}
                      radioFunction={this.handleChange}
                      handleCoupon={this.handleCoupon}
                    />
                  </div>
                </div>

                <RelatedBrands
                  loading={loading}
                  bundles={brands}
                  brands={this.state.userz}
                  delay={delay}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default CouponPage;
