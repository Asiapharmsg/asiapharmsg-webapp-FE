import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useMarkOrderPartial() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  // Header-only: the server moves the order itself to Partially Fulfilled and
  // leaves every order line, and every billing row, exactly as they are.
  const markOrderPartial = async (orderId) => {
    const res = await apiFetch(`${BASE_URL}/api/orders/${orderId}/partial`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    const body = await res.json();
    if (body?.success === false) {
      throw new Error(body.message || 'Order status was not changed');
    }
    return body;
  };

  return useMutation(markOrderPartial, {
    onSuccess: () => {
      addToast('Order marked partially fulfilled', {
        appearance: 'success',
        autoDismiss: true
      });
      queryClient.invalidateQueries('orders');
      queryClient.invalidateQueries('orders_by_supplier');
      queryClient.invalidateQueries('orders_by_id');
    },
    onError: (err) => {
      addToast(err?.message || 'Error updating order status', {
        appearance: 'error'
      });
    }
  });
}
