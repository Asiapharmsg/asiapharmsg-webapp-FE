import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useUpdateOrderDetailsStatus() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();
  let delayInMilliseconds = 5000; //1 second

  const updateOrderDetailsStatus = async ({ orderDetails, clientEmail }) => {
    try {
      // Change status for order details
      const orderDetailCalls = [];
      console.log('use update order details (order details) : ', orderDetails);
      orderDetails.map((o) => {
        const payload = {
          status: o.status,
          item_price: o.price,
          supplier_id: o.supplier_id,
          clinic_email: clientEmail,
          remarks: o.remarks
        };
        console.log('update order detail id :', o.id);
        console.log('order details status : ', o.status);
        console.log('Order details remarks : ', o.remarks);
        orderDetailCalls.push(
          apiFetch(`${BASE_URL}/api/orderdetails/${o.id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );
      });
      const response = await Promise.all(orderDetailCalls);
      const orderDetailResponses = await Promise.all(
        response.map((r) => r.json())
      );
      const data = await response?.json();
      console.log('The Data: ', data);

      return data
        ? {
            order: data?.newOrder,
            orderDetailResponses: orderDetailResponses
          }
        : null;
    } catch (error) {
      console.log(error);
    }
    return null;
  };
  return useMutation(updateOrderDetailsStatus, {
    onSuccess: async (res, variables, context) => {
      addToast('Order Detail status updated successfully', {
        appearance: 'success',
        autoDismiss: true
      });
      queryClient.refetchQueries('orders');
    },
    onError: (err, variables, context) => {
      addToast('Error updating order status', { appearance: 'error' });
    }
  });
}
