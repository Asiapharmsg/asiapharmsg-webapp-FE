import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchCategories() {
  return useQuery(['category'], () => fetchCategories());
}

const fetchCategories = async () => {
  const response = await apiFetch(`${BASE_URL}/api/category`);
  const data = await response.json();
  return data;
};
