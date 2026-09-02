import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { useRouter } from "next/router";
import axios from "axios";

const withAuth = (Component) => (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const verify = async (token) => {
    try {
      const resp = await axios.get(`${process.env.API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { authenticated } = resp.data;
      if (authenticated) {
        if (user.isAdmin && router.asPath === "/admin/dashboard") {
          setIsAuthenticated(true);
        } else if (user.isAdmin && router.asPath === "/user/my-account") {
          router.back();
        } else if (!user.isAdmin && router.asPath === "/admin/dashboard") {
          router.back();
        } else if (!user.isAdmin && router.asPath === "/user/my-account") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        dispatch(logout());
        router.replace("/user/login");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      dispatch(logout());
      router.replace("/user/login");
      setIsAuthenticated(false);
    }
  };

  const reloadVerify = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      router.replace("/user/login");
    } 
    else {
      verify(token);
    }
  }

  useEffect(() => {
    const reload = setInterval(reloadVerify, 300000)
    return () => {
      clearInterval(reload);
    };
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      router.replace("/user/login");
    } else {
      verify(token);
    }
  }, []);

  if (isAuthenticated) {
    return <Component {...props} />;
  } else {
    return <></>;
  }
};

export default withAuth;
