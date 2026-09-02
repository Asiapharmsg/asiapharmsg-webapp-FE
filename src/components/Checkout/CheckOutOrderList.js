import Link from 'next/link';
import { Card, Badge } from 'react-bootstrap';

import { connect } from 'react-redux';
import CustomScroll from 'react-custom-scroll';
import { IoIosClose } from 'react-icons/io';
import {
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  inputQuantity
} from '../../redux/actions/cartActions';
import { useToasts } from 'react-toast-notifications';
import React from 'react';
const CheckOutOrderList = ({
  cartItems,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  inputQuantity
}) => {
  let cartTotalPrice = 0;
  const { addToast } = useToasts();
  return (
    <Card className="cart-card" body>
      <div className="cart-overlay__content-container cart-card">
        <h3 className="cart-title">Your Order</h3>
        {cartItems.length >= 1 ? (
          <div className="cart-product-wrapper">
            <div className="cart-product-container">
              <CustomScroll allowOuterScroll={true}>
                {cartItems.map((product, i) => {
                  cartTotalPrice += product?.price_tier_1 * product.quantity;
                  return (
                    <div className="d-flex single-cart-product" key={i}>
                      <div className="mr-auto p-2 product">
                        <span className="cart-close-icon">
                          <button
                            onClick={() => deleteFromCart(product, addToast)}
                          >
                            <IoIosClose />
                          </button>
                        </span>
                        <div className="image">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                            as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.id}`}
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
                              href={`/shop/product-basic/[slug]?slug=${product?.id}`}
                              as={`${process.env.PUBLIC_URL}/shop/product-basic/${product?.id}`}
                            >
                              <a>{product?.name}</a>
                            </Link>
                          </h5>
                          <p>
                            <span className="cart-count">
                              {product?.quantity} x{' '}
                            </span>{' '}
                            <span className="discounted-price">
                              ${product?.price_tier_1}
                            </span>
                          </p>
                        </div>

                        <div className="cart-plus-minus  d-flex">
                          <button
                            onClick={() => decreaseQuantity(product, null)}
                            className="qtybutton"
                          >
                            -
                          </button>
                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={product?.quantity}
                            onChange={(e) => {
                              const userInput = Number(e.target.value);
                              if (userInput.toString() !== 'NaN') {
                                product.quantity = userInput;
                                inputQuantity(product, addToast);
                              }
                            }}
                          />
                          <button
                            onClick={() => increaseQuantity(product, null)}
                            className="qtybutton"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CustomScroll>
            </div>
            <p className="cart-subtotal">
              <span className="subtotal-title">Subtotal:</span>
              <span className="subtotal-amount">
                ${cartTotalPrice?.toFixed(2)}
              </span>
            </p>
            <div className="cart-buttons"></div>
            <p className="free-shipping-text">
              Free delivery for orders above $250 unless stated otherwise.
              <br />
              <br />
              Please check individual products if there is a minimum order for
              free delivery.
              <br />
              <br />
              If it is not stated, the products will be considered part of the
              minimum order of $250 for free delivery
            </p>
          </div>
        ) : (
          'No items found in cart'
        )}
      </div>
    </Card>
  );
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    decreaseQuantity: (item, addToast) => {
      dispatch(decreaseQuantity(item, addToast));
    },
    increaseQuantity: (item, addToast) => {
      dispatch(increaseQuantity(item, addToast));
    },
    inputQuantity: (item, addToast) => {
      dispatch(inputQuantity(item, addToast));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CheckOutOrderList);
