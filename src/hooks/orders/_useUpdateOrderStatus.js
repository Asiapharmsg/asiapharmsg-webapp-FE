import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';


export default function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const updateOrderStatus = async ({oid, status, total_price}) => {
      //const formData = new FormData();
      //formData.append('status', status);
      //formData.append('total_price', total_price);
      console.log("use update order status js - status : ", status);
      const payload = {
        status,
        total_price
    };
    try {
      const res = await apiFetch(`${BASE_URL}/api/orders/${oid}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res?.json();
      console.log('The Data: ', data);
      return data ? data : null
    } catch (error) {
      console.log(error);
    }
    return null;
  };
  return useMutation(updateOrderStatus, {
    onSuccess: async (res, variables, context) => {
      addToast('Order status updated successfully', { appearance: 'success', autoDismiss: true });
      queryClient.refetchQueries(['orders_by_supplier']);
    },
    onError: (err, variables, context) => {
      addToast('Error updating order status', { appearance: 'error' });
    },
  });
}
/*
export default function useUpdateOrderDetailStatus() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const useUpdateOrderDetailStatus = async ({orderDetails, status}) => {
    try {
      // Testing 
      const orderDetailCalls = [];
      orderDetails.map((o) => {
        const payload = {
          status: status,
        }
        console.log("update order details status :", o.id);
        orderDetailCalls.push(
          apiFetch(`${BASE_URL}/api/orderdetails/${o.id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
      const response = await Promise.all(orderDetailCalls);
      const orderDetailResponses = await Promise.all(
        response.map((r) => r.json())
      );

      return data
          ? {
              order: data?.newOrder,
              orderDetailResponses: orderDetailResponses,
            }
          : null;
    } catch (error) {
      console.log(error);
    }
    return null;
  };
  return useMutation(updateOrderStatus, {
    onSuccess: async (res, variables, context) => {
      addToast('Order Detail status updated successfully', { appearance: 'success' });
      queryClient.refetchQueries('orders');
    },
    onError: (err, variables, context) => {
      addToast('Error updating order status', { appearance: 'error' });
    },
  });
}*/
