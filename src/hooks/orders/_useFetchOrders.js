import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchOrders() {
  return useQuery(['orders'], () => fetchOrders());
}

const fetchOrders = async () => {
  try {
    const response = await apiFetch(`${BASE_URL}/api/orders`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
