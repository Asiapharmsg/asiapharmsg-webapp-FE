import { useState, createRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { InputField } from "../../components/Form";
import { login } from "../../redux/actions/userActions";
import { useToasts } from "react-toast-notifications";
import Link from "next/link";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-dark pr-4 pl-4",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

const Reset = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const recaptchaRef = createRef();
  const router = useRouter();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const captchaHandler = (e) => {
    console.log(e);
    setCaptchaValue(e);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (credentials.password == "") {
      recaptchaRef.current?.reset();
      addToast("Please enter a password", { appearance: "error" });
      return;
    }
    if (credentials.password_confirm == "") {
      recaptchaRef.current?.reset();
      addToast("Please enter a password confirm", { appearance: "error" });
      return;
    }
    setLoading(true);

    //configure credientials
    credentials.userid = 3;
    credentials.resetString = "localhost:3000/user/resetpassword/";

    axios
      .post(`${process.env.API_URL}/user/resetpassword`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        if (resp.status === 200) {
          setLoading(false);
          if (resp.data.status === "Pending") {
            addToast(
              "An Admin will approve your account first.\nPlease try again later.",
              { appearance: "info" }
            );
            recaptchaRef.current?.reset();
            setCredentials({ username: "", password: "" });
            return;
          } else if (resp.data.status === "Rejected") {
            addToast(
              "Your account approval was reject. Please try creating an account again.",
              { appearance: "error" }
            );
            recaptchaRef.current?.reset();
            setCredentials({ username: "", password: "" });
            return;
          } else {
            dispatch(
              login(resp.data.username, resp.data.token, resp.data.isAdmin)
            );
            localStorage.setItem("token", resp.data.token);
            addToast("Login successful!", { appearance: "success", autoDismiss: true  });
            recaptchaRef.current?.reset();
            setCredentials({ username: "", password: "" });

            setTimeout(() => {
              if (resp.data.isAdmin) {
                router.push("/admin/dashboard");
              } else {
                router.push("/");
              }
            }, 500);
          }
        } else {
          setLoading(false);
          recaptchaRef.current?.reset();
          addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
            appearance: "error",
          });
        }
      })
      .catch((err) => {
        console.log("Error: ", err.response);
        setLoading(false);
        recaptchaRef.current?.reset();
        addToast(`${err.response.data.error ?? err.response.data.errors[0]}`, {
          appearance: "error",
        });
      });
  };
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Reset Password"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Reset Password</li>
        </ul>
      </BreadcrumbOne>
      <div className="login-area space-mt--r130 space-mb--r130">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="space-mb-mobile-only--50 ">
              <div className="lezada-form login-form">
                <form>
                  <Row>
                    <Col lg={12}>
                      <div className="section-title--login text-center space-mb--50">
                        <h2 className="space-mb--20">Reset Password</h2>
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <InputField
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <InputField
                        type="password"
                        id="password_confirm"
                        name="password_confirm"
                        value={credentials.password_confirm}
                        placeholder="Password Confirm"
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--30 text-center">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={onSubmitHandler}
                      >
                        {loading ? <Loader /> : "Reset"}
                      </button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     login: (username, token, isAdmin) =>
//       dispatch(login(username, token, isAdmin)),
//   };
// };

export default Reset;
// export default connect(null, mapDispatchToProps)(Login);
