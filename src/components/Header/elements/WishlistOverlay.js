import React, { useEffect } from 'react';
import Link from 'next/link';
import { IoIosClose } from 'react-icons/io';
import CustomScroll from 'react-custom-scroll';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { getProductCartQuantity } from '../../../lib/product';
import { deleteFromWishlist } from '../../../redux/actions/wishlistActions';
import { getStockCount } from '../../../utils';
import { addToCart } from '../../../redux/actions/cartActions';

const WishlistOverlay = ({
  activeStatus,
  getActiveStatus,
  wishlistItems,
  deleteFromWishlist,
  cartItems,
  addToCart
}) => {
  const [quantityCount, setQuantityCount] = React.useState(
    wishlistItems.map((product) => ({ id: product.id, qty: 1 }))
  );
  const { addToast } = useToasts();

  const quantityCountHandler = (type, id, total) => {
    const updatedQuantityCount = quantityCount.slice();
    const itemIdx = quantityCount.findIndex((p) => p.id === id);
    const item = quantityCount[itemIdx];
    if (type === 'increment') {
      item.qty += 1;
    } else if (type === 'decrement') {
      item.qty = item.qty === 0 ? 0 : item.qty - 1;
    } else {
      item.qty = total;
    }
    updatedQuantityCount[itemIdx] = item;
    setQuantityCount(updatedQuantityCount);
  };

  useEffect(() => {
    setQuantityCount(
      wishlistItems.map((product) => ({ id: product.id, qty: 1 }))
    );
  }, [wishlistItems.length]);

  return (
    <div className={`wishlist-overlay ${activeStatus ? 'active' : ''}`}>
      <div
        className="wishlist-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector('body').classList.remove('overflow-hidden');
        }}
      />
      <div className="wishlist-overlay__content">
        {/*=======  close icon  =======*/}
        <button
          className="wishlist-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector('body').classList.remove('overflow-hidden');
          }}
        >
          <IoIosClose />
        </button>
        {/*=======  offcanvas wishlist content container  =======*/}
        <div className="wishlist-overlay__content-container">
          <h3 className="wishlist-title">Wishlist</h3>
          {wishlistItems.length >= 1 ? (
            <div className="wishlist-product-wrapper">
              <div className="wishlist-product-container">
                <CustomScroll allowOuterScroll={true}>
                  {wishlistItems.map((product, i) => {
                    const productCartQty = getProductCartQuantity(
                      cartItems,
                      product,
                      null,
                      null
                    );
                    return (
                      <div className="single-wishlist-product" key={i}>
                        <span className="wishlist-close-icon">
                          <button
                            onClick={() =>
                              deleteFromWishlist(product, addToast)
                            }
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product.id}`}
                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.id}`}
                          >
                            <a>
                              <img
                                src={process.env.PUBLIC_URL + product.image}
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="content">
                          <h5>
                            <Link
                              href={`/shop/product-basic/[slug]?slug=${product.id}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product.id}`}
                            >
                              <a>{product.name}</a>
                            </Link>
                          </h5>

                          <div className="cart-plus-minus mb-1">
                            <button
                              onClick={() => {
                                quantityCountHandler(
                                  'decrement',
                                  product.id,
                                  0
                                );
                              }}
                              className="qtybutton"
                            >
                              -
                            </button>
                            <input
                              className="cart-plus-minus-box"
                              type="text"
                              value={
                                quantityCount.filter(
                                  (p) => p.id === product.id
                                )[0]?.qty
                              }
                              onChange={(e) => {
                                const userInput = Number(e.target.value);
                                if (userInput.toString() !== 'NaN') {
                                  quantityCountHandler(
                                    'overwrite',
                                    product.id,
                                    userInput
                                  );
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                quantityCountHandler(
                                  'increment',
                                  product.id,
                                  0
                                );
                              }}
                              className="qtybutton"
                            >
                              +
                            </button>
                          </div>
                          <div className="product-content__button-wrapper d-flex align-items-center">
                            {product?.inventory_count != 0 ? (
                              <button
                                onClick={() => {
                                  addToCart(
                                    product,
                                    addToast,
                                    quantityCount.filter(
                                      (p) => p.id === product.id
                                    )[0]?.qty,
                                    null,
                                    null
                                  );
                                }}
                                disabled={
                                  productCartQty >= product.inventory_count
                                }
                                className="lezada-button lezada-button--small wishlist-content__cart space-mr--10"
                              >
                                Add To Cart
                              </button>
                            ) : (
                              <button
                                className="lezada-button lezada-button--medium product-content__ofs space-mr--10"
                                disabled
                              >
                                {getStockCount(product?.inventory_count)}
                              </button>
                            )}
                          </div>

                          {/* <p>
                            <span className="discounted-price">
                              ${discountedPrice}
                            </span>
                          </p> */}
                        </div>
                      </div>
                    );
                  })}
                </CustomScroll>
              </div>
              {/*=======  wishlist buttons  =======*/}
              {/*
              <div className="wishlist-buttons">
                <Link
                  href="/other/wishlist"
                  as={process.env.PUBLIC_URL + '/other/wishlist'}
                >
                  <a>view wishlist</a>
                </Link>
              </div>
              */}
            </div>
          ) : (
            'No items found in wishlist'
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    deleteFromWishlist: (item, addToast) => {
      dispatch(deleteFromWishlist(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistOverlay);
