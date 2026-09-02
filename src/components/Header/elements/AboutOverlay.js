import { Tooltip } from "react-tippy";
import { IoIosClose } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const AboutOverlay = ({ activeStatus, getActiveStatus }) => {
  return (
    <div className={`about-overlay ${activeStatus ? "active" : ""}`}>
      <div
        className="about-overlay__close"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      />
      <div className="about-overlay__content">
        <button
          className="about-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        <div className="about-overlay__content-container d-flex flex-column justify-content-between h-100">
          <div className="about-overlay__widget-wrapper">
            <div className="about-widget">
              <h2 className="about-widget__title">About Us</h2>
              <p>
                  AsiaPharmSG is a One-Stop Digital Platform that aggregates curated 
                  medical products from vendors to provide medical clinics and consumers 
                  with easy access to a wide range of competitively priced pharmaceutical 
                  products.
              </p>
            </div>
          </div>
          <div className="about-overlay__contact-widget">
            <p className="email">
              <a href="mailto:marketing@asiapharmsg.com<">marketing@asiapharmsg.com</a>
            </p>
            <p className="phone">TEL : (+65) 6547 8077</p>
            <p className="phone">FAX : (+65) 6547 8078</p>
            <div className="social-icons">
              <ul>
                <li>
                  <Tooltip
                    title="Twitter"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://mobile.twitter.com/asiapharmsg" target="_blank">
                      <FaTwitter />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip
                    title="Facebook"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.facebook.com/asiapharmsg/" target="_blank">
                      <FaFacebookF />
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip
                    title="Instagram"
                    position="top"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={true}
                    duration={200}
                  >
                    <a href="https://www.instagram.com/asiapharmsg/" target="_blank">
                      <FaInstagram />
                    </a>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;
