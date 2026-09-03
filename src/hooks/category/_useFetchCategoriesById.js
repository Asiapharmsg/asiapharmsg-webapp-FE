import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchCategoriesById(categoryId) {
  return useQuery(['category'], () => fetchCategoriesById(categoryId));
}

const fetchCategoriesById = async (categoryId) => {
  const response = await apiFetch(`${BASE_URL}/api/category/${categoryId}`);
  const data = await response.json();
  return data;
};
