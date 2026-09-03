import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import { IoMdEye } from 'react-icons/io';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

import Modal from './activeUsersModal';

const ActiveUsersTable = ({ userDataUpdated, handleUserDataUpdated }) => {
  const [apiData, setApiData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useToasts();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const token = useSelector((state) => state.user.token);
  const router = useRouter();

  const onGlobalFilterChange = (e) => {
    const { value } = e.target;
    const _filters = { ...filters };

    _filters.global.value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleShowModal = (user) => {
    setModalData((prev) => {
      return { ...prev, user: user };
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ ...modalData, user: null });
  };

  useEffect(() => {
    console.log('Active');
    setLoading(true);
    if (!token) {
      addToast('Unauthorized Request', { appearance: 'error' });
      setLoading(false);
      router.replace('/user/login');
      return;
    }
    axios
      .get(
        `${process.env.API_URL}/admin/get-user-admin-paging/Active?page=${currentPage}&page_size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((resp) => {
        const data = resp.data;
        console.log('Data: ', data);
        if (resp.status >= 400) {
          console.log('Status error: ', resp.data);
          addToast(resp.data.error, { appearance: 'error' });
        } else {
          console.log('DATA: ', data);
          setApiData(data);
          const hasMorePages = data.userList.length >= pageSize;
          setHasMorePages(hasMorePages);
          setTotalPages(data.total_pages);
        }
      })
      .catch((error) => {
        const errorMsg = error.response.data.error;
        if (errorMsg === 'Error parsing auth token') {
          addToast('Unauthorized Request', { appearance: 'error' });
          router.replace('/user/login');
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userDataUpdated, currentPage, pageSize]);

  const renderButton = (userItem) => (
    <IoMdEye
      style={{ cursor: 'pointer' }}
      size={20}
      onClick={() => handleShowModal(userItem)}
    />
  );

  const handlePageSizeChange = (event) => {
    setPageSize(event.value);
    setCurrentPage(1);
  };

  // useEffect(() => {
  //   if (apiData.userList) {
  //     setModalData({
  //       ...modalData,
  //       statusValues: apiData.statusValues,
  //       billingTypeValues: apiData.billingTypeValues,
  //       priceTierValues: apiData.priceTierValues,
  //       adminControlValues: apiData.adminControlValues
  //     });
  //     const tableData = apiData.userList.map((item, userNo) => ({
  //       no: userNo + 1,
  //       username: item.username,
  //       email: item.email,
  //       accountType: item.accountType,
  //       createdAt: moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
  //       lastLoginAt: moment(item.lastLoginAt).format('DD/MM/YYYY hh:mm:ss'),
  //       action: (
  //         <IoMdEye
  //           style={{ cursor: 'pointer' }}
  //           onClick={() => {
  //             handleShowModal(item);
  //           }}
  //         />
  //       )
  //     }));
  //     setRequestTableData({ ...requestTableData, data: tableData });
  //     setLoading(false);
  //   }
  // }, [apiData]);

  const header = renderHeader();

  if (loading) {
    return (
      <div className="loader_container">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!apiData?.userList?.length)
    return (
      <div className="loader_container">
        <h6>No users found</h6>
      </div>
    );

  return (
    <>
      <div className="card myaccount-table table-responsive my-account-area__content p-0">
        <DataTable
          value={apiData.userList}
          scrollable
          scrollHeight="700px"
          // showGridlines
          style={{ minWidth: '50rem' }}
          stripedRows
          filters={filters}
          emptyMessage="No Users found."
          header={header}
        >
          <Column field="id" header="ID" sortable />
          <Column
            field="username"
            header="Username"
            bodyClassName="text-center"
            alignHeader="center"
          />
          <Column
            field="email"
            header="Email"
            bodyClassName="text-center"
            alignHeader="center"
          />
          <Column
            field="accountType"
            header="Account Type"
            bodyClassName="text-center"
            alignHeader="center"
          />
          <Column
            header="Account Creation Date"
            body={(userItem) =>
              moment(userItem.createdAt).format('DD/MM/YYYY hh:mm:ss')
            }
            bodyClassName="text-center"
            alignHeader="center"
          />
          <Column
            header="Last Login Date"
            body={(userItem) =>
              moment(userItem.lastLoginAt).format('DD/MM/YYYY hh:mm:ss')
            }
            bodyClassName="text-center"
            alignHeader="center"
          />
          <Column
            header="Actions"
            body={renderButton}
            alignHeader="center"
            bodyClassName="text-center"
          />
        </DataTable>
        <div className="col-3 my-3 text-white flex flex-wrap justify-content-center gap-3">
          <Button
            label="Previous Page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded"
          />
          <span className=" text-black-50 mx-2 ">
            {' '}
            Page {currentPage} of {totalPages}
          </span>
          <Button
            label="Next Page"
            onClick={() => handlePageChange(currentPage + 1)}
            className="rounded mr-3 "
            disabled={!hasMorePages}
          />
          <Dropdown
            value={pageSize}
            options={[10, 25, 50, 100]}
            onChange={handlePageSizeChange}
          />
        </div>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          data={modalData}
          onClose={handleCloseModal}
          handleUserDataUpdated={handleUserDataUpdated}
        />
      </div>
    </>
  );
};

export default ActiveUsersTable;
