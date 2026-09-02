import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosPin, IoIosCall, IoIosMail, IoIosClock } from "react-icons/io";
import { LayoutTwo } from "../components/Layout";
import { BreadcrumbOne } from "../components/Breadcrumb";
import {
  SectionTitleOne,
  SectionTitleTwo
} from "../components/SectionTitle";
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useToasts } from "react-toast-notifications";

const Contact = () => {
  const { addToast } = useToasts();
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, form.current, process.env.EMAILJS_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          //window.location.reload(false);
          addToast("Email sent successfully !", { appearance: "success", autoDismiss: true});
      }, (error) => {
          console.log(error.text);
          addToast(`${error.text}`, {
            appearance: "error",
            autoDismiss: true,
          });
      });
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-3.png"
      >
       
      </BreadcrumbOne>
      <div className="contact-page-content-wrapper space-mt--r130 space-mb--r130">
        <div className="contact-page-top-info space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleTwo
                  title="Connect with us now!"
                  subtitle="COME HAVE A LOOK"
                />
              </Col>
            </Row>
            <Row className="space-mb-mobile-only--m50">
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosPin />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">ADDRESS</h3>
                    <p className="content">
                      2 Kallang Pudding Rd #06-14, Singapore 349307 
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosCall />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">CONTACT</h3>
                    <p className="content">
                      TEL: (+65) – 6547 – 8077{""}
                      <br/>
                      FAX: (+65) – 6547 – 8078{" "}
                    </p>
                  </div>
                </div>
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosMail />
                  </div>
                  <div className="icon-box__content">
                    <p className="content"> Mail: marketing@asiapharmsg.com</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="space-mb-mobile-only--50">
                <div className="icon-box">
                  <div className="icon-box__icon">
                    <IoIosClock />
                  </div>
                  <div className="icon-box__content">
                    <h3 className="title">HOURS OF OPERATION</h3>
                    <p className="content">
                      Monday – Friday : 09:00 – 17:00
                      
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="contact-page-map space-mb--r100">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="google-map">
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7437657778705!2d103.87442311567307!3d1.3297960990301207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da171562bfd375%3A0xe169f2aedd36121f!2sMactech%20Building!5e0!3m2!1sen!2ssg!4v1649522000171!5m2!1sen!2ssg"
                    allowFullScreen
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="contact-page-form">
          <Container>
            <Row>
              <Col lg={12}>
                <SectionTitleOne title="Get in touch" />
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="ml-auto mr-auto">
                <div className="lezada-form contact-form">
                  <form ref={form}>
                    <Row>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="text"
                          placeholder="First Name *"
                          name="first_name"
                          id="first_name"
                          required
                        />
                      </Col>
                      <Col md={6} className="space-mb--40">
                        <input
                          type="email"
                          placeholder="Email *"
                          name="email"
                          id="email"
                          required
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <input
                          type="text"
                          placeholder="Subject"
                          name="subject"
                          id="subject"
                        />
                      </Col>
                      <Col md={12} className="space-mb--40">
                        <textarea
                          cols={30}
                          rows={10}
                          placeholder="Message"
                          name="message"
                          id="message"
                          defaultValue={""}
                        />
                      </Col>
                      <Col md={12} className="text-center">
                        <button
                          type="submit"
                          value="submit"
                          id="submit"
                          className="lezada-button lezada-button--medium"
                          onClick={sendEmail}
                        >
                          submit
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default Contact;
