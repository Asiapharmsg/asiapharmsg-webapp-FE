import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useAddProduct() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const addProduct = async (product) => {
    console.log("useAddProduct - API CALL",product);
    const res = await apiFetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      body: product,
    });
    const data = await res?.json();
    if (data?.success === false || data?.error) {
      throw new Error(data.message || data.error || 'Request failed');
    }
    return data;
  };
  return useMutation(addProduct, {
    onSuccess: async (res, variables, context) => {
      addToast('Product added successfully', { appearance: 'success', autoDismiss: true });
      queryClient.refetchQueries('products');
    },
    onError: (err, variables, context) => {
        addToast(err?.message || "Error adding product", { appearance: 'error' });
    }
  });
}
