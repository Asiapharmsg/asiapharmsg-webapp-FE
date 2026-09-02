import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const withSingleAuth = (Component) => (props) => {
  const [allowToProceed, setAllowToProceed] = useState(true);
  const user = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user.isAuthenticated) {
      router.replace("/");
      setAllowToProceed(false);
    }
  }, []);

  if (allowToProceed) {
    return <Component {...props} />;
  } else {
    return null;
  }
};

export default withSingleAuth;
