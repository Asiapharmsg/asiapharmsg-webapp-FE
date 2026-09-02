import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchOrders(userId) {
  return useQuery(['orders_by_user', userId], () =>
    fetchOrdersByUserId(userId), {
        enabled: userId ? true : false,
    }
  );
}

const fetchOrdersByUserId = async (uid) => {
  try {
    const response = await fetch(`${BASE_URL}/api/orders/user/${uid}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
