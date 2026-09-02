import React from 'react';
import { useFetchProducts, useDeleteProduct } from '../../hooks/products';
import dayjs from 'dayjs';
import { getStockCount, getProductStatus } from '../../utils';
import { IoIosTrash, IoMdEye } from 'react-icons/io';
import { useSelector } from 'react-redux';

export default function ProductsList({ onEditProduct, products }) {
  const user = useSelector((state) => state.user);
  const { mutate: deleteProduct, isLoading } = useDeleteProduct();

  const deleteProductHandler = (pid) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this product?'
    );
    if (confirm) {
      deleteProduct(pid);
    }
  };
  return (
    <div className="myaccount-table table-responsive text-center">
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Category Id</th>
            <th>Products</th>
            <th>Unit Price</th>
            <th>Stock Count</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && 'Loading...'}
          {products &&
            products?.map((product) => (
              <tr>
                <td>{product?.id}</td>
                <td>{product?.category_id}</td>
                <td>{product?.name}</td>
                <td>{product?.price_tier_1}</td>
                <td>{getStockCount(product?.inventory_count)}</td>
                <td>{dayjs(product?.expiry_date).format('MMM D, YYYY')}</td>
                <td>{getProductStatus(product?.status)}</td>
                <td>
                  <a
                    href="#"
                    className="check-btn sqr-btn "
                    style={{ margin: '0px 10px' }}
                  >
                    <IoMdEye
                      onClick={(e) => {
                        e.preventDefault();
                        onEditProduct(product);
                      }}
                    />
                  </a>
                  <a
                    href="#"
                    className="check-btn sqr-btn "
                    onClick={(e) => {
                      e.preventDefault();
                      deleteProductHandler(product?.id);
                    }}
                  >
                    <IoIosTrash />
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
