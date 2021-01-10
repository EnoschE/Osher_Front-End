import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { getOrders } from '../services/orderService';
import { getUsers } from '../services/userService';
import { Link } from 'react-router-dom';
import auth from '../services/authService';
import moment from 'moment';
import Loader from './loader';
import 'chartjs-plugin-deferred';

class DashboardOverview extends Component {
  state = {
    loading: true,
    orders: [],
    user: '',
    users: [],
    barChartData: {
      labels: ['11', '12', '13', '14', '29'],
      datasets: [
        {
          label: 'Cold drinks',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Water',
          data: [2, 3, 20, 5, 1, 4],
          backgroundColor: 'rgb(54, 162, 235)',
        },
        {
          label: 'Juices',
          data: [3, 10, 13, 15, 22, 30],
          backgroundColor: 'rgba(255, 206, 86, 1)',
        },
      ],
    },

    pieChartData: {
      labels: ['Cold drinks', 'Water', 'Juices'],
      datasets: [
        {
          label: 'Sales by category',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          data: [65, 30, 56],
          borderWidth: 1,
        },
      ],
    },
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateDashboardMenu('dashboard');

    const user = await auth.getCurrentUser();
    this.setState({ user });

    const { data: users } = await getUsers();
    this.setState({ users });

    let { data: orders } = await getOrders();

    if (!user.isAdmin) {
      orders = orders.filter((o) => o.userId === user._id);
    }
    this.setState({ orders });

    // const coldDrinks = this.calculateTotalItems('Cold drink', orders);
    // const juices = this.calculateTotalItems('Juice', orders);
    // const water = this.calculateTotalItems('Water', orders);

    // const pieChartData = { ...this.state.pieChartData };
    // pieChartData.datasets[0].data = [coldDrinks, water, juices];

    const { dates, coupons: c } = this.populateDates(orders);
    const barChartData = { ...this.state.barChartData };
    barChartData.labels = dates;
    barChartData.datasets[0].data = c;
    // barChartData.datasets[1].data = w;
    // barChartData.datasets[2].data = j;

    // this.setState({ pieChartData, barChartData, loading: false });
    this.setState({ barChartData, loading: false });
    this.setState({ loading: false });
  }

  populateDates = (orders) => {
    let dates = [];

    let coupons = [];
    // let coldDrinks = [];
    // let juices = [];
    // let water = [];

    var x = 4;
    for (var i = 0; i < 5; i++)
      dates.push(
        moment()
          .subtract(x--, 'days')
          .toJSON()
      );

    for (const d of dates) {
      let ordersTemp = orders.filter(
        (o) =>
          moment(o.publishDate).format('MMMM Do YYYY') ===
          moment(d).format('MMMM Do YYYY')
      );
      const index = dates.indexOf(d);
      dates[index] = moment(d).format('D MMM');

      coupons.push();
      // coldDrinks.push(this.calculateTotalItems('Cold drink', ordersTemp));
      // juices.push(this.calculateTotalItems('Juice', ordersTemp));
      // water.push(this.calculateTotalItems('Water', ordersTemp));
    }

    return { dates, coupons };
  };

