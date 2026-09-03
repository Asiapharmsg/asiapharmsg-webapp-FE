import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Image, Carousel } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { InputField } from '../Form';
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';
import Select from 'react-select';
import axios from 'axios';
import dayjs from 'dayjs';
import ImageAndPdfViewer from './imageAndPdfViewer';

const UserModal = (props) => {
  const { data, updateRequestTable, handleUserDataUpdated, ...rest } = props;
  const {
    user,
    userId,
    username,
    statusValues,
    billingTypeValues,
    priceTierValues,
    adminControlValues
  } = data;
  const [userData, setUserData] = React.useState({
    status: '',
    billingType: '',
    priceTier: '',
    adminControl: '',
    licenceExpiryDate: ''
  });
  const { addToast } = useToasts();
  const router = useRouter();
  const token = useSelector((state) => state.user.token);
  const [showPDFDetail, setShowPDFDetail] = useState(false);
  const [selectedFileBuffer, setSelectedFileBuffer] = useState('');

  console.log('admin pending - user ', user);

  const handlePDFViewerClose = () => {
    setShowPDFDetail(false);
    setSelectedFileBuffer('');
  };
  const handlePDFViewerShow = () => setShowPDFDetail(true);
  //const [licenceExpiryDate, setLicenceExpiryDate] = useState(dayjs().format('YYYY-MM-DD'));

  const onChangeHandler = (name, item) => {
    if (name === 'licenceExpiryDate') {
      setUserData({ ...userData, [name]: item });
    } else {
      setUserData({ ...userData, [name]: item.value });
    }
  };

  const updateButtonHandler = async () => {
    try {
      if (!token) {
        router.replace('/user/login');
        return;
      }
      console.log('print user id : ', userId);
      console.log('print user data : ', userData);
      const resp = await axios.post(
        `${process.env.API_URL}/admin/updateUserDataWithoutImg`,
        { userId, ...userData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.status === 200) {
        props.onClose();
        addToast(resp.data.message, {
          appearance: 'success',
          autoDismiss: true
        });
        // updateRequestTable(username);
        handleUserDataUpdated();
      } else {
        props.onClose();
        addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
          appearance: 'error'
        });
      }
    } catch (error) {
      console.log(error.message);
      addToast(error.message, {
        appearance: 'error'
      });
    }
  };

  const deleteButtonHandler = async () => {
    try {
      if (!token) {
        router.replace('/user/login');
        return;
      }
      const resp = await axios.delete(
        `${process.env.API_URL}/admin/deleteUser/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.status === 200) {
        props.onClose();
        addToast(resp.data.message, {
          appearance: 'success',
          autoDismiss: true
        });
        // updateRequestTable(username);
        handleUserDataUpdated();
      } else {
        addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
          appearance: 'error'
        });
      }
    } catch (error) {
      addToast(error.message, {
        appearance: 'error'
      });
    }
  };
  const handleShowImageOrPdfViewer = (value) => {
    setSelectedFileBuffer(value);
    handlePDFViewerShow();
  };

  return (
    <>
      <ImageAndPdfViewer
        show={showPDFDetail}
        onHide={handlePDFViewerClose}
        selectedFileBuffer={selectedFileBuffer}
      />
      <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal_title">{username}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="active-user-modal">
          <label htmlFor="LicenceType">Check attached MOH licence : </label>
          <div className="img-container">
            {user && (
              <Image
                thumbnail="true"
                fluid="true"
                className="img-content"
                src={`data:image/png;base64,${Buffer.from(
                  user.image_moh.data
                ).toString('base64')}`}
                alt="profile-picture"
                onClick={() => handleShowImageOrPdfViewer(user.image_moh.data)}
              />
            )}
          </div>
          <div className="licence_option">
            <label htmlFor="licenceExpiryDate">Licence Expiry Date : </label>
            <input
              type="date"
              id="display-name"
              min={dayjs().format('YYYY-MM-DD')}
              onChange={(e) =>
                onChangeHandler('licenceExpiryDate', e.target.value)
              }
            />
          </div>
          <label htmlFor="LicenceType">
            Check attached SMC Practicing Certification :{' '}
          </label>
          <div className="img-container">
            {user && (
              <Image
                thumbnail="true"
                fluid="true"
                className="img-content"
                src={`data:image/png;base64,${Buffer.from(
                  user.image_smc.data
                ).toString('base64')}`}
                alt="profile-picture"
                onClick={() => handleShowImageOrPdfViewer(user.image_smc.data)}
              />
            )}
          </div>
          <label htmlFor="LicenceType">Check attached ACRA licence : </label>
          <div className="img-container">
            {user && (
              <>
                {/* <object>
                  <embed className="pdf-content" type="text/html" src={`data:application/pdf;base64,${Buffer.from(
                    user.image_acra.data
                  ).toString("base64")}`} />
                </object> */}
                <Button
                  onClick={(e) =>
                    handleShowImageOrPdfViewer(user.image_acra.data)
                  }
                >
                  View Image/PDF Document
                </Button>
              </>
            )}
          </div>
          <div className="data-fields">
            <div className="profile-input-fields">
              {user && (
                <>
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="username"
                    required={false}
                    field="Username"
                    value={user.username}
                    readOnly={true}
                  />
                  <InputField
                    id="firstName"
                    required={false}
                    field="First Name"
                    value={user.firstName}
                    readOnly={true}
                  />
                  <InputField
                    id="lastName"
                    required={false}
                    field="Last Name"
                    value={user.lastName}
                    readOnly={true}
                  />
                  <InputField
                    id="nationality"
                    required={false}
                    field="Nationality"
                    value={user.nationality}
                    readOnly={true}
                  />
                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="email"
                    required={false}
                    field="Email"
                    value={user.email}
                    readOnly={true}
                  />
                  <InputField
                    id="mobile"
                    required={false}
                    field="Mobile"
                    value={user.mobile}
                    readOnly={true}
                  />
                  <InputField
                    id="phone"
                    required={false}
                    field="Phone"
                    value={user.phone}
                    readOnly={true}
                  />
                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="companyName"
                    required={false}
                    field="Company Name"
                    value={user.companyName}
                    readOnly={true}
                  />
                  <InputField
                    id="companyAddress"
                    required={false}
                    field="Company Address"
                    value={user.companyAddress}
                    readOnly={true}
                  />
                  <InputField
                    id="companyPostal"
                    required={false}
                    field="Company Postal"
                    value={user.companyPostal}
                    readOnly={true}
                  />
                  <InputField
                    id="countryIncorporation"
                    required={false}
                    field="Country of Incorporation"
                    value={user.countryIncorporation}
                    readOnly={true}
                  />

                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="accountType"
                    required={false}
                    field="accountType"
                    value={user.accountType}
                    readOnly={true}
                  />
                  <InputField
                    id="deliveryAddress"
                    required={false}
                    field="Delivery Address"
                    value={user.deliveryAddress}
                    readOnly={true}
                  />
                  <InputField
                    id="deliveryPostal"
                    required={false}
                    field="Delivery Postal"
                    value={user.deliveryPostal}
                    readOnly={true}
                  />

                  {/* </div> */}
                </>
              )}
            </div>
          </div>
          <div className="modal_content">
            <div className="select_option">
              <label htmlFor="billingType">Billing Type</label>
              <Select
                name="billingType"
                options={billingTypeValues}
                onChange={(e) => onChangeHandler('billingType', e)}
              />
            </div>
            <div className="select_option">
              <label htmlFor="priceTier">Price Tier</label>
              <Select
                name="priceTier"
                options={priceTierValues}
                onChange={(e) => onChangeHandler('priceTier', e)}
              />
            </div>
            <div className="select_option">
              <label htmlFor="adminControl">Admin Control</label>
              <Select
                name="adminControl"
                options={adminControlValues}
                onChange={(e) => onChangeHandler('adminControl', e)}
              />
            </div>
            <div className="select_option">
              <label htmlFor="status">Status</label>
              <Select
                name="status"
                options={statusValues}
                onChange={(e) => onChangeHandler('status', e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="lezada-button lezada-button--medium"
            onClick={updateButtonHandler}
          >
            Update
          </button>
          <button
            className="lezada-button lezada-button--medium lezada-button--transparent-button"
            onClick={deleteButtonHandler}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserModal;
