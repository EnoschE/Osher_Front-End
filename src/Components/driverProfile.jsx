import React, { Component } from 'react';
import auth from '../services/authService';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import Loader from './loader';

class DriverProfile extends Component {
  state = { user: '', orders: [], loading: true };

  async componentDidMount() {
    window.scrollTo(0, 0);

    this.props.handleBack(this.props.history.goBack);
    this.setState({ loading: false });

    const user = await auth.getCurrentUser();
    this.setState({ user });

    let { data: orders } = await getOrders();

    if (!user.isAdmin) orders = orders.filter((o) => o.userId === user._id);

    this.setState({ orders });
  }

  render() {
    // const { user, orders, loading } = this.state;
    const { user, loading } = this.state;

    return (
      <div className='main-background'>
        <div className=' profile-page'>
          <div className=''>
            {loading ? (
              <Loader />
            ) : (
              <div className='row'>
                <div className='col-sm-4 p-2'>
                  <div className='profile-left-block'>
                    <div
                      className='profile-pic-circle'
                      style={{
                        // backgroundImage: 'url(/img/tom.jpg)',
                        backgroundImage: 'url(' + user.profilePic + ')',
                      }}
                    ></div>
                    <div className='profile-left-text'>
                      {/* <h2>Muhammad Aqib</h2> */}
                      <h2>{user.name}</h2>
                      {/* {user && user.isAdmin && <h6>Admin</h6>} */}
                      <br />
                      <p>Email: {user.email}</p>
                      <p>Phone: {user.phone || 'Not set yet'}</p>
                      <p>Address: {user.address || 'Not set yet'}</p>
                      <p>City: {user.city || 'Not set yet'}</p>

                      <Link to='/update-profile'>
                        <button>Update Profile</button>
                      </Link>
                    </div>
                  </div>
                </div>
                {!loading && (
                  <div className='col-sm-8'>
                    <div className='row'>
                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.2s' }}
                        >
                          <h1>
                            24{' '}
                            {/* {
                              orders.filter((o) => o.orderStatus === 'Placed')
                                .length
                            } */}
                          </h1>
                          <h6>Unapproved orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.3s' }}
                        >
                          <h1>
                            34
                            {/* {
                              orders.filter((o) => o.orderStatus === 'Approved')
                                .length
                            } */}
                          </h1>
                          <h6>Approved orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.4s' }}
                        >
                          <h1>
                            23{' '}
                            {/* {
                              orders.filter(
                                (o) => o.orderStatus === 'Cancelled'
                              ).length
                            } */}
                          </h1>
                          <h6>Cancelled orders</h6>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.4s' }}
                        >
                          <h1>
                            23{' '}
                            {/* {
                              orders.filter(
                                (o) => o.orderStatus === 'Delivered'
                              ).length
                            } */}
                          </h1>
                          <h6>Delivered orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.5s' }}
                        >
                          <h1>
                            14{' '}
                            {/* {
                              orders.filter((o) => o.orderStatus === 'Recieved')
                                .length
                            } */}
                          </h1>
                          <h6>Received orders</h6>
                        </div>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <div
                          className='profile-right-block'
                          style={{ animationDelay: '0.6s' }}
                        >
                          <h1>438</h1>
                          {/* <h1>{this.calculateTotalItems(orders)}</h1> */}
                          {/* <h6>Items {user.isAdmin ? 'sold' : 'purchased'}</h6> */}
                          <h6>Items sold</h6>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-sm-8 p-2'>
                        <Link to='/dashboard'>
                          <div
                            className='profile-right-block'
                            style={{ animationDelay: '0.6s' }}
                          >
                            <h2>Dashboard</h2>
                            <h6>For detailed view</h6>
                          </div>
                        </Link>
                      </div>

                      <div className='col-sm-4 p-2'>
                        <Link to='/logout'>
                          <div
                            className='profile-right-block logout-block'
                            style={{ animationDelay: '0.7s' }}
                          >
                            <h2>Logout</h2>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  calculateTotalItems = (orders) => {
    let items = 0;

    for (const order of orders)
      for (const c of order.cartItems) {
        // if (!items.includes(c.product)) {
        items = items + c.quantity;
        // items.push(c.product._id);
      }

    // const unique = new Set(items);
    // items = [...unique];

    return items;
  };
}

export default DriverProfile;
