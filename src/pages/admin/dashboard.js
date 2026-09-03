import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCloudDownloadAlt, FaRegEdit } from 'react-icons/fa';
import { LayoutTwo } from '../../components/Layout';
import { BreadcrumbOne } from '../../components/Breadcrumb';
import withAuth from '../../hoc/withAuth';
import PendingUsersTable from '../../components/Admin/pendingUsersTable';
import ActiveUsersTable from '../../components/Admin/activeUsersTable';
import { PendingList } from '../../components/Products';
import { AllBillings } from '../../components/Billings';
import { AdminOrdersList } from '../../components/Orders';

const Dashboard = () => {
  const [userDataUpdated, setUserDataUpdated] = useState(false);

  const handleUserDataUpdated = () => {
    setUserDataUpdated(!userDataUpdated);
  };

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Dashboard"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/admin/dashboard" as={process.env.PUBLIC_URL + '/'}>
              <a>Admin</a>
            </Link>
          </li>

          <li>Dashboard</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="newRequests">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
              {/*
              <Nav.Item>
                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              */}
              <Nav.Item>
                <Nav.Link eventKey="newRequests">New Requests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="billings">Billings</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="newRequests">
                <PendingUsersTable
                  userDataUpdated={userDataUpdated}
                  handleUserDataUpdated={handleUserDataUpdated}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="users">
                <ActiveUsersTable
                  userDataUpdated={userDataUpdated}
                  handleUserDataUpdated={handleUserDataUpdated}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="dashboard"></Tab.Pane>
              <Tab.Pane eventKey="orders">
                <AdminOrdersList />
              </Tab.Pane>
              <Tab.Pane eventKey="billings">
                <AllBillings />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withAuth(Dashboard);
