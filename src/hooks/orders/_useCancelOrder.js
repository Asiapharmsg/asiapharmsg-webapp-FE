import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useCancelOrder() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  // The server cancels the order and all of its lines in one transaction.
  const cancelOrder = async (orderId) => {
    const res = await apiFetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    const body = await res.json();
    if (body?.success === false) {
      throw new Error(body.message || 'Order was not cancelled');
    }
    return body;
  };

  return useMutation(cancelOrder, {
    onSuccess: () => {
      addToast('Order cancelled', {
        appearance: 'success',
        autoDismiss: true
      });
      queryClient.invalidateQueries('orders');
      queryClient.invalidateQueries('orders_by_supplier');
      queryClient.invalidateQueries('orders_by_id');
    },
    onError: (err) => {
      addToast(err?.message || 'Error cancelling order', {
        appearance: 'error'
      });
    }
  });
}
