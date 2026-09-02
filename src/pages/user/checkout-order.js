import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { UserDetail, CheckOutOrderList } from '../../components/Checkout';
import React, { useEffect, useState } from 'react';
import { useAddOrder } from '../../hooks/orders';
import { deleteFromCart } from '../../redux/actions/cartActions';
import { useToasts } from 'react-toast-notifications';

const checkOutOrder = ({ cartItems, deleteFromCart }) => {
  let cartTotalPrice = 0;
  const { mutate: createOrder } = useAddOrder();
  const { addToast } = useToasts();
  const confirmUserAndDeliveryOrder = (user) => {
    const orderDetailPayload = [];
    let total_price = 0;
    let full_addr = '';
    //set delivery address
    if (user.deliveryType == 1) {
      full_addr = user.companyAddress + ' Singapore ' + user.companyPostal;
    } else {
      full_addr = user.deliveryAddress + ' Singapore ' + user.deliveryPostal;
    }
    cartItems.map((item) => {
      const orderItemTotalPrice = item?.quantity * item?.price_tier_1;
      const payload = {
        product_id: item?.id,
        quantity: item?.quantity,
        price: orderItemTotalPrice,
        supplier_id: item?.supplier_id
      };
      total_price += orderItemTotalPrice;
      orderDetailPayload.push(payload);
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
      contact: user?.phone | user?.mobile
    };
    createOrder({ order: orderPayload, orderDetails: orderDetailPayload });
    cartItems.map((p) => deleteFromCart(p, addToast));
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
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkOutOrder);
