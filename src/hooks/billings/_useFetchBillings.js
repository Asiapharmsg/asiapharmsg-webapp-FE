import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchBillings(supplierId) {
  return useQuery(['billings'], () => fetchBillings(supplierId));
}

const fetchBillings = async (supplierId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/billings/supplier/${supplierId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
