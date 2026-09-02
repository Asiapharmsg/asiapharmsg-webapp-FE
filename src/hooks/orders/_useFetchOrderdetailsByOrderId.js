import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchOrderdetailsByOrderId(orderId) {
  return useQuery(
    ['orders_by_id', orderId],
    () => fetchOrdersByOrderId(orderId),
    {
      enabled: orderId ? true : false,
    }
  );
}

const fetchOrdersByOrderId = async (oid) => {
  try {
    const response = await fetch(`${BASE_URL}/api/orderdetails/order/${oid}`);
    const data = await response.json();
    //console.log("order details data : ", data);
    return data;
  } catch (error) {
    return [];
  }
};
