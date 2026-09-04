import React, { useState } from "react";
import Link from "next/link";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import withAuth from "../../hoc/withAuth";
import axios from "axios";

const ChangePassword = () => {
  const user = useSelector((state) => state.user);
  const [fields, setFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { addToast } = useToasts();

  const validPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (
        fields.currentPassword === "" &&
        fields.currentPassword === "" &&
        fields.confirmPassword === ""
      ) {
        return;
      }
      for (const key in fields) {
        if (!validPasswordRegex.test(fields[key])) {
          addToast(
            `Error in ${key}, Password must be minimum eight characters,
          at least one letter, one number and one special character`,
            {
              appearance: "error",
            }
          );
          return;
        }
      }
      if (fields.newPassword !== fields.confirmPassword) {
        addToast("Passwords do not match", {
          appearance: "error",
        });
        return;
      }

      const data = { ...fields };
      delete data.confirmPassword;
      const resp = await axios.put(
        `${process.env.API_URL}/user/update-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (resp.status == 200) {
        addToast(resp.data.message, {
          appearance: "success", autoDismiss: true 
        });
        setFields({
          currentPassword: "",
          confirmPassword: "",
          newPassword: "",
        });
      } else {
        addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
          appearance: "error", 
        });
      }
    } catch (err) {
      addToast(`${err.response?.data?.error ?? err.response?.data?.errors?.[0] ?? err.message}`, {
        appearance: "error",
      });
    }
  };

  return (
    <LayoutTwo>
      <BreadcrumbOne
        pageTitle="Change Password"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href={user.isAdmin ? "/admin/dashboard" : "/user/my-account"}>
              <a>{user.isAdmin ? "Admin" : "User"}</a>
            </Link>
          </li>

          <li>Change Password</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r100 space-mb--r130">
        <Container>
          <div className="my-account-area__content">
            <h3 className="pb-3">Password Change</h3>
            <div className="account-details-form">
              <form onSubmit={onSubmitHandler}>
                <div className="single-input-item">
                  <label htmlFor="currentPassword" className="required">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={fields.currentPassword}
                    onChange={onChangeHandler}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="single-input-item">
                      <label htmlFor="newPassword" className="required">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={fields.newPassword}
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="single-input-item">
                      <label htmlFor="confirmPassword" className="required">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={fields.confirmPassword}
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="single-input-item">
                  <button type="submit">Update</button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withAuth(ChangePassword);
