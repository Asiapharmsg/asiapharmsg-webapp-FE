import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchOrders({ supplierId, userId }) {
  return useQuery(
    ['orders_by_supplier', supplierId, userId],
    () =>
      supplierId
        ? fetchOrdersBySupplierId(supplierId)
        : fetchOrdersByUserId(userId),
    {
      enabled: !supplierId && !userId ? false : true
    }
  );
}

const fetchOrdersBySupplierId = async (sid) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/orderdetails/supplier/${sid}`
    );
    const data = await response.json();
    console.log('here ');
    console.log(data);
    return data;
  } catch (error) {
    return [];
  }
};

const fetchOrdersByUserId = async (uid) => {
  try {
    const response = await fetch(`${BASE_URL}/api/orderdetails/user/${uid}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
