import { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import Link from 'next/link';
import { Container, Row, Col, Pagination, Dropdown } from 'react-bootstrap';
import Paginator from 'react-hooks-paginator';
import { SlideDown } from 'react-slidedown';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import { getSortedProducts } from '../../lib/product';
import {
  ShopHeader,
  ShopFilter,
  ShopSidebar,
  ShopProducts
} from '../../components/Shop';
import { useFetchProducts, useFetchProductTotal } from '../../hooks/products';
import { useFetchCategories } from '../../hooks/category';
import withAuth from '../../hoc/withAuth';
import { IoIosArrowDown } from 'react-icons/io';

const LeftSidebar = () => {
  const [layout, setLayout] = useState('grid four-column');
  const [sortType, setSortType] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [filterSortType, setFilterSortType] = useState('');
  const [filterSortValue, setFilterSortValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const user = useSelector((state) => state.user);

  const { data: products } = useFetchProducts({
    searchText,
    categoryId: sortValue?.id,
    supplierId: user.supplierId,
    currentPage,
    perPage,
    isCount: false
  });

  const { data: totalCount } = useFetchProducts({
    searchText,
    categoryId: sortValue?.id,
    supplierId: user.supplierId,
    currentPage,
    perPage,
    isCount: true
  });

  //const {data: products} = useFetchProducts({searchText, categoryId: sortValue?.id});
  const { data: categories } = useFetchCategories();
  //Test 2 of scroll restoration
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxPage, setMaxPage] = useState([]);
  const [rangePage, setRangePage] = useState([]);
  // console.log("this is the history of position : ", localStorage.scrollY);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    localStorage.setItem('scrollY', position);
  };

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  const handleItemsPerPage = (page) => {
    page = !page ? 1 : page;
    setCurrentPage(page);
  };

  const seperatePagiRange = (result, currentPage) => {
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(start + 5, result.length - 1);
    const cloneArray = [...result];
    setRangePage(cloneArray.slice(start, end + 1));
  };

  const initPagination = () => {
    const result = [];
    for (let i = 0; i < totalCount; i++) {
      result.push({ id: i });
    }
    setMaxPage(result);
    seperatePagiRange(result, currentPage);
  };

  useEffect(() => {
    initPagination();
  }, [products?.length, totalCount]);

  const handleCategoryClick = () => {
    setCurrentPage(1);
  };

  //Testing function of page restoration
  // useEffect(() => {
  //   // total products is 417
  //   // 417 / 10 = 42

  //   console.log('products length is ', products?.length);
  //   console.log('currentPage is ', currentPage);
  //   console.log('maxPage is ', maxPage?.length);
  //   console.log('totalCount is ', totalCount);
  //   console.log((currentPage - 1) * perPage + 1);
  // });

  /*useEffect(() => {
    function handleScrollYChange() {
      
      const lastScrollY = window.scrollY;
      //console.log("this is the last scroll", lastScrollY);
      if (lastScrollY) {
        localStorage.setItem("scrollY", lastScrollY);
      }
      console.log("this is localstorage ", localStorage.scrollY);
      
    }
      
    window.addEventListener("scroll", handleScrollYChange, true);
    return () => {
      console.log("No Listener to Remove.")
      window.removeEventListener("scroll", handleScrollYChange, false)
    }

    }, []);
*/

  useEffect(() => {
    window.scrollTo(0, localStorage.scrollY);
    // console.log("here :", localStorage.category);

    if (localStorage.category == '0' || localStorage.category == undefined) {
      // console.log("is 0....");
      getSortParams('category', '');
    } else {
      // console.log("is not 0....");
      const object1 = JSON.parse(localStorage.category);
      getSortParams('category', object1);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // End of testing

  // useEffect(() => {
  //   let sortedProducts = getSortedProducts(products, sortType, sortValue);
  //   const filterSortedProducts = getSortedProducts(
  //     sortedProducts,
  //     filterSortType,
  //     filterSortValue
  //   );
  //   sortedProducts = filterSortedProducts;
  //   setSortedProducts(sortedProducts);
  //   setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  // }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  const handlePagination = (actionTypeNumber, isFirstLast = false) => {
    const curPage = isFirstLast
      ? actionTypeNumber
      : currentPage + actionTypeNumber;
    setCurrentPage(curPage);
    seperatePagiRange(maxPage, curPage);
    handleItemsPerPage(curPage);
  };

  const changePerPage = (perPage = 10) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + '/'}>
              <a>Home</a>
            </Link>
          </li>

          <li>Shop</li>
        </ul>
      </BreadcrumbOne>
      <div className="shop-page-content">
        {/* shop page header */}
        {/*
        <ShopHeader
          getLayout={getLayout}
          getFilterSortParams={getFilterSortParams}
          productCount={products.length}
          sortedProductCount={currentData.length}
          shopTopFilterStatus={shopTopFilterStatus}
          setShopTopFilterStatus={setShopTopFilterStatus}
        />
        */}
        <ShopHeader
          getLayout={getLayout}
          getFilterSortParams={getFilterSortParams}
          productCount={totalCount}
          sortedProductCount={currentPage}
          shopTopFilterStatus={shopTopFilterStatus}
          setShopTopFilterStatus={setShopTopFilterStatus}
          listMode={false}
          onCategoryClick={handleCategoryClick}
        />

        {/* shop header filter */}
        {/*
        <SlideDown closed={shopTopFilterStatus ? false : true}>
          <ShopFilter products={products} getSortParams={getSortParams} />
        </SlideDown>
        */}

        {/*
        <SlideDown closed={shopTopFilterStatus ? false : true}>
          <ShopFilter products={products} getSortParams={getSortParams} categories={categories} />
        </SlideDown>
        */}

        {/* shop page body */}
        <div
          className="shop-page-content__body space-mt--r130 space-mb--r130"
          onScroll="handleScrollYChange()"
        >
          <Container>
            <Row>
              <Col
                lg={3}
                className="order-2 order-lg-1 space-mt-mobile-only--50"
              >
                {/* shop sidebar */}
                {/*
                <ShopSidebar
                  products={products}
                  getSortParams={getSortParams}
                />
                */}
                <ShopSidebar
                  products={products}
                  getSortParams={getSortParams}
                  searchText={searchText}
                  onChangeSearchText={(text) => setSearchText(text)}
                  onClickSearch={() => console.log('search clicked')}
                  categories={categories}
                  onCategoryClick={handleCategoryClick}
                />
              </Col>

              <Col lg={9} className="order-1 order-lg-2">
                {/* shop products */}
                {/*<ShopProducts layout={layout} products={currentData} />*/}
                <ShopProducts layout={layout} products={products} />

                {/* shop product pagination */}
                <div className="pro-pagination-style">
                  {/* <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  /> */}

                  {rangePage.length > 0 && (
                    <>
                      <Pagination>
                        <Pagination.First
                          disabled={currentPage == 1}
                          onClick={() => handlePagination(1, true)}
                        />
                        <Pagination.Prev
                          disabled={currentPage == 1}
                          onClick={() => handlePagination(-1, false)}
                        />

                        {rangePage.length > 0 &&
                          rangePage.map((value, index) => {
                            return (
                              <Pagination.Item
                                onClick={() => handleItemsPerPage(value.id + 1)}
                                key={value.id + 1}
                                active={currentPage == value.id + 1}
                              >
                                {value.id + 1}
                              </Pagination.Item>
                            );
                          })}

                        <Pagination.Next
                          disabled={currentPage == maxPage.length - 1}
                          onClick={() => handlePagination(1, false)}
                        />
                        <Pagination.Last
                          disabled={currentPage == maxPage.length}
                          onClick={() => handlePagination(maxPage.length, true)}
                        />
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <p>
                              {' '}
                              {perPage} items <IoIosArrowDown />
                            </p>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => changePerPage(10)}>
                              10
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => changePerPage(50)}>
                              50
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => changePerPage(100)}>
                              100
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Pagination>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.productData
  };
};

export default connect(mapStateToProps)(withAuth(LeftSidebar));
