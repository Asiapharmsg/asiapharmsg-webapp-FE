import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useUpdateOrderDetailsStatus() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const updateOrderDetailsStatus = async ({ orderDetails, clientEmail }) => {
    const results = [];
    // One line at a time: each update recomputes the order's overall status
    // on the server, so parallel calls would race each other.
    for (const o of orderDetails) {
      const res = await apiFetch(`${BASE_URL}/api/orderdetails/${o.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: o.status,
          clinic_email: clientEmail,
          remarks: o.remarks
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const body = await res.json();
      if (body?.success === false) {
        throw new Error(body.message || 'Order line was not updated');
      }
      results.push(body);
    }
    return results;
  };

  return useMutation(updateOrderDetailsStatus, {
    onSuccess: () => {
      addToast('Order status updated successfully', {
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
