import { Row, Col, Card, Badge, Form } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

const UserDetail = (props) => {
  let { cartItems, confirmUserAndDeliveryOrder } = props;
  let [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user);
  const [deliveryType, setDeliveryType] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState(1);
  const router = useRouter();
  const { addToast } = useToasts();
  const fetchData = async () => {
    try {
      const resp = await axios.get(
        `${process.env.API_URL}/user/user-data-noimg`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      const data = resp.data;
      data.data.deliveryType = deliveryType;

      const full_addr =
        data.data.companyAddress + ' Singapore ' + data.data.companyPostal;
      setDeliveryAddress(full_addr);

      setUserData(data.data);
    } catch (err) {
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirm = () => {
    if (!userData.firstName?.trim()) {
      addToast('Please enter your first name', {
        appearance: 'error',
        autoDismiss: true
      });
    } else if (!userData.lastName?.trim()) {
      addToast('Please enter your last name', {
        appearance: 'error',
        autoDismiss: true
      });
    } else if (!userData.phone?.trim() && !userData.mobile?.trim()) {
      addToast('Please enter your phone number', {
        appearance: 'error',
        autoDismiss: true
      });
    } else if (userData.remarks && userData.remarks.length > 255) {
      addToast('Remarks cannot be greater than 255 characters', {
        appearance: 'error',
        autoDismiss: true
      });
    } else {
      confirmUserAndDeliveryOrder(userData);
      router.push('/shop/left-sidebar');
    }
  };
  const changeDeliveryUserDetail = (e, fieldName) => {
    let updatedProperty = {};
    updatedProperty[fieldName] = e.target.value;
    if (fieldName == 'phone') {
      updatedProperty['mobile'] = e.target.value;
    }

    if (fieldName == 'deliveryType') {
      //set delivery address
      if (e.target.value == 1) {
        const full_addr =
          userData.companyAddress + ' Singapore ' + userData.companyPostal;
        setDeliveryAddress(full_addr);
      } else {
        const full_addr =
          userData.deliveryAddress + ' Singapore ' + userData.deliveryPostal;
        setDeliveryAddress(full_addr);
      }
    }
    setUserData({ ...userData, ...updatedProperty });
  };
  return (
    <Card className="card-element">
      <Card.Body>
        <Card className="card-element ">
          <Card.Body className="d-flex">
            <div className="mr-auto p-2">
              <p>
                Shopping Cart <FaCheck className="card-element--check-icon" />
              </p>
              <span>
                <b>{userData?.username}</b>{' '}
                <Badge pill bg="info" className="card-element--phone-bagde">
                  {/* {userData?.mobile} */}
                </Badge>
              </span>
            </div>
            {/* <div className="p-2"><FaShoppingCart /><Badge className="card-element--p2--count-number">{cartItems.length}</Badge></div> */}
          </Card.Body>
        </Card>
        <br />
        <Card className="card-element">
          <Card.Body>
            <Form>
              <Row>
                <Col xl="6" lg="6" sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      First Name*
                    </Form.Label>
                    <Form.Control
                      placeholder=""
                      value={userData?.firstName}
                      onChange={(e) => changeDeliveryUserDetail(e, 'firstName')}
                    />
                  </Form.Group>
                </Col>
                <Col xl="6" lg="6" sm="12">
                  <Form>
                    <Form.Group>
                      <Form.Label className="font-weight-bold card-element--label">
                        Last Name*
                      </Form.Label>
                      <Form.Control
                        placeholder=""
                        value={userData?.lastName}
                        onChange={(e) =>
                          changeDeliveryUserDetail(e, 'lastName')
                        }
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col xl="12" lg="12" sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      Contact Number*
                    </Form.Label>
                    <Form.Control
                      placeholder=""
                      value={userData?.phone || userData?.mobile}
                      onChange={(e) => {
                        const userInput = Number(e.target.value);
                        if (userInput.toString() !== 'NaN') {
                          changeDeliveryUserDetail(e, 'phone');
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* <Row>
                              <Col sm="12">
                                  <Form.Group>
                                      <Form.Label className="font-weight-bold card-element--label">Address*</Form.Label>
                                      <Form.Control placeholder="" value={userData?.companyAddress} />
                                  </Form.Group>
                              </Col>
                          </Row> */}

              <Row>
                <Col sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      Address Type
                    </Form.Label>
                    <div className="d-flex flex-wrap">
                      <div className="mr-auto p-2">
                        <input
                          type="checkbox"
                          value={1}
                          checked={userData?.deliveryType == 1}
                          onClick={(e) =>
                            changeDeliveryUserDetail(e, 'deliveryType')
                          }
                        />
                        <Badge>Office (Delivery between office hours)</Badge>
                      </div>
                      <div className="p-2">
                        <input
                          type="checkbox"
                          value={2}
                          checked={userData?.deliveryType == 2}
                          onClick={(e) =>
                            changeDeliveryUserDetail(e, 'deliveryType')
                          }
                        />
                        <Badge>Delivery Address</Badge>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xl="12" lg="12" sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      Delivery Address*
                    </Form.Label>
                    <Form.Control
                      placeholder="Delivery Address"
                      value={deliveryAddress}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xl="6" lg="6" sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      Country*
                    </Form.Label>
                    <Form.Control
                      placeholder="Country"
                      value={userData?.countryIncorporation}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xl="12" lg="12" sm="12">
                  <Form.Group>
                    <Form.Label className="font-weight-bold card-element--label">
                      Remarks
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={userData?.remarks}
                      onChange={(e) => changeDeliveryUserDetail(e, 'remarks')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col sm={12}>
                <button
                  className="lezada-button lezada-button--medium product-content__cart space-mr--10"
                  onClick={confirm}
                  disabled={!userData || !cartItems}
                >
                  Save And Deliver Here
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};
export default UserDetail;
