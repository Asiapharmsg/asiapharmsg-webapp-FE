import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../components/Layout";
import { HeroSliderSix } from "../components/HeroSlider";
import { CategoryGridFour } from "../components/Category";
import { getProducts } from "../lib/product";
import { SectionTitleOne } from "../components/SectionTitle";
import { BrandLogoTwo } from "../components/BrandLogo";
import { ImageCtaFour } from "../components/Cta";
import { TestimonialOne } from "../components/Testimonial";
import { CountdownTimerThree } from "../components/Countdown";
import heroSliderData from "../data/hero-sliders/hero-slider-six.json";
import testimonialOneData from "../data/testimonials/testimonial-one.json";
import brandLogoData from "../data/brand-logos/brand-logo-one.json";

const Home = ({ products }) => {
  return (
    <LayoutTwo aboutOverlay={false}>
      {/* hero slider */}
      <HeroSliderSix sliderData={heroSliderData} />
      <div className="space-mb--r100"></div>

      {/* category grid */}
      <div className="section-title-container">
        <Container>
          <Row>
            <div className="col-lg-12">
              <SectionTitleOne title="One Stop Medical Platform" />
            </div>
          </Row>
        </Container>
      </div>
      <CategoryGridFour spaceBottomClass="space-mb--r100" />

      {/* countdown */}
      {/*
      <CountdownTimerThree
        title="Deal of the day"
        image="/assets/images/countdown/countdown-3.png"
        dateTime="April 22, 2022 12:12:00"
        url="/shop/left-sidebar"
        buttonText="SHOP NOW"
        spaceBottomClass="space-mb--r100"
        containerType="normal"
      />
      */}

      {/* testimonial */}
      {/*
      <TestimonialOne
        testimonialData={testimonialOneData}
        spaceBottomClass="space-mb--r100"
      />
      */}
      {/* cta */}
      <ImageCtaFour />

      {/* brand logo */}
      <BrandLogoTwo brandLogoData={brandLogoData} />
    </LayoutTwo>
  );
};

// export default Home;

const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "furniture", "popular", 10)
  };
};


export default connect(mapStateToProps)(Home);

