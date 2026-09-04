import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useAddOrder() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const addOrder = async ({ order, orderDetails }) => {
    // Unique supplier ids; the backend emails each supplier once.
    const uni_suppliers = [...new Set(orderDetails.map((od) => od.supplier_id))];

    const payload = {
      user_id: order.user_id,
      supplier_list: uni_suppliers,
      total_price: order.total_price,
      status: order.status,
      deliveryType: order.deliveryType,
      firstName: order.firstName,
      lastName: order.lastName,
      remarks: order.remarks,
      deliveryAddress: order.deliveryAddress,
      contact: order.contact,
      // The backend creates the order lines from this list in the same
      // transaction as the order itself.
      orderDetails_list: JSON.stringify(orderDetails)
    };

    const res = await apiFetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.newOrder?.id) {
      throw new Error(
        data?.error ?? data?.errors?.[0] ?? 'Error while creating order'
      );
    }
    return { order: data.newOrder };
  };

  return useMutation(addOrder, {
    onSuccess: () => {
      addToast('Order created successfully', {
        appearance: 'success',
        autoDismiss: true
      });
      queryClient.invalidateQueries('orders');
      queryClient.invalidateQueries('orders_by_supplier');
      queryClient.invalidateQueries('orders_by_user');
    },
    onError: (error) => {
      addToast(error?.message || 'Error while creating order', {
        appearance: 'error',
        autoDismiss: true
      });
    }
  });
}
