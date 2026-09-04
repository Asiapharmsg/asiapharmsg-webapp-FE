import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import { IoIosSearch } from 'react-icons/io';
import axios from 'axios';
import {
  ProductsList,
  AddProduct,
  EditProduct
} from '../../components/Products';
import { useFetchSupplierProducts } from '../../hooks/products';
import { OrdersList } from '../../components/Orders';
import { BillingsList } from '../../components/Billings';
import moment from 'moment';
import withAuth from '../../hoc/withAuth';
import { Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

const MyAccount = () => {
  const [showAddProductView, setShowAddProductView] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user);
  const { addToast } = useToasts();
  const [expiryDate, setExpiryDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [products, setProducts] = useState([]);

  const searchRef = useRef();
  const [filterOptions, setFilterOptions] = useState({
    inventoryStatus: 0
  });

  let supplierid = 0;
  if (user.accountType === 'vendor') {
    supplierid = user.supplierId;
  }

  const { data: allProducts } = useFetchSupplierProducts(supplierid);

  const missingProfileSrc = `data:image/png;base64,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`;
  const orderData = {
    headers: ['No.', 'Username', 'Email', 'Last Login Time', 'Action'],
    data: [
      {
        no: 1,
        username: 'ryan',
        email: 'xychia@gmail.com',
        lastLoginAt: moment(new Date()).format('DD/MM/YYYY hh:mm:ss'),
        action: <span className="view_profile_btn">View</span>
      },
      {
        no: 2,
        username: 'ryan',
        email: 'xychia@gmail.com',
        lastLoginAt: moment(new Date()).format('DD/MM/YYYY hh:mm:ss'),
        action: <span className="view_profile_btn">View</span>
      },
      {
        no: 3,
        username: 'ryan',
        email: 'xychia@gmail.com',
        lastLoginAt: moment(new Date()).format('DD/MM/YYYY hh:mm:ss'),
        action: <span className="view_profile_btn">View</span>
      },
      {
        no: 4,
        username: 'ryan',
        email: 'xychia@gmail.com',
        lastLoginAt: moment(new Date()).format('DD/MM/YYYY hh:mm:ss'),
        action: <span className="view_profile_btn">View</span>
      }
    ]
  };

  const inventoryStatus = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Available' },
    { value: 2, label: 'Indent' },
    { value: 3, label: 'Out of stock' }
  ];

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (name === 'licenceExpiryDate') {
      setExpiryDate(value);
    }
  };

  const sanitizedData = () => {
    const data = { ...userData };
    const fieldsToRemove = [
      'id',
      'password',
      'image_moh',
      'image_smc',
      'image_acra',
      'status',
      'billingType',
      'priceTier',
      'adminControl',
      'isAdmin',
      'lastLoginAt',
      'created_at',
      'updated_at',
      'createdAt',
      'updatedAt',
      'nationality',
      'countryIncorporation',
      'accountType'
    ];
    fieldsToRemove.forEach((key) => {
      delete data[key];
    });
    return data;
  };

  const saveButtonHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isEditable) {
        setIsEditable(true);
      } else {
        const data = sanitizedData();
        const formData = new FormData();
        file != null && formData.append('image_moh', file, file.name);

        for (const key in data) {
          // FormData turns null into the string "null"; leave empty optional
          // fields out so the backend keeps them NULL.
          if (data[key] === null || data[key] === undefined) continue;
          formData.append(key, data[key]);
        }
        const resp = await axios.put(
          `${process.env.API_URL}/user/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        if (resp.status === 200) {
          addToast(resp.data.message, { appearance: 'success' });
          setIsEditable(false);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
            appearance: 'error'
          });
        }
      }
    } catch (err) {
      console.log(err);
      addToast(`${err}`, {
        appearance: 'error'
      });
    }
  };

  const fileChangeHandler = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      setIsEditable(true);
    }
  };

  const getImgSrc = () => {
    if (userData?.image_moh === null && !file) {
      return missingProfileSrc;
    } else if (file == null) {
      if(userData?.image_moh){
        return `data:image/png;base64,${Buffer.from(
          userData?.image_moh.data ?? Buffer.alloc(0)
        ).toString('base64')}`;
      }
      else{
        return ''
      }
    } else {
      return URL.createObjectURL(file);
    }
  };


  const deleteImageHandler = () => {
    setUserData({ ...userData, image_moh: null });
    setFile(null);
    setIsEditable(true);
  };

  const onChangeFilters = ({ inventoryStatus }) => {
    let filterData;
    // All products
    if (inventoryStatus == 0) {
      filterData = allProducts;
    }
    // Only available products
    else if (inventoryStatus == 1) {
      filterData = allProducts.filter((p) => p.inventory_count == 1);
    }
    // Indent products
    else if (inventoryStatus == 2) {
      filterData = allProducts.filter((p) => p.inventory_count == 2);
    }
    // Out of stock products
    else if (inventoryStatus == 3) {
      filterData = allProducts.filter((p) => p.inventory_count == 0);
    }

    setProducts(filterData);
  };

  const onSearchChange = debounce((e) => {
    e.preventDefault();
    if (searchRef.current) {
      const searchText = searchRef.current.value;
      const filteredProducts = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          p?.ingredients?.toLowerCase().includes(searchText.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  }, 300);

  const fetchData = async () => {
    try {
      const resp = await axios.get(`${process.env.API_URL}/user/user-data`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = resp.data;
      setUserData(data.data);
      setExpiryDate(dayjs(data.data.licenceExpiryDate).format('YYYY-MM-DD'));
    } catch (err) {
      console.log(err);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allProducts?.length > 0) {
      setProducts(allProducts);
    }
  }, [allProducts]);

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="My Account"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + '/'}>
              <a>Home</a>
            </Link>
          </li>

          <li>My Account</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
              <Nav.Item>
                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="account">Account</Nav.Link>
              </Nav.Item>
              {user.accountType === 'vendor' && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="products">Products</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="billing">Billing</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <div className="my-account-area__content">
                  <h3>Dashboard</h3>
                  <div className="welcome">
                    <p>
                      Hello, <strong>{user.username}</strong>
                    </p>
                    <p>Account Type : {user.accountType}</p>
                  </div>
                  <p>
                    From your account dashboard. You can easily check &amp; view
                    your recent orders, manage your shipping and billing
                    addresses and edit your password and account details.
                  </p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersList />
              </Tab.Pane>

              <Tab.Pane eventKey="account">
                {!userData && (
                  <div className="loader_container">
                    <Spinner animation="border" />
                  </div>
                )}
                {userData && (
                  <div className="my-account-area__content">
                    <h3>Account Details</h3>
                    <div className="my-account-area__picture-area">
                      <div className="profile-picture">
                        {userData && (
                          <img
                            src={getImgSrc()}
                            // src={`data:image/png;base64,${Buffer.from(
                            //   userData.image.data
                            // ).toString("base64")}`}
                            alt="profile-picture"
                          />
                        )}
                      </div>
                      <div className="profile-picture-buttons">
                        <label
                          className="upload-button"
                          htmlFor="profilePicture"
                        >
                          Licence
                        </label>

                        <input
                          type="file"
                          name="profilePicture"
                          id="profilePicture"
                          accept="image/*"
                          onChange={fileChangeHandler}
                        />

                        <input
                          type="date"
                          id="licenceExpiryDate"
                          name="licenceExpiryDate"
                          min={dayjs().format('YYYY-MM-DD')}
                          defaultValue={expiryDate}
                          value={expiryDate}
                          onChange={onChangeHandler}
                        />

                        <button onClick={deleteImageHandler}>
                          Delete Picture
                        </button>
                      </div>
                    </div>
                    <div className="account-details-form">
                      <form onSubmit={saveButtonHandler}>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="username" className="required">
                                Username
                              </label>
                              <input
                                type="text"
                                id="username"
                                value={userData.username}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="email" className="required">
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={userData.email}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="firstName" className="required">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={userData.firstName}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="lastName" className="required">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={userData.lastName}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="nationality" className="required">
                                Nationality
                              </label>
                              <input
                                type="text"
                                id="nationality"
                                name="nationality"
                                value={userData.nationality}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="mobile" className="required">
                                Mobile
                              </label>
                              <input
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={userData.mobile}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="phone" className="required">
                                Phone
                              </label>
                              <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={userData.phone}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="companyName" className="required">
                                Company Name
                              </label>
                              <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={userData.companyName}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label
                                htmlFor="companyAddress"
                                className="required"
                              >
                                Company Address
                              </label>
                              <input
                                type="text"
                                id="companyAddress"
                                name="companyAddress"
                                value={userData.companyAddress}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label
                                htmlFor="companyPostal"
                                className="required"
                              >
                                Company Postal
                              </label>
                              <input
                                type="text"
                                id="companyPostal"
                                name="companyPostal"
                                value={userData.companyPostal}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label
                                htmlFor="deliveryAddress"
                                className="required"
                              >
                                Delivery Address
                              </label>
                              <input
                                type="text"
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={userData.deliveryAddress}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label
                                htmlFor="deliveryPostal"
                                className="required"
                              >
                                Delivery Postal
                              </label>
                              <input
                                type="text"
                                id="deliveryPostal"
                                name="deliveryPostal"
                                value={userData.deliveryPostal}
                                onChange={onChangeHandler}
                                readOnly={!isEditable}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label
                                htmlFor="countryIncorporation"
                                className="required"
                              >
                                Country of Incorporation
                              </label>
                              <input
                                type="text"
                                id="countryIncorporation"
                                name="countryIncorporation"
                                value={userData.countryIncorporation}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="single-input-item">
                              <label htmlFor="accountType" className="required">
                                Account Type
                              </label>
                              <input
                                type="text"
                                name="accountType"
                                id="accountType"
                                value={userData.accountType}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <div className="single-input-item mt-5">
                          <button type="submit">
                            {isEditable ? 'Save Changes' : 'Edit'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </Tab.Pane>
              {user.accountType === 'vendor' && (
                <>
                  <Tab.Pane eventKey="products">
                    <div className="my-account-area__content">
                      <h3>Products List</h3>

                      {(showAddProductView || productToEdit) && (
                        <>
                          <div className="single-input-item ">
                            <button
                              className="lezada-button lezada-button--small product-content__ofs space-mr--10"
                              onClick={() => {
                                setShowAddProductView(false);
                                setProductToEdit(null);
                              }}
                            >
                              Back
                            </button>
                          </div>

                          <br />
                        </>
                      )}
                      {showAddProductView && !productToEdit && (
                        <AddProduct
                          onFinishAdding={() => setShowAddProductView(false)}
                        />
                      )}
                      {!showAddProductView && productToEdit && (
                        <EditProduct
                          product={productToEdit}
                          onFinishEditing={() => setProductToEdit(null)}
                        />
                      )}
                      {!showAddProductView && !productToEdit && (
                        <>
                          <div className="single-icon filter-dropdown">
                            {/* Account type */}
                            <div className="filterItem">
                              <label
                                htmlFor="inventoryStatus"
                                className="required"
                              >
                                Inventory Status :
                              </label>
                              <select
                                style={{ height: '100%', minWidth: '120px' }}
                                value={filterOptions?.inventoryStatus}
                                onChange={(e) => {
                                  onChangeFilters({
                                    ...filterOptions,
                                    inventoryStatus: e.target.value
                                  });
                                  setFilterOptions({
                                    ...filterOptions,
                                    inventoryStatus: e.target.value
                                  });
                                }}
                              >
                                {inventoryStatus.map((item) => (
                                  <option value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="product-widget-container">
                              <div className="search-widget">
                                <form onSubmit={(e) => e.preventDefault()}>
                                  <input
                                    type="search"
                                    placeholder="Search products ..."
                                    onChange={onSearchChange}
                                    ref={searchRef}
                                  />
                                  <button type="button" style={{ top: 0 }}>
                                    <IoIosSearch />
                                  </button>
                                </form>
                              </div>
                              <button
                                className="lezada-button lezada-button--small product-content__ofs space-mr--10"
                                onClick={() => setShowAddProductView(true)}
                              >
                                Add Product
                              </button>
                            </div>
                          </div>
                          <br />
                          <ProductsList
                            products={products}
                            product={productToEdit}
                            onEditProduct={(p) => setProductToEdit(p)}
                          />
                        </>
                      )}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="billing">
                    <BillingsList />
                  </Tab.Pane>
                </>
              )}
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withAuth(MyAccount);
