import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchAllBillings() {
  return useQuery(['billings'], () => fetchAllBillings());
}

const fetchAllBillings = async (supplierId) => {
  try {
    const response = await apiFetch(`${BASE_URL}/api/billings/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
