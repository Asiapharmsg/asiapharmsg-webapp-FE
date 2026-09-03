import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchSupplierProducts(sid) {
  return useQuery(['products'], () => fetchSupplierProducts(sid));
}

const fetchSupplierProducts = async (supplierId) => {
  try {
    console.log('here is fetch supplier products by id : ', supplierId);
    const response = await apiFetch(
      `${BASE_URL}/api/products/supplier/${supplierId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
