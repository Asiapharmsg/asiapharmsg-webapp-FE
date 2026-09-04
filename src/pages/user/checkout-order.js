import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { UserDetail, CheckOutOrderList } from '../../components/Checkout';
import React from 'react';
import { useAddOrder } from '../../hooks/orders';
import { deleteAllFromCart } from '../../redux/actions/cartActions';
import { buildDeliveryAddress } from '../../utils';
import withAuth from '../../hoc/withAuth';

const checkOutOrder = ({ cartItems, deleteAllFromCart }) => {
  const { mutate: createOrder, isLoading: isSubmitting } = useAddOrder();
  const router = useRouter();

  const confirmUserAndDeliveryOrder = (user) => {
    const orderDetailPayload = [];
    let total_price = 0;
    const full_addr = buildDeliveryAddress(user, user.deliveryType);

    cartItems.forEach((item) => {
      const orderItemTotalPrice = item?.quantity * item?.price_tier_1;
      orderDetailPayload.push({
        product_id: item?.id,
        quantity: item?.quantity,
        price: orderItemTotalPrice,
        supplier_id: item?.supplier_id
      });
      total_price += orderItemTotalPrice;
    });

    const orderPayload = {
      user_id: user?.id,
      total_price,
      status: 2,
      deliveryType: user.deliveryType,
      firstName: user?.firstName,
      lastName: user?.lastName,
      remarks: user?.remarks,
      deliveryAddress: full_addr,
      contact: user?.phone || user?.mobile
    };

    createOrder(
      { order: orderPayload, orderDetails: orderDetailPayload },
      {
        onSuccess: () => {
          // Only empty the cart once the order is saved, so a failed
          // checkout can simply be retried.
          deleteAllFromCart(null);
          router.push('/user/my-account');
        }
      }
    );
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle="&nbsp;"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + '/'}>
              <a>Home</a>
            </Link>
          </li>

          <li>
            <Link href="/user/my-account">My Account</Link>
          </li>
          <li>Checkout Order</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-checkout-order space-mt--r130 space-mb--r130">
        <Container>
          <Row>
            <Col xl={6} md={6} lg={6} sm={12} xs={12}>
              <UserDetail
                cartItems={cartItems}
                confirmUserAndDeliveryOrder={confirmUserAndDeliveryOrder}
                isSubmitting={isSubmitting}
              />
            </Col>
            <Col xl={6} md={6} lg={6} sm={12} xs={12}>
              <CheckOutOrderList />
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    }
  };
};
export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(checkOutOrder)
);
