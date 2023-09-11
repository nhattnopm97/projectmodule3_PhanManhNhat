import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/setting.css";
import { Link, useNavigate } from "react-router-dom";

function SettingProfile(props) {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formValue, setFormValue] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState(null);
  const loadUserLogin = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    console.log(userLocal);
    axios({
      method: "GET",
      url: "http://localhost:3579/api/v1/user/" + userLocal.id,
      headers: {
        Authorization: `Bearer ${userLocal.token}`,
      },
    })
      .then((response) => {
        // Xử lý response thành công
        console.log(response.data.user);
        if (response.data.user.url === null) {
          response.data.user.url = "";
        }
        if (response.data.user.description === null) {
          response.data.user.description = "";
        }
        setUserLogin(response.data.user);
        setFormValue(response.data.user);
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error(error);
        setUserLogin(null);
      });
  };
  useEffect(() => {
    loadUserLogin();
  }, []);
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   let userLocal = JSON.parse(localStorage.getItem("userLocal"));
  //   if (image) {
  //     const formData = new FormData();
  //     formData.append("avatar", image);

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:3579/api/v1/user/avatar",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${userLocal.token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data.data);
  //       const fileName = response.data.data.split("\\").pop();
  //       console.log(fileName);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const handleInputChangetext = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    console.log(userLogin);
    setFormValue({ ...formValue, [name]: value });
    setIsUpdating(true);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Xem trước ảnh
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      console.log(reader.result);
    };
    reader.readAsDataURL(file);
    setIsUpdating(true);
  };

  const resetFormvalue = () => {
    setIsUpdating(false);
    setUserLogin({ ...userLogin });
    setFormValue({ ...userLogin });
    setPreviewImage(null);
  };

  const handleUpdate = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (image) {
      const formData = new FormData();
      formData.append("avatar", image);

      try {
        const response = await axios.post(
          "http://localhost:3579/api/v1/user/avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userLocal.token}`,
            },
          }
        );
        console.log(response);
        console.log(response.data.data);
        const fileName = response.data.data.split("\\").pop();
        console.log(fileName);
        formValue.avartar = `http://localhost:3579/${fileName}`;
        axios({
          method: "PUT",
          url: "http://localhost:3579/api/v1/user/" + userLocal.id,
          headers: {
            Authorization: `Bearer ${userLocal.token}`,
          },
          data: formValue,
        })
          .then((res) => {
            console.log(res);
            navigate("/profile/" + userLocal.id);
          })
          .catch((err) => {
            console.log(err);
            alert("Loi server");
          });
      } catch (error) {
        console.error(error);
        alert("Loi server");
      }
    } else {
      axios({
        method: "PUT",
        url: "http://localhost:3579/api/v1/user/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: formValue,
      })
        .then((res) => {
          console.log(res);
          navigate("/profile/" + userLocal.id);
        })
        .catch((err) => {
          console.log(err);
          alert("Loi server");
        });
    }
  };

  return (
    <div>
      <div className="profileContainer">
        <div className="choosenContainer">
          <div>
            <Link className="itemInChoosen activeClick">Hồ sơ công khai</Link>
          </div>
          <div>
            <Link className="itemInChoosen">Thông tin cá nhân</Link>
          </div>
          <div>
            <Link className="itemInChoosen">Quản lý tài khoản</Link>
          </div>
        </div>
        <div className="informationProfile">
          <h2>Hồ sơ công khai</h2>
          <span>Người truy cập hồ sơ của bạn sẽ thấy thông tin sau</span>
          <div className="itemInformation">
            <div>Ảnh</div>
            <div className="avatarSetting">
              <img
                src={
                  formValue.avartar === null
                    ? "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
                    : formValue.avartar
                }
                alt=""
              />
              <button>
                Thay đổi
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  style={{ opacity: 0 }}
                  onChange={handleInputChange}
                />
              </button>
              <img
                style={{ width: "100px", height: "100px" }}
                src={previewImage}
                alt=""
              />
            </div>
          </div>
          {/* <div className="nameWrapper">
            <div>
              <div>Tên</div>
              <div className="inputNameWrapper">
                <input type="text" value={formValue?.ten} />
              </div>
            </div>
            <div>
              <div>Họ</div>
              <div className="inputNameWrapper">
                <input type="text" value={formValue?.ho} />
              </div>
            </div>
          </div> */}
          <div className="introduce">
            <span>Giới thiệu</span>
            <div>
              <textarea
                row="3"
                type="text"
                name="description"
                maxLength="300"
                value={formValue?.description}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="websiteWrapper">
            <span>Trang web</span>
            <div>
              <input
                type="text"
                name="url"
                maxLength="300"
                value={formValue?.url}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="userNameWrapper">
            <span>Tên người dùng</span>
            <div>
              <input
                maxLength="30"
                type="text"
                name="name"
                value={formValue?.name}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="settingAndSave">
        <button onClick={resetFormvalue}>Thiết lập lại</button>
        {isUpdating === true ? (
          <div className="updating" onClick={handleUpdate}>
            Lưu
          </div>
        ) : (
          <button>Lưu</button>
        )}
      </div>
    </div>
  );
}

export default SettingProfile;
