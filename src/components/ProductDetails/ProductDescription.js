import { useState, Fragment } from 'react';
import { IoIosHeartEmpty, IoIosShuffle } from 'react-icons/io';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { ProductRating } from '../Product';
import { getProductCartQuantity } from '../../lib/product';
import { getStockCount, getProductStatus } from '../../utils';
import { useFetchCategoriesById } from '../../hooks/category';
import { getUnitMeasurement } from '../../utils';
import dayjs from 'dayjs';

const ProductDescription = ({
  product,
  productPrice,
  discountedPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product?.variation ? product?.variation?.[0]?.color : ''
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product?.variation ? product?.variation?.[0]?.size[0]?.name : ''
  );
  const [productStock, setProductStock] = useState(
    product?.variation ? product.variation[0].size[0].stock : product?.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const [categoryName, setCategoryName] = useState(null);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const getCategoryName = (id) => {
    const { data: cat } = useFetchCategoriesById(product?.category_id);

    console.log('return data : ', cat.name);
    return cat.name;
  };

  return (
    <div className="product-content">
      {product?.rating && product?.rating > 0 ? (
        <div className="product-content__rating-wrap d-block d-sm-flex space-mb--20">
          <div className="product-content__rating space-mr--20">
            <ProductRating ratingValue={product?.rating} />
          </div>
          <div className="product-content__rating-count">
            <a href="#">( {product.ratingCount} customer reviews )</a>
          </div>
        </div>
      ) : (
        ''
      )}
      <h2 className="product-content__title space-mb--20">{product?.name}</h2>
      <div className="product-content__price space-mb--20">
        {product?.discount > 0 ? (
          <Fragment>
            <span className="main-price discounted">${productPrice}</span>
            <span className="main-price">${discountedPrice}</span>
          </Fragment>
        ) : (
          <span className="main-price">
            ${productPrice} / {getUnitMeasurement(product?.unit_measurement)}
          </span>
        )}
      </div>
      <div className="product-content__description space-mb--30">
        <p>{product?.description}</p>
        <p>Expiry Date : {dayjs(product?.expiry_date).format('MMM D, YYYY')}</p>
      </div>

      {product?.variation ? (
        <div className="product-content__size-color">
          <div className="product-content__size space-mb--20">
            <div className="product-content__size__title">Size</div>
            <div className="product-content__size__content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, i) => {
                        return (
                          <Fragment key={i}>
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? 'checked'
                                  : ''
                              }
                              id={singleSize.name}
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <label htmlFor={singleSize.name}>
                              {singleSize.name}
                            </label>
                          </Fragment>
                        );
                      })
                    : '';
                })}
            </div>
          </div>
          <div className="product-content__color space-mb--20">
            <div className="product-content__color__title">Color</div>
            <div className="product-content__color__content">
              {product?.variation.map((single, i) => {
                return (
                  <Fragment key={i}>
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      id={single.color}
                      checked={
                        single.color === selectedProductColor ? 'checked' : ''
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <label
                      htmlFor={single.color}
                      style={{ backgroundColor: single.colorCode }}
                    ></label>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {product?.affiliateLink ? (
        <div className="product-content__quality">
          <div className="product-content__cart btn-hover">
            <a
              href={product?.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
              className="lezada-button lezada-button--medium"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="product-content__quantity space-mb--40">
            <div className="product-content__quantity__title">Quantity</div>
            <div className="cart-plus-minus">
              <button
                onClick={() =>
                  setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
                }
                className="qtybutton"
              >
                -
              </button>
              <input
                className="cart-plus-minus-box"
                type="text"
                value={quantityCount}
                onChange={(e) => {
                  const userInput = Number(e.target.value);
                  if (userInput.toString() !== 'NaN') {
                    setQuantityCount(userInput);
                  }
                }}
              />
              <button
                onClick={() => setQuantityCount(quantityCount + 1)}
                className="qtybutton"
              >
                +
              </button>
            </div>
          </div>
          <div className="product-content__quantity space-mb--40">
            <div className="product-content__quantity__title">Remarks</div>
            <div> {product?.remarks} </div>
          </div>

          <div className="product-content__button-wrapper d-flex align-items-center">
            {product?.inventory_count != 0 ? (
              <button
                onClick={() =>
                  addToCart(
                    product,
                    addToast,
                    quantityCount,
                    selectedProductColor,
                    selectedProductSize
                  )
                }
                disabled={productCartQty >= productStock}
                className="lezada-button lezada-button--medium product-content__cart space-mr--10"
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

          <div className="product-content__other-info space-mt--50">
            <table>
              <tbody>
                <tr className="single-info">
                  <td className="title">SKU: </td>
                  <td className="value">{product?.id}</td>
                </tr>
                <tr className="single-info">
                  <td className="title">Categories: </td>
                  <td className="value">{product?.category_id}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProductDescription;
