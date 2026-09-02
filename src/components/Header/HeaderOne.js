import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Container, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { connect, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/userActions';
import {
  IoIosSearch,
  IoMdPerson,
  IoIosHeartEmpty,
  IoIosCart,
  IoIosMenu
} from 'react-icons/io';
import Navigation from './elements/Navigation';
import AboutOverlay from './elements/AboutOverlay';
import SearchOverlay from './elements/SearchOverlay';
import CartOverlay from './elements/CartOverlay';
import WishlistOverlay from './elements/WishlistOverlay';
import MobileMenu from './elements/MobileMenu';
import { deleteAllFromCart } from '../../redux/actions/cartActions';
import { deleteAllFromWishlist } from '../../redux/actions/wishlistActions';
import { useToasts } from 'react-toast-notifications';

const HeaderOne = ({ aboutOverlay, cartItems, wishlistItems, user }) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [offCanvasAboutActive, setOffCanvasAboutActive] = useState(false);
  const [offCanvasSearchActive, setOffCanvasSearchActive] = useState(false);
  const [offCanvasCartActive, setOffCanvasCartActive] = useState(false);
  const [offCanvasWishlistActive, setOffCanvasWishlistActive] = useState(false);
  const [offCanvasMobileMenuActive, setOffCanvasMobileMenuActive] =
    useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { addToast } = useToasts();

  useEffect(() => {
    const header = document.querySelector('header');
    setHeaderTop(header.offsetTop);
    setHeaderHeight(header.offsetHeight);
    window.addEventListener('scroll', handleScroll);
    scroll > headerTop
      ? (document.body.style.paddingTop = `${headerHeight}px`)
      : (document.body.style.paddingTop = 0);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const handleShowMenu = () => setShowMenu(true);
  const handleHideMenu = () => setShowMenu(false);

  const logoutHandler = () => {
    deleteAllFromCart(addToast);
    deleteAllFromWishlist(addToast);
    localStorage.clear();
    dispatch(logout());
    router.replace('/user/login');
  };

  const profileClickHandler = () => {
    if (user.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/my-account');
    }
  };

  const changePasswordClickHandler = () => {
    if (user.isAdmin) {
      router.push('/admin/change-password');
    } else {
      router.push('/user/change-password');
    }
  };

  return (
    <Fragment>
      <header
        className={`topbar-shadow ${scroll > headerTop ? 'is-sticky' : ''}`}
      >
        <Container className="wide">
          <div className="header-content d-flex align-items-center justify-content-between position-relative space-py-mobile-only--30">
            {/* logo */}
            <div className="header-content__logo d-flex align-items-center space-pr--15">
              <button
                onClick={() => {
                  setOffCanvasAboutActive(true);
                  document
                    .querySelector('body')
                    .classList.add('overflow-hidden');
                }}
                className={`${
                  aboutOverlay === false
                    ? 'd-none'
                    : 'about-overlay-trigger d-none d-lg-block'
                }`}
              >
                <IoIosMenu />
              </button>
              <Link href="/" as={process.env.PUBLIC_URL + '/'}>
                <a>
                  <img
                    src={process.env.PUBLIC_URL + '/assets/images/logo.png'}
                    className="img-fluid"
                    alt=""
                  />
                </a>
              </Link>
            </div>

            {/* navigation */}
            <Navigation />

            {/* icons */}
            <div className="header-content__icons space-pl--15">
              <ul className="d-none d-lg-block">
                {!user.isAuthenticated && (
                  <li>
                    <Link
                      href="/user/login"
                      as={process.env.PUBLIC_URL + '/user/login'}
                    >
                      <a>
                        <IoMdPerson />
                      </a>
                    </Link>
                  </li>
                )}
                {user.isAuthenticated && (
                  <li>
                    <button
                      onClick={() => {
                        setOffCanvasWishlistActive(true);
                        document
                          .querySelector('body')
                          .classList.add('overflow-hidden');
                      }}
                    >
                      <IoIosHeartEmpty />
                      {wishlistItems.length >= 1 ? (
                        <span className="count">
                          {wishlistItems.length ? wishlistItems.length : ''}
                        </span>
                      ) : (
                        ''
                      )}
                    </button>
                  </li>
                )}
                {user.isAuthenticated && (
                  <li>
                    <button
                      onClick={() => {
                        setOffCanvasCartActive(true);
                        document
                          .querySelector('body')
                          .classList.add('overflow-hidden');
                      }}
                    >
                      <IoIosCart />
                      {cartItems.length >= 1 ? (
                        <span className="count">
                          {cartItems.length ? cartItems.length : ''}
                        </span>
                      ) : (
                        ''
                      )}
                    </button>
                  </li>
                )}
                {user.isAuthenticated && (
                  <li>
                    {/* <span>{user.username}</span> */}
                    <Dropdown
                      onMouseOver={handleShowMenu}
                      onMouseLeave={handleHideMenu}
                    >
                      <Dropdown.Toggle as={CustomToggle} id="username-menu">
                        Hi {user.username}
                      </Dropdown.Toggle>
                      <Dropdown.Menu show={showMenu}>
                        <Dropdown.Item
                          className="p-3"
                          onClick={profileClickHandler}
                        >
                          Profile
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="p-3"
                          onClick={changePasswordClickHandler}
                        >
                          Settings
                        </Dropdown.Item>
                        <Dropdown.Item className="p-3" onClick={logoutHandler}>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                )}
              </ul>

              <ul className="d-block d-lg-none">
                {user.isAuthenticated && (
                  <li>
                    <button
                      onClick={() => {
                        setOffCanvasWishlistActive(true);
                        document
                          .querySelector('body')
                          .classList.add('overflow-hidden');
                      }}
                    >
                      <IoIosHeartEmpty />
                      {wishlistItems.length >= 1 ? (
                        <span className="count">
                          {wishlistItems.length ? wishlistItems.length : ''}
                        </span>
                      ) : (
                        ''
                      )}
                    </button>
                  </li>
                )}
                {user.isAuthenticated && (
                  <li>
                    <button
                      onClick={() => {
                        setOffCanvasCartActive(true);
                        document
                          .querySelector('body')
                          .classList.add('overflow-hidden');
                      }}
                    >
                      <IoIosCart />
                      {cartItems.length >= 1 ? (
                        <span className="count">
                          {cartItems.length ? cartItems.length : ''}
                        </span>
                      ) : (
                        ''
                      )}
                    </button>
                  </li>
                )}
                <li>
                  <button onClick={() => setOffCanvasMobileMenuActive(true)}>
                    <IoIosMenu />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </header>

      {/* about overlay */}
      {aboutOverlay === false ? (
        ''
      ) : (
        <AboutOverlay
          activeStatus={offCanvasAboutActive}
          getActiveStatus={setOffCanvasAboutActive}
        />
      )}
      {/* search overlay */}
      <SearchOverlay
        activeStatus={offCanvasSearchActive}
        getActiveStatus={setOffCanvasSearchActive}
      />

      {/* cart overlay */}
      <CartOverlay
        activeStatus={offCanvasCartActive}
        getActiveStatus={setOffCanvasCartActive}
      />

      {/* wishlist overlay */}
      <WishlistOverlay
        activeStatus={offCanvasWishlistActive}
        getActiveStatus={setOffCanvasWishlistActive}
      />
      {/* Mobile Menu */}
      <MobileMenu
        activeStatus={offCanvasMobileMenuActive}
        getActiveStatus={setOffCanvasMobileMenuActive}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    },
    deleteAllFromWishlist: (addToast) => {
      dispatch(deleteAllFromWishlist(addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderOne);

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));
