import React, { useState } from "react";
import "../css/register.css";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Register(props) {
  const navigate = useNavigate();
  const [showPsw, setShowPsw] = useState(false);
  const [notifyErr, setNotifyErr] = useState({});
  const [rgOk, setRgOk] = useState("");
  const initialValue = {
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: 0,
    createDate: "",
    birthday: "",
  };
  const [formValue, setFormValue] = useState(initialValue);
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormValue({ ...formValue, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formValue);
    let notify = {};
    let flag = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let now = new Date();
    formValue.createDate =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    if (formValue.email === "") {
      notify.email = "Vui lòng nhập email.";
      flag = false;
    } else if (!regex.test(formValue.email)) {
      notify.email = "Email không đúng định dạng.";
      flag = false;
    }
    if (!formValue.name === "") {
      notify.name = "Vui lòng nhập tên.";
      flag = false;
    } else if (formValue.name.length < 5) {
      notify.name = "Tên tối thiểu là 5 ký tự.";
      flag = false;
    } else if (formValue.name.length > 30) {
      notify.name = "Tên quá dài, tối đa là 30 ký tự";
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
    if (formValue.repeatPassword !== formValue.password) {
      notify.repeatPassword = "Lặp lại mật khẩu không đúng";
      flag = false;
    }
    if (!formValue.birthday) {
      notify.birthday = "Vui lòng nhập ngày sinh";
      flag = false;
    }

    if (flag === false) {
      setNotifyErr(notify);
      return;
    }
    axios
      .post("http://localhost:3579/api/v1/user/register", formValue)
      .then((res) => {
        console.log(res);
        setNotifyErr({});
        setRgOk("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 1300);
      })
      .catch((err) => {
        console.log(err.response.data);
        let notifyErr = {};
        notifyErr.email = err.response.data.message;
        setNotifyErr(notifyErr);
        window.scrollTo(0, 0);
      });
  };
  return (
    <div className="signupWrapper">
      <div className="formWrapper">
        <div className="iconRegisterWrapper">
          <PinterestIcon
            style={{ color: "red", fontSize: "32px", cursor: "pointer" }}
          />
          {/* <CloseIcon className="closeIconRegister" /> */}
        </div>
        <div className="titleRegister">
          <h2>Chào mừng tới Pinterest</h2>
          <h2>Đăng ký</h2>
          <h2 style={{ color: "red" }}>{rgOk}</h2>
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
            <label>Tên</label>
            <p className="notifyRegister">{notifyErr.name}</p>
            <div className="wrapperInput">
              <input
                value={formValue.name}
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Tên của bạn"
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
          <div>
            <label>Nhập lại mật khẩu</label>
            <p className="notifyRegister">{notifyErr.repeatPassword}</p>
            <div className="wrapperInput psw">
              <input
                value={formValue.repeatPassword}
                onChange={handleChange}
                type={showPsw ? "text" : "password"}
                name="repeatPassword"
                placeholder="Nhập lại mật khẩu"
              />
              {showPsw ? (
                <RemoveRedEyeIcon
                  className="password"
                  onClick={() => setShowPsw(false)}
                  VisibilityOffIcon
                ></RemoveRedEyeIcon>
              ) : (
                <VisibilityOffIcon
                  className="password"
                  onClick={() => setShowPsw(true)}
                ></VisibilityOffIcon>
              )}
            </div>
          </div>
          <div>
            <label>Ngày sinh</label>
            <p className="notifyRegister">{notifyErr.birthday}</p>
            <div className="wrapperInput psw">
              <input
                type="date"
                name="birthday"
                onChange={handleChange}
                value={formValue.birthday}
              />
            </div>
          </div>
          <button className="submitButton" type="submit">
            Tiếp tục
          </button>
        </form>
        <div>
          Đã có tài khoản?{" "}
          <span>
            <Link to="/login">Đăng nhập</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
