import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/actions/userActions';
import { useToasts } from 'react-toast-notifications';

import { deleteAllFromCart } from '../../../redux/actions/cartActions';
import { deleteAllFromWishlist } from '../../../redux/actions/wishlistActions';

const MobileMenuNav = ({ getActiveStatus }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { addToast } = useToasts();
  const userStore = useSelector((state) => state.user);

  useEffect(() => {
    const offCanvasNav = document.querySelector(
      '#offcanvas-mobile-menu__navigation'
    );
    const offCanvasNavSubMenu =
      offCanvasNav.querySelectorAll('.mobile-sub-menu');
    const anchorLinks = offCanvasNav.querySelectorAll('a');

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        'beforebegin',
        "<span class='menu-expand'><i></i></span>"
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll('.menu-expand');
    const numMenuExpand = menuExpand.length;

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener('click', (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener('click', () => {
        getActiveStatus(false);
      });
    }
  });

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle('active');
  };

  const logoutHandler = () => {
    console.log(">>> logout");
    deleteAllFromCart(addToast);
    deleteAllFromWishlist(addToast);
    localStorage.clear();
    dispatch(logout());
    router.replace('/user/login');
  };

  return (
    <nav
      className="offcanvas-mobile-menu__navigation"
      id="offcanvas-mobile-menu__navigation"
    >
      <ul>
        <li className="menu-item-has-children">
          <Link href="/" as={process.env.PUBLIC_URL + '/'}>
            <a>Home</a>
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link
            href="/about-us"
            as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
          >
            <a>About Us</a>
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link
            href="/shop/left-sidebar"
            as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
          >
            <a>Shop</a>
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link
            href="/contact"
            as={process.env.PUBLIC_URL + '/shop/left-sidebar'}
          >
            <a>Contact Us</a>
          </Link>
        </li>
        {userStore && userStore.isAuthenticated ? (
          <>
            <li>
              <Link
                href={
                  userStore.isAdmin ? '/admin/dashboard' : '/user/my-account'
                }
              >
                <a>Profile</a>
              </Link>
            </li>
            <li>
              <Link
                href={
                  userStore.isAdmin
                    ? '/admin/change-password'
                    : '/user/change-password'
                }
              >
                <a>Settings</a>
              </Link>
            </li>
            <li>
              <a href="#" onClick={logoutHandler}>
                Logout
              </a>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/user/login"
              as={process.env.PUBLIC_URL + '/user/login'}
            >
              <a>Login / Register</a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileMenuNav;
