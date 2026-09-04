import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useFetchOrders,
  useUpdateOrderDetailsStatus,
  useFetchOrderdetailsByOrderId
} from '../../hooks/orders';
import dayjs from 'dayjs';
import { getOrderStatus } from '../../utils';
import { IoMdEye } from 'react-icons/io';
import axios from 'axios';
import ReactToPdf from 'react-to-pdf';

const years = [0, 2026, 2025, 2024, 2023, 2022, 2021];
const months = [
  { value: 0, label: 'All' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export default function AdminOrdersList() {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [userInfo, setUserInfo] = useState(false);
  //const [orderDeliveryInfo, setOrderDeliveryInfo] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState(false);
  const user = useSelector((state) => state.user);
  const [filterOptions, setFilterOptions] = useState({
    status: 0,
    year: 0,
    month: 0
  });
  const { data: orders, status } = useFetchOrders();
  //const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const { mutate: updateOrderDetailsStatus, isLoading } =
    useUpdateOrderDetailsStatus();
  const { data: orderdetails, status: detailsLoading } =
    useFetchOrderdetailsByOrderId(selectedOrder?.id);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(false);
  const [deliveryName, setDeliveryName] = useState(false);
  const [deliveryRemarks, setDeliveryRemarks] = useState(false);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  const onChangeFilters = ({ status, year, month }) => {
    if (Number(status) === 0 && Number(year) === 0 && Number(month) === 0) {
      setFilteredOrders(orders);
    } else if (
      Number(status) !== 0 &&
      Number(year) === 0 &&
      Number(month) === 0
    ) {
      setFilteredOrders(
        orders.filter((order) => order.status === Number(status))
      );
    } else if (
      Number(status) !== 0 &&
      Number(year) !== 0 &&
      Number(month) === 0
    ) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.status === Number(status) &&
            dayjs(order.createdAt).format('YYYY') === year
        )
      );
    } else if (
      Number(status) === 0 &&
      Number(year) !== 0 &&
      Number(month) === 0
    ) {
      setFilteredOrders(
        orders.filter((order) => dayjs(order.createdAt).format('YYYY') === year)
      );
    } else if (
      Number(status) === 0 &&
      Number(year) === 0 &&
      Number(month) !== 0
    ) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            parseInt(dayjs(order.createdAt).format('MM')) === parseInt(month)
        )
      );
    } else if (
      Number(status) === 0 &&
      Number(year) !== 0 &&
      Number(month) !== 0
    ) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            parseInt(dayjs(order.createdAt).format('MM')) === parseInt(month) &&
            dayjs(order.createdAt).format('YYYY') === year
        )
      );
    } else if (
      Number(status) !== 0 &&
      Number(year) === 0 &&
      Number(month) !== 0
    ) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.status === Number(status) &&
            parseInt(dayjs(order.createdAt).format('MM')) === parseInt(month)
        )
      );
    } else if (
      Number(status) !== 0 &&
      Number(year) !== 0 &&
      Number(month) !== 0
    ) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.status === Number(status) &&
            dayjs(order.createdAt).format('YYYY') === year &&
            parseInt(dayjs(order.createdAt).format('MM')) === parseInt(month)
        )
      );
    }
  };

  const getUserDetails = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/user/user-data-noimg/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const data = response.data;
      setUserInfo(data.data);
      console.log('return data : ', data);
      return data;
    } catch (error) {
      console.log(error);
      setUserInfo({ unavailable: true });
      return [];
    }
  };

  const getOrderDelivery = async (oid) => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/api/orders/orderdelivery/${oid}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const data = response.data;

      console.log('here testing :', data);

      if (data == null) {
        setDeliveryName('not available');
        setDeliveryAddress('not available');
        setDeliveryRemarks('not available');
        console.log('here testing : 1');
      } else {
        setDeliveryName(data.first_name + ' ' + data.last_name);
        setDeliveryAddress(data.delivery_address);
        setDeliveryRemarks(data.remarks);
        console.log('here testing : 2');
      }
      //setOrderDeliveryInfo(data);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getOrderDetailsWithGroupedVendor = useMemo(() => {
    console.log(orderdetails);

    return orderdetails?.reduce((obj, item) => {
      console.log(item);
      if (obj[item.user.company_name]) {
        obj[item.user.company_name].push(item);
        return obj;
      } else {
        return Object.assign(obj, { [item.user.company_name]: [item] });
      }
    }, {});
  }, [orderdetails, user.accountType, user.supplierId, user.userId]);

  console.log({ getOrderDetailsWithGroupedVendor });

  const ref = React.createRef();
  const options = {
    orientation: 'p',
    unit: 'mm',
    format: [300, 700]
  };

  const getUnitPrice = (price, quantity) => {
    const total_price = price;
    const qty = quantity;

    return parseFloat(total_price) / qty;
  };

  return (
    <div className="my-account-area__content">
      {!showOrderDetails && (
        <>
          <h3>Orders</h3>
          <div className="single-icon filter-dropdown">
            <label htmlFor="orderStatus" className="required">
              Order Status :
            </label>
            <select
              style={{ height: '100%', minWidth: '120px' }}
              value={filterOptions?.status}
              onChange={(e) => {
                onChangeFilters({ ...filterOptions, status: e.target.value });
                setFilterOptions({ ...filterOptions, status: e.target.value });
              }}
            >
              {[0, 1, 2, 3, 5].map((item) => (
                <option value={item}>
                  {item === 0 ? 'All' : getOrderStatus(item)}
                </option>
              ))}
            </select>
            <label htmlFor="year" className="required">
              Year :
            </label>
            <select
              style={{ height: '100%', minWidth: '120px' }}
              value={filterOptions?.year}
              onChange={(e) => {
                onChangeFilters({ ...filterOptions, year: e.target.value });
                setFilterOptions({ ...filterOptions, year: e.target.value });
              }}
            >
              {years.map((item) => (
                <option value={item}>{item === 0 ? 'All' : item}</option>
              ))}
            </select>
            <label htmlFor="month" className="required">
              Month :
            </label>
            <select
              style={{ height: '100%', minWidth: '120px' }}
              value={filterOptions?.month}
              onChange={(e) => {
                onChangeFilters({ ...filterOptions, month: e.target.value });
                setFilterOptions({ ...filterOptions, month: e.target.value });
              }}
            >
              {months.map((item) => (
                <option value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="myaccount-table table-responsive text-center">
            <table className="table table-bordered reset-whitespace">
              <thead className="thead-light">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Order By</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && 'Loading...'}
                {status === 'success' &&
                  orders?.length < 1 &&
                  'No orders to show.'}
                {!!filteredOrders?.length &&
                  filteredOrders?.map((o) => (
                    <tr>
                      <td>
                        {dayjs(o?.createdAt).format('DDMMYYYYHHMMss')}
                        {o?.id}
                      </td>
                      <td>
                        {dayjs(o?.createdAt).format('MMM D, YYYY, hh:mm A')}
                      </td>
                      <td>{o.user.companyName}</td>
                      <td>${o?.total_price}</td>
                      <td>{getOrderStatus(o?.status)}</td>
                      <td>
                        <IoMdEye
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedOrder(o);
                            getUserDetails(o.user_id);
                            getOrderDelivery(o.id);
                            setShowOrderDetails(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showOrderDetails && (
        <>
          <h3>Order details</h3>
          <>
            <div className="single-input-item ">
              <button
                className="lezada-button lezada-button--small product-content__ofs space-mr--10"
                onClick={() => {
                  setSelectedOrder(null);
                  setShowOrderDetails(false);
                }}
              >
                Back
              </button>
            </div>

            <br />
          </>
          <div
            className="myaccount-table table-responsive text-center"
            ref={ref}
          >
            <h1>PURCHASE ORDER</h1>
            <table className="table table-bordered reset-whitespace">
              <thead className="thead-light">
                <tr>
                  <th>User Details</th>{' '}
                  {/* Name, address, contact, mobile, email */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name : </td>
                  <td>
                    {userInfo?.unavailable
                      ? 'Not available'
                      : [userInfo?.firstName, userInfo?.lastName]
                          .filter(Boolean)
                          .join(' ')}
                  </td>
                </tr>
                <tr>
                  <td>Account Type : </td>
                  <td>{userInfo.accountType}</td>
                </tr>
                <tr>
                  <td>Company : </td>
                  <td>{userInfo.companyName}</td>
                </tr>
                <tr>
                  <td>Delivery Address :</td>
                  <td>{deliveryAddress}</td>
                </tr>
                <tr>
                  <td>Point of Contact :</td>
                  <td>{deliveryName}</td>
                </tr>
                <tr>
                  <td>Phone : </td>
                  <td>{userInfo.phone}</td>
                </tr>
                <tr>
                  <td>Mobile : </td>
                  <td>{userInfo.mobile}</td>
                </tr>
                <tr>
                  <td>Email : </td>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <td>Order ID : </td>
                  <td>
                    {dayjs(selectedOrder?.createdAt).format('DDMMYYYYHHMMss')}
                    {selectedOrder?.id}
                  </td>
                </tr>
                <tr>
                  <td>Order Date & Time: </td>
                  <td>
                    {dayjs(selectedOrder?.createdAt).format(
                      'DD-MM-YYYY HH:MMA'
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Remarks :</td>
                  <td>{deliveryRemarks}</td>
                </tr>
              </tbody>
            </table>
            <table className="table table-bordered reset-whitespace">
              <tbody>
                {isLoading && 'Loading...'}
                {detailsLoading === 'success' &&
                  orderdetails?.length < 1 &&
                  'No order details to show.'}

                {getOrderDetailsWithGroupedVendor &&
                  Object.keys(getOrderDetailsWithGroupedVendor).map((key) => (
                    <React.Fragment>
                      <tr>
                        <td>
                          <b>Vendor Name :</b>
                        </td>
                        <td>{key}</td>
                        <td>
                          <b>Vendor Phone :</b>
                        </td>
                        <td>
                          {getOrderDetailsWithGroupedVendor[key][0].user.phone}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>
                          <b>ODID</b>
                        </td>
                        <td>
                          <b>Product Name</b>
                        </td>
                        <td>
                          <b>Unit Price</b>
                        </td>
                        <td>
                          <b>Quantity</b>
                        </td>
                        <td>
                          <b>Total</b>
                        </td>
                        <td>
                          <b>Status</b>
                        </td>
                        <td>
                          <b>Remarks</b>
                        </td>
                      </tr>
                      {getOrderDetailsWithGroupedVendor[key].map((o) => (
                        <tr>
                          <td>
                            <b>{o?.id}</b>
                          </td>
                          <td>{o?.product.name}</td>
                          <td>
                            ${getUnitPrice(o?.price, o?.quantity).toFixed(2)}
                          </td>
                          <td>{o?.quantity}</td>
                          <td>${o?.price}</td>
                          <td>{getOrderStatus(o?.status)}</td>
                          <td>{o?.remarks}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
              </tbody>
              {/*<tbody>
                {isLoading && 'Loading...'}
                {detailsLoading === 'success' &&
                  orderdetails?.length < 1 &&
                  'No order details to show.'}
                {orderdetails &&
                  orderdetails?.map((o) => (
                    <tr>
                      <td>{o?.id}</td>
                      <td>{o?.user.company_name}</td>
                      <td>{o?.user.phone}</td>
                      <td>{o?.product_id}</td>
                      <td>{o?.product.name}</td>
                      <td>{o?.product.price_tier_1}</td>
                      <td>{o?.quantity}</td>
                      <td>${o?.price}</td>
                      <td>{getOrderStatus(o?.status)}</td>
                      <td>{o?.remarks}</td>
                    </tr>
                  ))}
              </tbody>*/}
            </table>
            <div className="d-flex mt-4 align-items-center justify-content-end">
              <ReactToPdf
                targetRef={ref}
                filename="order.pdf"
                options={options}
                x={0.5}
                y={0.5}
                scale={1}
              >
                {({ toPdf }) => (
                  <button
                    className="lezada-button lezada-button--small product-content__ofs space-mr--10"
                    onClick={toPdf}
                  >
                    Generate pdf
                  </button>
                )}
              </ReactToPdf>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
