import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { InputField } from "../../components/Form";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import axios from "axios";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-dark pr-4 pl-4",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const Forget = () => {
  const [errorMsg, setErrorMsg] = useState({
    email: ""
  });

  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [credentials, setCredentials] = useState({
    username: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "email" && !validEmailRegex.test(value)) 
    {
      setErrorMsg({ ...errorMsg, email: "Invalid email" });
    } 
    else if (name === "email" && validEmailRegex.test(value)) 
    {
      setErrorMsg({ ...errorMsg, email: "" });
    }
    setCredentials({ ...credentials, [name]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (credentials.email == "") {
      swalWithBootstrapButtons.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your user email",
        timer: 1500,
      });
      return;
    }
    setLoading(true);

    //configur url 
    credentials.redirectUrl = "localhost:3000/user/resetpassword/";

    axios
      .post(`${process.env.API_URL}/user/forgetpassword`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        if (resp.status === 200) {
          setLoading(false);
          localStorage.setItem("token", resp.data.token);
          swalWithBootstrapButtons.fire({
            icon: "success",
            title: "Success",
            text: `${resp.data.message}`,
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            router.push("/");
          }, 1500);
          setCredentials({ username: ""});
        } else {
          setLoading(false);
          swalWithBootstrapButtons.fire({
            icon: "error",
            title: "Error",
            text: `${resp.data.error ?? resp.data.errors[0]}`,
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        console.log("Error: ", err.response);
        setLoading(false);
        swalWithBootstrapButtons.fire({
          icon: "error",
          title: "Error",
          text: `${err.response.data.error ?? err.response.data.errors[0]}`,
          timer: 1500,
        });
      });
  };
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Forget Password"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Forget Password</li>
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
                        <h2 className="space-mb--20">Forget Password</h2>
                      </div>
                    </Col>
                    <Col lg={12} className="space-mb--60">
                      <InputField
                        type="text"
                        id="email"
                        name="email"
                        value={credentials.email}
                        placeholder="Email address"
                        errorMsg= {errorMsg.email}
                        onChange={onChangeHandler}
                      />
                    </Col>
                    <Col lg={12} className="space-mb--30 text-center">
                      <button
                        className="lezada-button lezada-button--medium"
                        onClick={onSubmitHandler}
                      >
                        {loading ? <Loader /> : "send"}
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

export default Forget;
