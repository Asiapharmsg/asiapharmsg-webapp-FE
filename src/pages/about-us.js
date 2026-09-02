import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import ModalVideo from "react-modal-video";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import { SectionTitleOne } from "../components/SectionTitle";
import { TestimonialTwo } from "../components/Testimonial";
import testimonialTwoData from "../data/testimonials/testimonial-two.json";

const AboutTwo = () => {
  const [modalStatus, isOpen] = useState(false);
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        
      </BreadcrumbOne>
      <div className="about-page-wrapper space-mt--r130 space-mb--r130">
        {/* primary content */}
        <div className="about-content space-mb--r100">
          <Container className="wide">
            <SectionTitleOne
              title="Our Vision and Mission"
              
            />
            <Row>
              <Col xl={6} lg={6}>
                <div className="about-page-2-image space-mb-mobile-only--50">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/backgrounds/about-bg.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </Col>
              <Col xl={5} lg={6} className="ml-auto">
                <div className="about-page-text space-mb--30 mt-0">
                  <p>
                    AsiaPharmSG is a One-Stop Digital Platform that aggregates curated 
                    medical products from vendors to provide medical clinics and consumers 
                    with easy access to a wide range of competitively priced pharmaceutical 
                    products.
                  </p>
                  <p>
                    Our mission is to provide our vendors and consumers with a credible, 
                    stable and efficient pharmaceutical product platform that is interconnected 
                    with the medical industry's ecosystem.
                  </p>
                  <p>
                    Guided by our three core principles of Convenient Access, Reliability and 
                    Competitive Pricing, AsiaPharmSG aims to help vendors reach out to a large 
                    professional and lay audience base, and assure consumers of the high safety 
                    standards of the products listed.
                  </p>
                  <p>
                    Our vendor and product range are continually updated, and prices refreshed regularly, 
                    to ensure that our clinics and consumers are able to constantly access the latest product 
                    offerings available.
                  </p>
                  <p>
                    All therapeutic pharmaceutical products listed on this platform are from HSA-licenced entities.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        
        {/* testimonial */}
        {/*
        <TestimonialTwo
          testimonialData={testimonialTwoData}
          backgroundImage="/assets/images/backgrounds/testimonials-bg.png"
        />
        <div className="space-mb--r100"></div>
        */}
        {/*}
        <div className="about-page-content">
          <Container>
            <Row>
              <Col md={6} className="space-mb-mobile-only--50">
              
                <div className="about-single-block">
                  <p className="subtitle">On at oders over $99</p>
                  <h1>Free shipping &amp; return</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link
                    href="/other/about"
                    as={process.env.PUBLIC_URL + "/other/about"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
              <Col md={6}>
                
                <div className="about-single-block">
                  <p className="subtitle">Support 24/7</p>
                  <h1>Money back</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur cing elit. Suspe
                    ndisse suscipit sagittis leo sit met condimentum estibulum
                    issim Lorem ipsum dolor sit amet, consectetur cing elit.
                  </p>
                  <Link
                    href="/other/about"
                    as={process.env.PUBLIC_URL + "/other/about"}
                  >
                    <a>LEARN MORE</a>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        */}
      </div>
    </LayoutTwo>
  );
};

export default AboutTwo;