  calculateTotalCoupons = (type, orders) => {
    // const { orders } = this.state;

    let total = 0;

    for (const order of orders)
      for (const c of order.cartItems) {
        if (c.product.category === type) total = total + c.quantity;
      }

    return total;
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let { users, orders, user, loading } = this.state;

    if (loading) return <Loader />;

    return (
      <React.Fragment>
        <div className='row'>
          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.3s' }}
            >
              <h1>
                {orders.filter((o) => o.orderStatus === 'Expired').length}
              </h1>
              <h6>Coupons used</h6>
            </div>
          </div>

          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.4s' }}
            >
              <h1>{orders.filter((o) => o.orderStatus === 'Active').length}</h1>
              <h6>Unused coupons</h6>
            </div>
          </div>

          <div className='col-md-4 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.5s' }}
            >
              <h1>{orders.length}</h1>
              <h6>Total coupons</h6>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.3s' }}
            >
              <h6>{user.isAdmin ? 'Sales' : 'Purchased'} by category</h6>
              <br />
              <Pie
                data={this.state.pieChartData}
                options={{
                  title: {
                    display: false,
                    text: 'Sales by category',
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                  // plugins: {
                  //   deferred: {
                  //     // xOffset: 150,
                  //     // yOffset: '50%',
                  //     delay: 400,
                  //   },
                  // },
                }}
              />
            </div>
          </div>

          <div className='col-md-6 p-2'>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.6s' }}
            >
              <h6>Daily {user.isAdmin ? 'sales' : 'purchases'}</h6>
              <br />

              <Bar
                data={this.state.barChartData}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  plugins: {
                    deferred: {
                      xOffset: 150,
                      yOffset: '50%',
                      delay: 700,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className='row'>
          <div className={user.isAdmin ? 'col-md-9 p-2' : 'col-md-12 p-2'}>
            <div
              className='profile-right-block'
              style={{ animationDelay: '0.7s' }}
            >
              <h6>Recent orders</h6>
              <br />
              <table className=' orders-table'>
                <thead>
                  <tr>
                    <th>Items</th>
                    <th>Buyer</th>
                    <th className='hide-col'>Purchased</th>
                    <th>Amount</th>
                    <th className='hide-col'>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {/* {orders
                    .reverse()
                    .slice(0, 4)
                    .map((o) => (
                      <tr key={o._id}>
                        <td>
                          {o.cartItems.length === 1 ? (
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
                          )}
                        </td>
                        <td>
                          <div className='cutomer'>
                            <div
                              className='customer-pic'
                              style={{
                                marginRight: '10px',
                                backgroundImage:
                                  'url(' +
                                  this.buyerOfOrder(o.userId).profilePic +
                                  ')',
                              }}
                            ></div>
                            <span className='hide-col'>
                              {this.buyerOfOrder(o.userId).name}
                            </span>
                          </div>
                        </td>
                        <td className='hide-col purchased-col'>
                          {moment(o.publishDate).fromNow()}
                        </td>
                        <td>
                          <span className='hide-col'>PKR </span>
                          <b>{this.calculateTotal(o.cartItems)}</b>
                        </td>
                        <td
                          className={
                            'order-status  hide-col ' +
                            o.orderStatus.toLowerCase()
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
                    ))} */}
                </tbody>
              </table>

              <div className='view-all-customers'>
                <Link to='/dashboard/orders'>
                  <button>View all orders</button>
                </Link>
              </div>
            </div>
          </div>

          {user.isAdmin && (
            <div className='col-md-3 p-2'>
              <div
                className='profile-right-block'
                style={{ animationDelay: '0.8s' }}
              >
                <h6>Customers</h6>
                <br />
                {users
                  .filter((u) => !u.isAdmin)
                  .slice(0, 5)
                  .map((u) => (
                    <React.Fragment key={u._id}>
                      <div key={u._id} className='cutomer'>
                        <div
                          className='customer-pic'
                          style={{
                            backgroundImage: 'url(' + u.profilePic + ')',
                          }}
                        ></div>
                        <p>{u.name}</p>
                      </div>
                      <br />
                    </React.Fragment>
                  ))}
                <div className='view-all-customers'>
                  <Link to='/dashboard/customers'>
                    <button>View all</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
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

  calculateRevenue = (orders) => {
    let total = 0;

    for (const order of orders)
      for (const c of order.cartItems)
        total = total + c.product.price * c.quantity;

    return total;
  };

  calculateTotalItems = (type, orders) => {
    // const { orders } = this.state;

    let total = 0;

    for (const order of orders)
      for (const c of order.cartItems) {
        if (c.product.category === type) total = total + c.quantity;
      }

    return total;
  };
}

export default DashboardOverview;
