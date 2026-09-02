import { useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import { InputField } from '../../components/Form';
import { login } from '../../redux/actions/userActions';
import { newWishlist } from '../../redux/actions/wishlistActions';
import { useToasts } from 'react-toast-notifications';
import Link from 'next/link';
import Loader from '../../components/Loader';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import withSingleAuth from '../../hoc/withSingleAuth';
import { deleteAllFromCart } from '../../redux/actions/cartActions';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { addToast } = useToasts();
  const recaptchaRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const captchaHandler = (e) => {
    setCaptchaValue(e);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (credentials.username == '') {
      recaptchaRef.current?.reset();
      addToast('Please enter a username', { appearance: 'error' });
      return;
    }
    if (credentials.password == '') {
      recaptchaRef.current?.reset();
      addToast('Please enter a password', { appearance: 'error' });
      return;
    }
    if (!captchaValue || captchaValue == '') {
      addToast('Please solve the captcha first', { appearance: 'error' });
      return;
    }
    setLoading(true);
    axios
      .post(`${process.env.API_URL}/user/login/${captchaValue}`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((resp) => {
        if (resp.status === 200) {
          setLoading(false);
          if (resp.data.status === 'Pending') {
            addToast(
              'An Admin will approve your account first.\nPlease try again later.',
              { appearance: 'info' }
            );
            recaptchaRef.current?.reset();
            setCredentials({ username: '', password: '' });
            return;
          } else if (resp.data.status === 'Rejected') {
            addToast(
              'Your account approval was rejected. Please try creating an account again.',
              { appearance: 'error' }
            );
            recaptchaRef.current?.reset();
            setCredentials({ username: '', password: '' });
            return;
          } else {
            const userData = resp.data;
            dispatch(
              login({
                userId: userData.userId,
                username: userData.username,
                token: userData.token,
                isAdmin: userData.isAdmin,
                accountType: userData.accountType
              })
            );
            dispatch(newWishlist(userData.wishlist));
            localStorage.setItem('token', userData.token);
            addToast('Login successful!', {
              appearance: 'success',
              autoDismiss: true
            });
            recaptchaRef.current?.reset();
            setCredentials({ username: '', password: '' });
            dispatch(deleteAllFromCart());
            setTimeout(() => {
              if (resp.data.isAdmin) {
                router.push('/admin/dashboard');
              } else {
                if (resp.data.accountType == 'vendor') {
                  router.push('/user/my-account');
                } else {
                  router.push('/shop/left-sidebar');
                }
              }
            }, 500);
          }
        } else {
          setLoading(false);
          recaptchaRef.current?.reset();
          console.log('error here1');
          addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
            appearance: 'error'
          });
        }
      })
      .catch((err) => {
        console.log('Error: ', err.response);
        setLoading(false);
        recaptchaRef.current?.reset();
        console.log('error here2');
        addToast(`${err.response.data.error ?? err.response.data.errors[0]}`, {
          appearance: 'error'
        });
      });
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + '/'}>
              <a></a>
            </Link>
          </li>
        </ul>
      </BreadcrumbOne>
      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="space-mb-mobile-only--50 ">
              <div className="lezada-form login-form">
                <form>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">Login</h2>
                        <span className="signup-link">
                          Don't have an account?{' '}
                        </span>
                        <Link
                          className="signup-link"
                          href="/user/signup"
                          as={process.env.PUBLIC_URL + '/user/signup'}
                        >
                          Sign up
                        </Link>
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <InputField
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <InputField
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.CAPTCHA_KEY}
                        onChange={captchaHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--30 text-center">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={onSubmitHandler}
                      >
                        {loading ? <Loader /> : 'login'}
                      </button>
                    </Col>
                    <Col lg={12}>
                      <input
                        id="remember-text"
                        name="remember-text"
                        type="checkbox"
                      />{' '}
                      <label htmlFor="remember-text" className="remember-text">
                        Remember me
                      </label>
                    </Col>
                    <Col lg={12}>
                      <Link
                        className="reset-pass-link"
                        href="/user/forget-password/"
                        as={process.env.PUBLIC_URL + '/user/forget-password'}
                      >
                        Lost your password?
                      </Link>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withSingleAuth(Login);
