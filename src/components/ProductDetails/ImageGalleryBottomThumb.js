import { Fragment, useEffect, useState, useRef } from "react";
import Swiper from "react-id-swiper";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdExpand,
  IoIosHeartEmpty,
} from "react-icons/io";
import { Tooltip } from "react-tippy";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageGalleryBottomThumb = ({
  product,
  wishlistItem,
  addToast,
  addToWishlist,
  deleteFromWishlist,
}) => {
  const slideRef = useRef(null);
  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [viewImg, setViewImg] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [settings, setSettings] = useState({
    dots: false,
    className: "slider variable-width",
    centerMode: true,
    infinite: true,
    speed: 500,
    rows: 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true
  });

  useEffect(() => {
    const sliderImages = [];

    if (product) {
      product.image && sliderImages.push(product.image);
      product.sub_image1 && sliderImages.push(product.sub_image1);
      product.sub_image2 && sliderImages.push(product.sub_image2);
    }

    if (sliderImages.length > 0) {
      setViewImg(sliderImages[0]);
    }

    setSliders(sliderImages);
  }, [product]);

  // effect for swiper slider synchronize
  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const handleSelectImg = (image, index) => {
    slideRef.current.slickGoTo(index);
    setSlideIndex(index);
    setViewImg(image)

  }

  const handleAfterChange = (current) => {
    setViewImg(sliders[current])
  }

  return (
    <Fragment>
      <div className="product-large-image-wrapper space-mb--30">
        {/* floating badges */}
        <div className="product-large-image-wrapper__floating-badges">
          {product?.discount && product?.discount > 0 ? (
            <span className="onsale">-{product?.discount}%</span>
          ) : (
            ""
          )}
          {product?.new ? <span className="hot">New</span> : ""}
          {product?.stock === 0 ? (
            <span className="out-of-stock">out</span>
          ) : (
            ""
          )}
        </div>
        
        <div className="viewProductImg">
          {
            viewImg && <img alt='' src={viewImg} />
          }
        </div>
      </div>

      <div className="viewSmallSlider">
        <Slider ref={slideRef} {...settings} afterChange={handleAfterChange}>
          {sliders.length > 0 && sliders.map(
              (image, i) => {
                return (
                  <div key={i} className="sliderItem"  style={{ width: "135px !important" }} 
                  // onClick={() => handleSelectImg(image, i)}
                  >
                    <div className="single-image">
                      <img src={image} className="img-fluid" alt="" />
                    </div>
                  </div>
                );
              }
            )}
        </Slider>
      </div>
    </Fragment>
  );
};

export default ImageGalleryBottomThumb;
