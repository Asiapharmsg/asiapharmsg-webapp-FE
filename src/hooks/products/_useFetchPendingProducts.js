import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';

export default function useFetchPendingProducts() {
  return useQuery(['products'], () => fetchPendingProducts());
}

const fetchPendingProducts = async () => {
  try{  
    const response = await apiFetch(`${BASE_URL}/api/products/pending`);
    const data = await response.json();
    return data;
  } 
  catch (error) 
  {
    return [];
  }
};
