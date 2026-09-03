import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchSingleProduct({ productId }) {
  return useQuery(
    ['products', productId],
    () => fetchSingleProduct(productId),
    {
      enabled: productId ? true : false,
    }
  );
}

const fetchSingleProduct = async (productId) => {
  const response = await apiFetch(`${BASE_URL}/api/products/single/${productId}`);
  const data = await response.json();
  return data ? data : null;
};
