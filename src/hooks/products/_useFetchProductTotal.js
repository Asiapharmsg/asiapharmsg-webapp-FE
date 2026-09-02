import { useQuery } from 'react-query';
import { BASE_URL } from '../../utils';
import moment from 'moment';

export default function useFetchProductTotal(options) {
  const searchText = options?.searchText;
  const categoryId = options?.categoryId;
  const supplierId = options?.supplierId;
  const perPage = options?.perPage;
  const curPage = options?.currentPage;
console.log(options);
  return useQuery(['products', searchText, categoryId, supplierId, curPage, perPage], () =>
    fetchProduct(searchText, categoryId, supplierId, curPage, perPage)
  );
}


const fetchProduct = async (searchText, categoryId, supplierId, curPage, perPage) => {
  console.log('fetch product 1:', supplierId);
  var result = [];
  var data;
  if (supplierId) {
    //fecth products by supplier
    if (!searchText && !categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (searchText && !categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?searchText=${searchText}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (!searchText && categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?category_id=${categoryId}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (searchText && categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?searchText=${searchText}&category_id=${categoryId}&supplier_id=${supplierId}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    }
  } else {
    if (!searchText && !categoryId) {
      const response = await fetch(`${BASE_URL}/api/products?page=${curPage}&page_size=${perPage}`);
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
      const response = await fetch(
        `${BASE_URL}/api/products?searchText=${searchText}&page=${curPage}&page_size=${perPage}`
      );
      data = await response.json();
    } else if (!searchText && categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?category_id=${categoryId}`
      );
      data = await response.json();
    } else if (searchText && categoryId) {
      const response = await fetch(
        `${BASE_URL}/api/products?searchText=${searchText}&category_id=${categoryId}`
      );
      data = await response.json();
    }
  }
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
    const now = moment();
    const exp = moment(item.expiry_date);
    const check = now.isAfter(exp);
    // if (!check) {
      result.push(item);
    // }
  }
  return result;
};


