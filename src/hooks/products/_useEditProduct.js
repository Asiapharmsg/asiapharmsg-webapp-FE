import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

export default function useEditProduct() {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const editProduct = async ({ productId, newProduct }) => {
    const res = await apiFetch(`${BASE_URL}/api/products/${productId}`, {
      method: 'PATCH',
      body: newProduct,
    });
    const data = await res?.json();
    // console.log('updated data', data);
  };
  return useMutation(editProduct, {
    onSuccess: async (res, variables, context) => {
      addToast('Product updated successfully', { appearance: 'success', autoDismiss: true });
      queryClient.refetchQueries(['products']);
    },
    onError: (err, variables, context) => {
      addToast('Error saving edited product', { appearance: 'error' });
    },
  });
}
