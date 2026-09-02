import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL } from '../../utils';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

export default function useAddOrder() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const addOrder = async ({ order, orderDetails }) => {
    // Store all supplier_ids, duplicates
    const supplier_ids = [];
    for (const od in orderDetails) {
      supplier_ids.push(orderDetails[od].supplier_id);
    }

    // Get Unique Supplier Id For Email
    console.log('list :', supplier_ids);
    const uni_suppliers = [...new Set(supplier_ids)];
    order.supplier_list = uni_suppliers;

    console.log('the order information :', order);
    // Prepare more data for email
    const tempload = {
      user_id: order.user_id,
      supplier_list: order.supplier_list,
      total_price: order.total_price,
      status: order.status,
      deliveryType: order.deliveryType,
      firstName: order.firstName,
      lastName: order.lastName,
      remarks: order.remarks,
      deliveryAddress: order.deliveryAddress,
      contact: order.contact,
      orderDetails_list: JSON.stringify(orderDetails)
    };

    try {
      const res= await axios.post(`${BASE_URL}/api/orders`,tempload)
      const data = await res?.data
      if (data?.newOrder?.id) {
        const orderDetailCalls = [];
        orderDetails.map((o) => {
          const payload = {
            order_id: data?.newOrder?.id,
            product_id: o?.product_id,
            quantity: o?.quantity,
            price: o?.price,
            supplier_id: o?.supplier_id,
            status: 2
          };
          // const formData = new FormData();
          // formData.append('order_id', data?.newOrder?.id);
          // formData.append('product_id', o.product_id);
          // formData.append('quantity', o.quantity);
          // formData.append('price', o.price);
          // formData.append('supplier_id', o.supplier_id);

          console.log('addOrder', o.product_id);
          orderDetailCalls.push(
            axios.post(`${BASE_URL}/api/orderdetails`, payload)
          );
        });
        const orderDetailResponses = await Promise.all(orderDetailCalls);
        console.log(orderDetailResponses?.map(order=>order.data))

        return data
          ? {
              order: data?.newOrder,
              orderDetailResponses: orderDetailResponses?.map(order=>order.data)
            }
          : null;
      }
    } catch (error) {
      throw error;
    }
  };
  return useMutation(addOrder, {
    onSuccess: (res, variables, context) => {
      console.log("On success mutation")
      addToast('Order created successfully', {
        appearance: 'success',
        autoDismiss: true
      });
      queryClient.refetchQueries('orders');
    },
    onError: (error)=>{
      console.log({error})
      addToast(error.response ? error.response.data.errors[0] : 'Error while creating order', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  });
}
