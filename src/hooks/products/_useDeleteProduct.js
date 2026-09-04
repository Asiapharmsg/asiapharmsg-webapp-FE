import { useQueryClient, useMutation } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import { useToasts } from 'react-toast-notifications';

const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToasts();

  const deleteProduct = async (pid) => {
    const res = await apiFetch(`${BASE_URL}/api/products/${pid}`, {
      method: 'DELETE',
    });
    const data = await res?.json();
    if (data?.success === false || data?.error) {
      throw new Error(data.message || data.error || 'Request failed');
    }
    return data;
  };

  return useMutation(deleteProduct, {
    onSuccess: async (res, variables, context) => {
      addToast('Product deleted successfully', { appearance: 'success', autoDismiss: true });
      queryClient.refetchQueries('products');
    },
    onError: (err, variables, context) => {
      addToast(err?.message || 'Error deleting product', { appearance: 'error' });
    },
  });
};
export default useDeleteProduct;
