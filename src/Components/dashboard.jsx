import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardOverview from './dashboardOverview';
import DashboardLeftBlock from './dashboardLeftBlock';
// import Customers from './customers';
// import Orders from './orders';
// import OrderPage from './orderPage';
// import CustomerPage from './customerPage';
// import ProductsDashboard from './productsDashboard';
// import Report from './report';
import auth from '../services/authService';

class Dashboard extends Component {
  state = {
    currentBlock: 'dashboard',
    user: '',
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  updateDashboardMenu = (block) => {
    this.setState({ currentBlock: block });
  };

  render() {
    const { currentBlock, user } = this.state;

    return (
      <div className='dashboard'>
        <div className='row'>
          <DashboardLeftBlock currentBlock={currentBlock} />

          <div className='col-md-10 dashboard-right-block'>
            <Switch>
              
              {/* {user.isAdmin && <Route
                path='/dashboard/customers/customer/:id'
                render={(props) => (
                  <CustomerPage
                      
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />}

              {user.isAdmin && <Route
                path='/dashboard/customers'
                render={(props) => (
                  <Customers
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />}

              {user.isAdmin && <Route
                path='/dashboard/products'
                render={(props) => (
                  <ProductsDashboard
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />}

              <Route
                path='/dashboard/orders/order/:id'
                render={(props) => (
                  <OrderPage
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />

              <Route
                path='/dashboard/orders'
                render={(props) => (
                  <Orders
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />

              <Route
                path='/dashboard/report'
                render={(props) => (
                  <Report
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              /> */}

              <Route
                exact
                path='/dashboard/'
                render={(props) => (
                  <DashboardOverview
                    {...props}
                    updateDashboardMenu={this.updateDashboardMenu}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
