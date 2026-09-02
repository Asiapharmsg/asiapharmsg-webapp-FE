import React, { useState, useEffect } from 'react';
import { useFetchAllBillings } from '../../hooks/billings';
import dayjs from 'dayjs';
import { getOrderStatus } from '../../utils';
// import { IoMdEye } from 'react-icons/io';
import ReactToPdf from 'react-to-pdf';

const checkBillings = (billings) => {
  return Array.isArray(billings) ? billings : [];
};

export default function AllBillings() {
  const { data: billings, status } = useFetchAllBillings();
  let total_price = 0;

  const sanitizedBillings = checkBillings(billings);

  sanitizedBillings.map((b) => {
    total_price += Number(b?.billing_price);
  });

  const years = [0, 2026, 2025, 2024, 2023, 2022, 2021];
  const months = [
    { value: 0, label: 'All' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const [filterOptions, setFilterOptions] = useState({
    year: 0,
    month: 0,
    company: 0
  });

  const [filteredBillings, setFilteredBillings] = useState([]);

  useEffect(() => {
    if (sanitizedBillings) {
      setFilteredBillings(sanitizedBillings);
    }
  }, [JSON.stringify(sanitizedBillings)]);

  const onChangeFilters = ({ year, month, company }) => {
    let tempNewState = [...sanitizedBillings];
    console.log(year, month);
    if (Number(year) !== 0 && Number(month) === 0) {
      tempNewState = tempNewState.filter(
        (billing) => dayjs(billing.createdAt).format('YYYY') === year
      );

      // setFilteredBillings(
      //   sanitizedBillings.filter(
      //     (billing) => dayjs(billing.createdAt).format('YYYY') === year
      //   )
      // );
    } else if (Number(year) === 0 && Number(month) !== 0) {
      tempNewState = tempNewState.filter(
        (billing) =>
          parseInt(dayjs(billing.createdAt).format('MM')) === parseInt(month)
      );

      // setFilteredBillings(
      //   sanitizedBillings.filter(
      //     (billing) =>
      //       parseInt(dayjs(billing.createdAt).format('MM')) === parseInt(month)
      //   )
      // );
    } else if (Number(year) !== 0 && Number(month) !== 0) {
      tempNewState = tempNewState.filter(
        (billing) =>
          parseInt(dayjs(billing.createdAt).format('MM')) === parseInt(month) &&
          dayjs(billing.createdAt).format('YYYY') === year
      );

      // setFilteredBillings(
      //   sanitizedBillings.filter(
      //     (billing) =>
      //       parseInt(dayjs(billing.createdAt).format('MM')) ===
      //         parseInt(month) &&
      //       dayjs(billing.createdAt).format('YYYY') === year
      //   )
      // );
    }
    if (company !== 'All') {
      tempNewState = tempNewState.filter((b) => b.user.company_name == company);
    }
    setFilteredBillings([...tempNewState]);
  };

  const ref = React.createRef();
  const options = {
    orientation: 'p',
    unit: 'mm',
    format: [300, 700]
  };

  const getTotalPrice = () => {
    total_price = 0;
    filteredBillings?.map((b) => {
      total_price += Number(b?.billing_price);
    });
    return total_price;
  };

  const getCompanyUniqueNames = () => {
    if (sanitizedBillings.length > 0) {
      const names = sanitizedBillings.map((b) => b.user.company_name);
      const uniqueNames = [...new Set(names)];
      return ['All', ...uniqueNames];
    } else {
      return [];
    }
  };

  return (
    <div className="my-account-area__content">
      <h3>Billings</h3>
      <div className="single-icon filter-dropdown">
        <div className="filterItem">
          <label htmlFor="year" className="required">
            Year :
          </label>
          <select
            style={{ height: '100%', minWidth: '120px' }}
            value={filterOptions?.year}
            onChange={(e) => {
              onChangeFilters({ ...filterOptions, year: e.target.value });
              setFilterOptions({ ...filterOptions, year: e.target.value });
            }}
          >
            {years.map((item, num) => (
              <option key={num} value={item}>
                {item === 0 ? 'All' : item}
              </option>
            ))}
          </select>
        </div>
        <div className="filterItem">
          <label htmlFor="month" className="required">
            Month :
          </label>
          <select
            style={{ height: '100%', minWidth: '120px' }}
            value={filterOptions?.month}
            onChange={(e) => {
              onChangeFilters({ ...filterOptions, month: e.target.value });
              setFilterOptions({ ...filterOptions, month: e.target.value });
            }}
          >
            {months.map((item, num) => (
              <option key={num} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filterItem">
          <label htmlFor="year" className="required">
            Company :
          </label>
          <select
            style={{ height: '100%', minWidth: '120px' }}
            value={filterOptions?.company}
            onChange={(e) => {
              onChangeFilters({ ...filterOptions, company: e.target.value });
              setFilterOptions({ ...filterOptions, company: e.target.value });
            }}
          >
            {getCompanyUniqueNames().map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="myaccount-table table-responsive text-center" ref={ref}>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Company</th>
              <th>Billing ID</th>
              <th>Order Detail ID</th>
              <th>Created On</th>
              <th>Status</th>
              <th>Billing Price</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && 'Loading...'}
            {status === 'success' && sanitizedBillings?.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <h3 className="my-5">
                    There are no billings at this moment.
                  </h3>
                </td>
              </tr>
            )}

            {!!filteredBillings?.length &&
              filteredBillings?.map((b) => (
                <tr>
                  <td>{b?.user.company_name}</td>
                  <td>
                    {dayjs(b?.createdAt).format('DDMMYYYY')}
                    {b?.id}
                  </td>
                  <td>{b?.order_detail_id}</td>
                  <td>{dayjs(b?.createdAt).format('MMM D, YYYY, hh:mm A')}</td>
                  <td>{getOrderStatus(b?.status)}</td>
                  <td>${b?.billing_price}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Total</th>
              <th>{getTotalPrice()}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="single-input-item ml-2">
        <ReactToPdf
          targetRef={ref}
          filename="billings.pdf"
          options={options}
          x={0.5}
          y={0.5}
          scale={1}
        >
          {({ toPdf }) => (
            <button
              className="lezada-button lezada-button--small product-content__ofs space-mr--10"
              onClick={toPdf}
            >
              Generate pdf
            </button>
          )}
        </ReactToPdf>
      </div>
    </div>
  );
}
