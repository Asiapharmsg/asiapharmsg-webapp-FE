import React, { useState } from 'react';
import {
  useFetchPendingProducts
} from '../../hooks/products';
import dayjs from 'dayjs';
import { getOrderStatus } from '../../utils';
import { IoMdEye } from 'react-icons/io';

export default function PendingList() {
  const { data: products, status} = useFetchPendingProducts();

  return (
    <div className='my-account-area__content'>
      
        <h3>Pending Product List</h3>
          <div className='myaccount-table table-responsive text-center'>
            <table className='table table-bordered'>
              <thead className='thead-light'>
                <tr>
                  <th>Product_ID</th>
                  <th>Product Name</th>
                  <th>Create_On</th>
                  <th>Status</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && 'Loading...'}
                {status === 'success' &&
                  products?.length < 1 &&
                  'There is no pending products at this moments.'}
                {!!products?.length &&
                  products?.map((p) => (
                    <tr>
                      <td>{p?.id}</td>
                      <td>{p?.name}</td>
                      <td>{dayjs(products?.createdAt).format('MMM D, YYYY')}</td>
                      <td>{p?.status}</td>
                      <td>${p?.image}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
    </div>
  );
}
