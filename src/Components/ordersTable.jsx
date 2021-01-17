import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const OrdersTable = ({ data: orders, length, dateFromNow }) => {
  if (length) {
    orders = orders.slice(0, length);
  }
  let delay = 0.1;

  return (
    <table className=' orders-table'>
      <thead>
        <tr>
          <th>Coupon</th>
          <th>Buyer</th>
          <th className='hide-col'>Purchased</th>
          <th className='hide-col'>Expiry</th>
          <th>Amount</th>
          <th className='hide-col'>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {orders.map((o) => (
          <tr key={o._id} style={{ animationDelay: `${(delay += 0.1)}s` }}>
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
                        backgroundImage:
                          'url(' +
                          this.buyerOfOrder(o.userId).profilePic +
                          ')',
                      }}
                    ></div> */}
                {/* <div className='dashboard-customer-pic-circle'>
                  <h5>{o.name.charAt(0)}</h5>
                </div> */}
                <span className='hide-col'>{o.name}</span>
              </div>
            </td>
            <td className='hide-col purchased-col'>
              {dateFromNow
                ? moment(o.publishDate).fromNow()
                : moment(o.publishDate).format('lll')}
            </td>
            <td className='hide-col purchased-col'>
              {dateFromNow
                ? moment(o.expiryDate).fromNow()
                : moment(o.expiryDate).format('lll')}
            </td>
            <td>
              <span className='hide-col'>$</span>
              <b>{o.offerPrice}</b>
            </td>
            <td
              className={
                'order-status  hide-col ' + o.orderStatus.toLowerCase()
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
  );
};

export default OrdersTable;
