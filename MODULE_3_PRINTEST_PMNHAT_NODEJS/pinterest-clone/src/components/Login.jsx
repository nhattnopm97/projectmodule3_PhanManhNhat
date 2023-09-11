import React, { useState } from "react";
import "../css/login.css";
import PinterestIcon from "@mui/icons-material/Pinterest";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Login(props) {
  const navigate = useNavigate();
  const [showPsw, setShowPsw] = useState(false);
  const [notifyErr, setNotifyErr] = useState({});
  const [message, setMessage] = useState("");
  const initialValue = {
    email: "",
    password: "",
  };
  const [formValue, setFormValue] = useState(initialValue);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormValue({ ...formValue, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let notify = {};
    let flag = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (formValue.email === "") {
      notify.email = "Vui lòng nhập email.";
      flag = false;
    } else if (!regex.test(formValue.email)) {
      notify.email = "Email không đúng định dạng.";
      flag = false;
    }

    if (formValue.password === "") {
      notify.password = "Vui lòng tạo mật khẩu";
      flag = false;
    } else if (
      formValue.password.length < 6 &&
      formValue.password.length > 18
    ) {
      notify.password = "Độ dài ký tự chỉ trong khoảng 6 đến 18 ký tự";
      flag = false;
    }
    if (flag === false) {
      setNotifyErr(notify);
      return;
    }
    console.log("formValue", formValue);
    axios
      .post("http://localhost:3579/api/v1/user/login", formValue)
      .then((res) => {
        console.log(res.data);
        setLoginSuccess(true);
        console.log(res.data.token);
        let a = res.data.data;
        let userLocal = { ...a, token: res.data.token };
        delete userLocal.password;
        console.log(userLocal);
        console.log("userLocal", userLocal);
        localStorage.setItem("userLocal", JSON.stringify(userLocal));
        setNotifyErr(notify);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          console.log(err.response.data.message);
          setMessage(err.response.data.message);
        } else {
          console.log("aaa");
        }
      });

    // if (a.data.message === "Đăng nhập thành công") {
    //   setLoginSuccess(true);
    //   // setTimeout(() => {
    //   //   window.location.href = "/";
    //   // }, 1000);
    // } else {
    //   alert(`aaaaaaaaaa`);
    // }
  };
  const [loginSuccess, setLoginSuccess] = useState(false);
  return (
    <div className="signupWrapper login">
      <div className="formWrapper">
        <div className="iconRegisterWrapper">
          <PinterestIcon
            style={{ color: "red", fontSize: "32px", cursor: "pointer" }}
          />
          {/* <CloseIcon className="closeIconRegister" /> */}
        </div>
        <div className="titleRegister">
          <h2>Chào mừng tới Pinterest</h2>
          <h2>Đăng nhập</h2>
          {loginSuccess && (
            <h2 style={{ color: "green" }}>Đăng nhập thành công!</h2>
          )}
          {message !== "" ? <h2 style={{ color: "red" }}>{message}</h2> : <></>}
          <span>Tìm và thử ý tưởng mới</span>
        </div>
        <form action="POST" className="form" onSubmit={handleSubmit}>
          <div className="email">
            <label>Email</label>
            <p className="notifyRegister">{notifyErr.email}</p>
            <div className="wrapperInput">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                value={formValue.email}
              />
            </div>
          </div>
          <div>
            <label>Mật khẩu</label>
            <p className="notifyRegister">{notifyErr.password}</p>
            <div className="wrapperInput psw">
              <input
                value={formValue.password}
                onChange={handleChange}
                type={showPsw ? "text" : "password"}
                name="password"
                placeholder="Tạo mật khẩu mới"
              />
              {showPsw ? (
                <RemoveRedEyeIcon
                  className="password"
                  onClick={() => setShowPsw(false)}
                ></RemoveRedEyeIcon>
              ) : (
                <VisibilityOffIcon
                  className="password"
                  onClick={() => setShowPsw(true)}
                ></VisibilityOffIcon>
              )}
            </div>
          </div>
          <button className="submitButton" type="submit">
            Tiếp tục
          </button>
        </form>
        <div>
          Chưa có tài khoản? <Link to="/register">Đăng ký!</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
