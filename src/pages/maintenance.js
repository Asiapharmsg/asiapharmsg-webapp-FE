import { Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HeaderTwo } from '../components/Header';

const Maintenance = () => {
  return (
    <Fragment>
      <HeaderTwo />
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="nothing-found-content">
              <img
                src="/assets/images/maintenance/main.png"
                style={{
                  display: 'table',
                  maxWidth: '100%',
                  maxHeight: '250px',
                  margin: '0 auto 30px auto'
                }}
              />
              <h1 className="space-mb--50 text-center">
                Our Website is under Maintenance!
              </h1>
              <p className="direction-page text-center">
                This page is undergoing maintenance and will be back soon.
                <br />
                <br />
                If you have any enquiries, feel free to email us at&nbsp;
                <a href="mailto:support@asiapharmsg.com">
                  support@asiapharmsg.com
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Maintenance;
