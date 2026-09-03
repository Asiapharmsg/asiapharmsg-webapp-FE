import { useQuery } from 'react-query';
import { BASE_URL, apiFetch } from '../../utils';
import moment from 'moment';

export default function useFetchProducts(options) {
  const searchText = options?.searchText;
  const categoryId = options?.categoryId;
  const supplierId = options?.supplierId;
  const perPage = options?.perPage;
  const curPage = options?.currentPage;
  const isCount = options?.isCount;

  return useQuery(
    ['products', searchText, categoryId, supplierId, curPage, perPage, isCount],
    () =>
      fetchProducts(
        searchText,
        categoryId,
        supplierId,
        curPage,
        perPage,
        isCount
      )
  );
}

const fetchProducts = async (
  searchText,
  categoryId,
  supplierId,
  curPage,
  perPage,
  isCount
) => {
  let data;
  if (supplierId) {
    //fecth products by supplier
    if (!searchText && !categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (searchText && !categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?searchText=${searchText}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (!searchText && categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?category_id=${categoryId}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (searchText && categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?searchText=${searchText}&category_id=${categoryId}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    }
  } else {
    if (!searchText && !categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
      // console.log(data);
      // let results = [];
      // for (let i = 0; i < data.data.length; i++) {
      //   const item = data.data[i];
      //   const now = moment();
      //   const exp = moment(item.expiry_date);
      //   const check = now.isAfter(exp);
      //   if (!check) {
      //     results.push(item);
      //   }
      // }
      // return results;
    } else if (searchText && !categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?searchText=${searchText}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (!searchText && categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?category_id=${categoryId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (searchText && categoryId) {
      const response = await apiFetch(
        `${BASE_URL}/api/products?searchText=${searchText}&category_id=${categoryId}`
      );
      data = await response.json();
    }
  }

  return isCount
    ? data.total_pages || data.count
    : data.data && data.data.length > 0
    ? data.data
    : data.rows && data.rows.length > 0
    ? data.rows
    : [];
};
