import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';

export default function useFetchAllBillings() {
  return useQuery(['billings'], () => fetchAllBillings());
}

const fetchAllBillings = async (supplierId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/billings/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
