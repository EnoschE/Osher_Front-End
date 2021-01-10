import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../services/authService';

class DashboardLeftBlock extends Component {
  state = {
    user: '',
  };

  async componentDidMount() {
    const user = await auth.getCurrentUser();
    this.setState({ user });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { user } = this.state;
    const { currentBlock } = this.props;

    return (
      <div className='col-md-2 p-2'>
        <div className='dashboard-left-block'>
          
            <div
              className='dashboard-pic-circle'
              style={{
                backgroundImage: 'url(' + user.profilePic + ')',
              }}
            ></div>
          
          <div className='profile-left-text'>
            <h2>{user.name}</h2>
            {user.isAdmin && <h6>Admin</h6>}
          </div>

          <br />

          <div className='dashboard-left-menu'>
            <Link to='/dashboard'>
              <div
                className={
                  currentBlock === 'dashboard'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>Dashboard</h5>
                <div></div>
              </div>
            </Link>

            {user.isAdmin && (
              <Link to='/dashboard/customers/'>
                <div
                  className={
                    currentBlock === 'customers'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>Customers</h5>
                  <div></div>
                </div>
              </Link>
            )}

            <Link to='/dashboard/orders'>
              <div
                className={
                  currentBlock === 'orders'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>Orders</h5>
                <div></div>
              </div>
            </Link>
          
            <Link to='/dashboard/report'>
              <div
                className={
                  currentBlock === 'report'
                    ? 'left-menu-link active-link'
                    : 'left-menu-link'
                }
              >
                <h5>Report</h5>
                <div></div>
              </div>
            </Link>

            {user.isAdmin && (
              <Link to='/dashboard/products'>
                <div
                  className={
                    currentBlock === 'products'
                      ? 'left-menu-link active-link'
                      : 'left-menu-link'
                  }
                >
                  <h5>Products</h5>
                  <div></div>
                </div>
              </Link>
            )}

            <Link to='/logout/'>
              <div className='left-menu-link'>
                <h5>Logout</h5>
                <div></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardLeftBlock;
