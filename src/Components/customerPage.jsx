import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import moment from 'moment';
import Loader from './loader';
import { getCustomer } from '../services/customerService';
import auth from '../services/authService';

class CustomerPage extends Component {
  state = {
    currentUser: '',
    loading: true,
    orders: [],
    user: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('customers');

    await this.populateUserDetails();
  }

  populateUserDetails = async () => {
    try {
      const userId = this.props.match.params.id;

      const currentUser = auth.getCurrentUser();
      this.setState({ currentUser });

      let { data: orders } = await getOrders();
      const { data: user } = await getCustomer(userId);

      orders = orders.filter((o) => o.userId === user._id);
      if (!currentUser.isAdmin) {
        orders = orders.filter((o) => o.brandId === currentUser._id);
      }

      this.setState({
        orders,
        user: this.mapToViewUser(user),
        loading: false,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  };

  mapToViewUser(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      // password: user.password,
      // profilePic: user.profilePic || '',
      // address: user.address || '',
      // city: user.city || '',
      // country: user.country || '',
      // postalCode: user.postalCode || '',
      // //   theme: user.theme,
    };
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { user, loading, orders } = this.state;

    if (loading) return <Loader />;

    return (
      <div className='order-page'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <br />
              <div className='row ' style={{ width: '100%' }}>
                <div className='col-md-3'>
                  <Link to='/dashboard/customers/'>
                    <button className='back-btn'>
                      <i className='fas fa-angle-double-left'></i> Back
                    </button>
                  </Link>
                </div>

                <div className='col-md-6 p-2'>
                  <div
                    className='profile-right-block dashboard-left-block'
                    style={{ animationDelay: '0.3s', marginBottom: '20px' }}
                  >
                    <br />
                    <div className='customer-pic-circle'>
                      <h4>{user.name.charAt(0)}</h4>
                    </div>

                    <div className='profile-left-text'>
                      <h2>
                        <b>{user.name}</b>
                      </h2>

                      <br />
                      <p>
                        Phone: <a href={'tel:' + user.phone}>{user.phone}</a>
                      </p>
                      <p>
                        Email: <a href={'mailto:' + user.email}>{user.email}</a>
                      </p>
                      <p>Joined: {moment(user.publishDate).format('lll')}</p>
                      {/* <p>Address: {user.address}</p>
                      <p>City: {user.city}</p>
                      <p>Country: {user.country}</p> */}
                      <br />
                    </div>
                  </div>
                </div>
                <div className='col-md-3'></div>
              </div>
              <h5>Recent orders ({orders.length})</h5>
              <br />
              <table className=' orders-table'>
                <thead>
                  <tr>
                    <th>Coupon</th>
                    <th>Buyer</th>
                    <th className='hide-col'>Purchased</th>
                    <th>Amount</th>
                    <th className='hide-col'>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.reverse().map((o) => (
                    <tr key={o._id}>
                      <td>
                        {/* {o.cartItems.length === 1 ? (
                          <div className='item-pic'>
                            <img
                              src={o.cartItems[0].product.imageUrl}
                              alt='pic'
                            />
                          </div>
                        ) : (
                          <div className='item-pic'>
                            <img
                              src={o.cartItems[0].product.imageUrl}
                              alt='pic'
                            />
                            <h3>+</h3>
                          </div>
                        )} */}
                        <b>{o.coupon}</b>
                      </td>
                      <td>
                        <div className='cutomer'>
                          {/* <div
                            className='customer-pic'
                            style={{
                              marginRight: '10px',
                              backgroundImage: 'url(' + user.profilePic + ')',
                            }}
                          ></div> */}
                          <span className='hide-col'>{user.name}</span>
                        </div>
                      </td>
                      <td className='hide-col purchased-col'>
                        {moment(o.publishDate).format('lll')}
                      </td>
                      <td>
                        <span className='hide-col'>$</span>
                        <b>{o.offerPrice}</b>
                      </td>
                      <td
                        className={
                          'hide-col order-status ' + o.orderStatus.toLowerCase()
                        }
                      >
                        <div className='hide-col'>{o.orderStatus}</div>
                      </td>
                      <td>
                        <Link to={`/dashboard/orders/order/${o._id}`}>
                          <button className='view-order'>View</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // calculateTotal = (cartItems) => {
  //   let total = 0;

  //   for (const c of cartItems) total = total + c.product.price * c.quantity;

  //   return total;
  // };
}

export default CustomerPage;
