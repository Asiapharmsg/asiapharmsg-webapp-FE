import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

const ImageCtaFour = () => {
  return (
    <div
      className="banner-cta space-mb--r130 bg-img"
      style={{
        backgroundImage: `url("${
          process.env.PUBLIC_URL + '/assets/images/backgrounds/cta-bg.jpg'
        }")`
      }}
    >
      {/*
      <Container className="wide">
        <Row>
          <Col lg={7} xl={5}>
            <div className="banner-cta-content">
              <h2 className="banner-cta-content__subtitle" className="p-3 mb-2 bg-secondary text-white">
                A credible, stable and efficient pharmaceutical product platform.
              </h2>
              
            </div>
          </Col>
        </Row>
      </Container>
      */}
    </div>
  );
};

export default ImageCtaFour;
