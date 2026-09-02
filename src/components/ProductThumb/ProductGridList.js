import { Fragment, useState } from 'react';
import { Col } from 'react-bootstrap';
import Link from 'next/link';
import { IoIosHeartEmpty, IoIosShuffle, IoIosSearch } from 'react-icons/io';
import { Tooltip } from 'react-tippy';
import ProductModal from './ProductModal';
import { getStockCount, getProductStatus } from '../../utils';
import dayjs from 'dayjs';

const ProductGridList = ({
  product,
  discountedPrice,
  productPrice,
  cartItem,
  wishlistItem,
  compareItem,
  bottomSpace,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare,
  addToast,
  cartItems
}) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <Col lg={3} xs={6} className={bottomSpace ? bottomSpace : ''}>
        <div className="product-grid">
          {/*=======  single product image  =======*/}
          <div className="product-grid__image">
            <Link
              href={`/shop/product-basic/[slug]?slug=${product?.id}`}
              as={process.env.PUBLIC_URL + '/shop/product-basic/' + product?.id}
            >
              <a className="image-wrap">
                <img
                  src={product?.image}
                  className="img-fluid"
                  alt={product?.name}
                />
                {product?.thumbImage?.length > 1 ? (
                  <img
                    src={process.env.PUBLIC_URL + product?.thumbImage?.[1]}
                    className="img-fluid"
                    alt={product?.name}
                  />
                ) : (
                  ''
                )}
              </a>
            </Link>
            <div className="product-grid__floating-badges">
              {product?.discount && product?.discount > 0 ? (
                <span className="onsale">-{product?.discount}%</span>
              ) : (
                ''
              )}
              {product?.new ? <span className="hot">New</span> : ''}
              {product?.stock === 0 ? (
                <span className="out-of-stock">out</span>
              ) : (
                ''
              )}
            </div>
            <div className="product-grid__floating-icons">
              {/* Add to wishlist */}
              <Tooltip
                title={
                  wishlistItem !== undefined
                    ? 'Added to wishlist'
                    : 'Add to wishlist'
                }
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={() => {
                    if (wishlistItem == undefined) {
                      addToWishlist(product, addToast);
                    }
                  }}
                >
                  <IoIosHeartEmpty />
                </button>
              </Tooltip>

              {/* add to compare */}
              {/*
              <Tooltip
                title={
                  compareItem !== undefined
                    ? 'Added to compare'
                    : 'Add to compare'
                }
                position='left'
                trigger='mouseenter'
                animation='shift'
                arrow={true}
                duration={200}
              >
                <button
                  onClick={
                    
                    compareItem !== undefined
                      ? () => deleteFromCompare(product, addToast)
                      : () => addToCompare(product, addToast)
                  }
                  className={compareItem !== undefined ? 'active' : ''}
                >
                  <IoIosShuffle />
                /button>
              </Tooltip>
              */}
              {/* quick view */}
              <Tooltip
                title="Quick view"
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={() => setModalShow(true)}
                  className="d-none d-lg-block"
                >
                  <IoIosSearch />
                </button>
              </Tooltip>
            </div>
          </div>

          {/*=======  single product content  =======*/}
          <div className="product-grid__content">
            <div className="title">
              <h3>
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                  as={
                    process.env.PUBLIC_URL +
                    '/shop/product-basic/' +
                    product?.id
                  }
                >
                  <a>{product?.name}</a>
                </Link>
              </h3>
              {/* add to cart */}
              <button disabled>
                {getStockCount(product?.inventory_count)}
                {/* Change +Available */}
              </button>
            </div>
            <div className="price">
              {product?.discount > 0 ? (
                <Fragment>
                  <span className="main-price discounted">${productPrice}</span>
                  <span className="discounted-price">${discountedPrice}</span>
                </Fragment>
              ) : (
                <span className="main-price">${product?.price_tier_1}</span>
              )}
            </div>
            <div className="price">
              <span className="main-price">
                Expiry Date :{' '}
                {dayjs(product?.expiry_date).format('MMM D, YYYY')}
              </span>
            </div>
          </div>
        </div>

        <div className="product-list">
          {/*=======  single product image  =======*/}

          <div className="product-list__image">
            <Link
              href={`/shop/product-basic/[slug]?slug=${product?.id}`}
              as={process.env.PUBLIC_URL + '/shop/product-basic/' + product?.id}
            >
              <a className="image-wrap">
                <img
                  src={product?.image}
                  className="img-fluid"
                  alt={product?.name}
                />
                {product?.thumbImage?.length > 1 ? (
                  <img
                    src={process.env.PUBLIC_URL + product?.thumbImage?.[1]}
                    className="img-fluid"
                    alt={product?.name}
                  />
                ) : (
                  ''
                )}
              </a>
            </Link>
            <div className="product-list__floating-badges">
              {product?.discount && product?.discount > 0 ? (
                <span className="onsale">-{product?.discount}%</span>
              ) : (
                ''
              )}
              {product?.new ? <span className="hot">New</span> : ''}
              {product?.stock === 0 ? (
                <span className="out-of-stock">out</span>
              ) : (
                ''
              )}
            </div>
            <div className="product-list__floating-icons">
              {/* add to wishlist */}
              <Tooltip
                title={
                  wishlistItem !== undefined
                    ? 'Added to wishlist'
                    : 'Add to wishlist'
                }
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <IoIosHeartEmpty />
              </Tooltip>
              // add to compare
              <Tooltip
                title={
                  compareItem !== undefined
                    ? 'Added to compare'
                    : 'Add to compare'
                }
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <IoIosShuffle />
              </Tooltip>
              // quick view
              <Tooltip
                title="Quick view"
                position="left"
                trigger="mouseenter"
                animation="shift"
                arrow={true}
                duration={200}
              >
                <button
                  onClick={() => setModalShow(true)}
                  className="d-none d-lg-block"
                >
                  <IoIosSearch />
                </button>
              </Tooltip>
            </div>
          </div>

          {/*=======  single product content  =======*/}

          <div className="product-list__content">
            <div className="title">
              <h3>
                <Link
                  href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                  as={
                    process.env.PUBLIC_URL +
                    '/shop/product-basic/' +
                    product?.id
                  }
                >
                  <a>{product?.name}</a>
                </Link>
              </h3>
            </div>
            <div className="price">
              {product?.discount > 0 ? (
                <Fragment>
                  <span className="main-price discounted">${productPrice}</span>
                  <span className="discounted-price">${discountedPrice}</span>
                </Fragment>
              ) : (
                <span className="main-price">${product?.price_tier_1}</span>
              )}
            </div>

            <div className="short-description">{product?.description}</div>
            <div className="add-to-cart">
              {/* add to cart */}

              <button disabled className="lezada-button lezada-button--medium">
                {getStockCount(product?.inventory_count)}
              </button>
            </div>
          </div>
        </div>
      </Col>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        discountedprice={discountedPrice}
        productprice={productPrice}
        cartitems={cartItems}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        deletefromwishlist={deleteFromWishlist}
        addtocompare={addToCompare}
        deletefromcompare={deleteFromCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

export default ProductGridList;
