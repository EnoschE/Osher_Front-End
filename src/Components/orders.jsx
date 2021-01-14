import React, { Component } from 'react';
import { getOrders } from '../services/orderService';
import { getUsers } from '../services/userService';
import auth from '../services/authService';
import Loader from './loader';
import SearchInput from './common/searchInput';
import OrdersTable from './ordersTable';

class Orders extends Component {
  state = {
    allStatus: [
      'Active',
      'Expired',
      // , 'Delivered', 'Recieved', 'Cancelled'
    ],
    user: '',
    orders: [],
    users: [],
    status: 'All',
    loading: true,
    searchQuery: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('orders');

    const allStatus = ['All', ...this.state.allStatus];
    this.setState({ allStatus });

    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data: users } = await getUsers();
    this.setState({ users });

    let { data: orders } = await getOrders();

    if (!user.isAdmin) {
      orders = orders.filter((o) => o.brandId === user._id);
    }

    this.setState({ orders, loading: false });
  }

  handleStatusSelect = (status) => {
    this.setState({
      status,
    });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      status: 'All',
      // currentPage: 1,
    });
  };

  getFilteredOrders = () => {
    const { status, orders, searchQuery } = this.state;

    let filtered = orders;

    if (searchQuery)
      filtered = orders.filter((o) =>
        o.coupon.toLowerCase().includes(searchQuery.toLowerCase()) || o.name.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
    else if (status !== 'All')
      filtered = orders.filter((o) => o.orderStatus === status);

    // filtered = filtered.reverse();

    let filtered2 = [];

    for (var i = filtered.length - 1; i >= 0; i--) {
      filtered2.push(filtered[i]);
    }

    filtered = filtered2;

    return { filtered };
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let { filtered: orders } = this.getFilteredOrders();
    const { status, allStatus, loading, searchQuery } = this.state;


    if (loading) return <Loader />;

    return (
      <div className='customers-page orders'>
        <div className='row'>
          <div className='col-md-12 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.1s' }}
            >
              <h1>Orders</h1>

              <div className='orders-filter'>
                <SearchInput
                  value={searchQuery}
                  updateSearch={this.handleSearch}
                />
                <div className='filter-block'>
                  <p className='filter-heading'>Filter by: </p>

                  {allStatus.map((s) => (
                    <div
                      key={s}
                      className={
                        s === status
                          ? 'filter-item  filter-item-active'
                          : ' filter-item'
                      }
                      onClick={() => this.handleStatusSelect(s)}
                    >
                      <p>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            
              <OrdersTable data={orders} />
              
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }

  buyerOfOrder = (id) => {
    const { users } = this.state;
    const user = users.filter((u) => u._id === id);

    return user[0];
  };

  calculateTotal = (cartItems) => {
    let total = 0;
    for (const c of cartItems) total = total + c.product.price * c.quantity;
    return total;
  };
}

export default Orders;
