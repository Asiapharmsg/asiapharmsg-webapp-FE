import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchOrders() {
  return useQuery(['orders'], () => fetchOrders());
}

const fetchOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/orders`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
