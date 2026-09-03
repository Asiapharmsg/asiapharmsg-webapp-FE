import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { Spinner } from "react-bootstrap";
import Table from "../Table";
import Modal from "./pendingUsersModal";
import moment from "moment";
import axios from "axios";
import { IoMdEye } from 'react-icons/io';

const PendingUsersTable = ({ userDataUpdated, handleUserDataUpdated }) => {
  const [apiData, setApiData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);

  const [requestTableData, setRequestTableData] = useState({
    headers: [
      "No.",
      "Username",
      "Email",
      "Account Type",
      "Account Created At",
      "Action",
    ],
    data: [],
  });
  const token = useSelector((state) => state.user.token);
  const { addToast } = useToasts();
  const router = useRouter();

  const handleShowModal = (user) => {
    setModalData((prev) => {
      return { ...prev, user: user, userId: user.id, username: user.username };
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ ...modalData, userId: "", username: "" });
  };
  //Refresh table 
  const updateRequestTable = (username) => {
    const updatedTableData = requestTableData.data.filter(
      (item) => item.username !== username
    );
    setRequestTableData({ ...requestTableData, data: updatedTableData });
  };

  useEffect(() => {
    console.log("Pending");
    setLoading(true);
    if (!token) {
      addToast("Unauthorized Request", { appearance: "error" });
      setLoading(false);
      router.replace("/user/login");
      return;
    }
    axios
      .get(`${process.env.API_URL}/admin/usersList/Pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        const data = resp.data;
        if (resp.status >= 400) {
          console.log("Status error: ", resp.data);
          addToast(resp.data.error, { appearance: "error" });
          setLoading(false);
        } else {
          setApiData(data);
        }
      })
      .catch((error) => {
        const errorMsg = error.response.data.error;
        if (errorMsg === "Error parsing auth token") {
          addToast("Unauthorized Request", { appearance: "error" });
          router.replace("/user/login");
          return;
        }
      });
  }, [userDataUpdated]);

  useEffect(() => {
    if (apiData.userList) {
      setModalData({
        ...modalData,
        statusValues: apiData.statusValues,
        billingTypeValues: apiData.billingTypeValues,
        priceTierValues: apiData.priceTierValues,
        adminControlValues: apiData.adminControlValues,
      });
      const tableData = apiData.userList.map((item, userNo) => ({
        no: userNo + 1,
        username: item.username,
        email: item.email,
        accountType: item.accountType,
        createdAt: moment(item.createdAt).format("DD/MM/YYYY hh:mm:ss"),
        action: (
          <IoMdEye
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleShowModal(item);
            }}
          />
        ),
      }));
      setRequestTableData({ ...requestTableData, data: tableData });
      setLoading(false);
    }
  }, [apiData]);

  if (loading) {
    return (
      <div className="loader_container">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        data={modalData}
        onClose={handleCloseModal}
        updateRequestTable={updateRequestTable}
        handleUserDataUpdated={handleUserDataUpdated}
      />
      <div>
        <div className="my-account-area__content">
          {requestTableData.data.length === 0 ? (
            <h4>No new user requests</h4>
          ) : (
            <>
              <h3>New Requests</h3>
              <div className="myaccount-table table-responsive text-center">
                <Table
                  headers={requestTableData.headers}
                  data={requestTableData.data}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PendingUsersTable;
