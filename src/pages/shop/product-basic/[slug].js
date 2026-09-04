import { useEffect } from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LayoutTwo } from "../../../components/Layout";
import { getDiscountPrice } from "../../../lib/product";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import {
  ImageGalleryBottomThumb,
  ProductDescription,
  ProductDescriptionTab
} from "../../../components/ProductDetails";
import { addToCart } from "../../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist
} from "../../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare
} from "../../../redux/actions/compareActions";
import products from "../../../data/products.json";
import {  useFetchSingleProduct } from '../../../hooks/products';
import withAuth from '../../../hoc/withAuth';

const ProductBasic = ({
  cartItems,
  wishlistItems,
  compareItems,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare
}) => {
  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  const { addToast } = useToasts();
  const router = useRouter();
  const {slug} = router.query;
  const {data: product, status} = useFetchSingleProduct({productId: slug});
  const discountedPrice = getDiscountPrice(
    product?.price,
    product?.discount
  )?.toFixed(2);

  const productPrice = product?.price?.toFixed(2);
  const cartItem = cartItems?.filter(
    (cartItem) => cartItem?.id === product?.id
  )[0];
  const wishlistItem = wishlistItems.filter(
    (wishlistItem) => wishlistItem?.id === product?.id
  )[0];
  const compareItem = compareItems.filter(
    (compareItem) => compareItem?.id === product?.id
  )[0];
  /* working here 
  const getSupplierDetails = async (id) => {
    try {
      console.log("getting supplier details :", id.id);
      const response = await axios.get(
        `${process.env.API_URL}/user/user-data/${id?.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const data = await response.data;
      console.log("return data : ", data.data.companyName);
      return data.data.companyName;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: supplier} = getSupplierDetails({
    id: product?.supplier_id
  });

  console.log("supplier here ", supplier?.companyName);

  */



  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle= "&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link
              href="/shop/left-sidebar"
              as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
            >
              <a>Shop</a>
            </Link>
          </li>
        </ul>
      </BreadcrumbOne>

      {/* product details */}
      <div className="product-details space-mt--r100 space-mb--r100">
        <Container>
          <Row>
            <Col lg={6} className="space-mb-mobile-only--50">
              {/* image gallery bottom thumb */}
              <ImageGalleryBottomThumb
                product={product}
                wishlistItem={wishlistItem}
                addToast={addToast}
                deleteFromWishlist={deleteFromWishlist}
              />
            </Col>

            <Col lg={6}>
              {/* product description */}
              <ProductDescription
                product={product}
                productPrice={product?.price_tier_1}
                discountedPrice={discountedPrice}
                cartItems={cartItems}
                cartItem={cartItem}
                wishlistItem={wishlistItem}
                compareItem={compareItem}
                addToast={addToast}
                addToCart={addToCart}
                deleteFromWishlist={deleteFromWishlist}
                addToCompare={addToCompare}
                deleteFromCompare={deleteFromCompare}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {/* product description tab */}
              <ProductDescriptionTab product={product} />
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
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
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    deleteFromWishlist: (item, addToast) => {
      dispatch(deleteFromWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
    deleteFromCompare: (item, addToast) => {
      dispatch(deleteFromCompare(item, addToast));
    }
  };
};

// The product API needs a login, so the page asks for one instead of
// rendering an empty product.
export default withAuth(connect(mapStateToProps, mapDispatchToProps)(ProductBasic));

