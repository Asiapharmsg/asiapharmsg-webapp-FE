import React, { useState, useEffect } from 'react';
import { useFetchBillings } from '../../hooks/billings';
import {
  useFetchOrders,
  useFetchSupplierOrders,
  useFetchOrderdetailsByOrderId,
  useUpdateOrderDetailsStatus
} from '../../hooks/orders';
import dayjs from 'dayjs';
import { getOrderStatus } from '../../utils';
import { IoMdEye } from 'react-icons/io';
import { useSelector } from 'react-redux';

const checkBillings = (billings) => {
  return Array.isArray(billings) ? billings : [];
};

export default function BillingsList() {
  const user = useSelector((state) => state.user);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  //   const { data: orders, status } = useFetchOrders();
  const { mutate: updateOrderStatus } = useUpdateOrderDetailsStatus();
  const { data: orderdetails, status: detailsLoading } =
    useFetchOrderdetailsByOrderId(selectedOrder?.id);
  const { data: billings, status } = useFetchBillings(user.supplierId); //Hardcode here

  const sanitizedBillings = checkBillings(billings);

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

  const [filterOptions, setFilterOptions] = useState({
    year: 0,
    month: 0
  });

  const [filteredBillings, setFilteredBillings] = useState([]);

  useEffect(() => {
    if (sanitizedBillings) {
      setFilteredBillings(sanitizedBillings);
    }
  }, [JSON.stringify(sanitizedBillings)]);

  const onChangeFilters = ({ year, month }) => {
    console.log(year, month);
    if (Number(year) === 0 && Number(month) === 0) {
      setFilteredBillings(billings);
    } else if (Number(year) !== 0 && Number(month) === 0) {
      setFilteredBillings(
        billings.filter(
          (billing) => dayjs(billing.createdAt).format('YYYY') === year
        )
      );
    } else if (Number(year) === 0 && Number(month) !== 0) {
      setFilteredBillings(
        billings.filter(
          (billing) =>
            parseInt(dayjs(billing.createdAt).format('MM')) === parseInt(month)
        )
      );
    } else if (Number(year) !== 0 && Number(month) !== 0) {
      setFilteredBillings(
        billings.filter(
          (billing) =>
            parseInt(dayjs(billing.createdAt).format('MM')) ===
              parseInt(month) &&
            dayjs(billing.createdAt).format('YYYY') === year
        )
      );
    }
  };

  return (
    <div className="my-account-area__content">
      {!showOrderDetails && (
        <>
          <h3>Billings</h3>
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
          <div className="myaccount-table table-responsive text-center">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Order Detail ID</th>
                  <th>Created On</th>
                  <th>Status</th>
                  <th>Billing Price</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && 'Loading...'}
                {status === 'success' && sanitizedBillings?.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <h3 className="my-5">
                        There are no billings at this moment.
                      </h3>
                    </td>
                  </tr>
                )}
                {!!filteredBillings?.length &&
                  filteredBillings?.map((b) => (
                    <tr>
                      <td>{b?.order_detail_id}</td>
                      <td>
                        {dayjs(b?.createdAt).format('MMM D, YYYY, hh:mm A')}
                      </td>
                      <td>{getOrderStatus(b?.status)}</td>
                      <td>${b?.billing_price}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
