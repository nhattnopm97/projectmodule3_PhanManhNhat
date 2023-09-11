import React, { useEffect, useState } from "react";
import "../css/profile.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Create from "./Create";
import Collection from "./Collection";
import { Link } from "react-router-dom";
import axios from "axios";

function Profile(props) {
  const [isCreate, setIsCreate] = useState(true);
  const [userLogin, setUserLogin] = useState(null);
  const [collection, setCollection] = useState([]);
  const [subcriber, setSubscriber] = useState([]);
  const [subing, setSubing] = useState([]);
  const [detailCollection, setDetailCollection] = useState(null);
  // let userLocal = JSON.parse(localStorage.getItem("userLocal"));

  //Chỉ lấy tên của collection
  const loadCollections = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/collection/name/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          setCollection(response.data.collection);
          console.log("collection", response.data.collection);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  // lấy người subcriber
  const loadThings = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      try {
        //lấy người subcriber bạn
        let subcriber = await axios.get(
          `http://localhost:3579/api/v1/subcriber/${userLocal.id}`
        );
        console.log("subcriber", subcriber.data);
        setSubscriber(subcriber.data.subcriber);

        //lấy người mà bạn sub
        let subing = await axios.get(
          `http://localhost:3579/api/v1/subcriber/following/${userLocal.id}`
        );
        console.log("subcriber", subing.data);
        setSubing(subing.data.subcriber);
      } catch (error) {}
    } else {
      console.log("chua dang nhap");
      alert("Chua dang nhap");
    }
  };

  useEffect(() => {
    loadThings();
  }, [userLogin]);

  //lấy cả id và link của collection
  const loadDetailCollections = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/collection/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          setDetailCollection(response.data.detailCollection);
          console.log(response.data.detailCollection);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  //Check user login
  const loadUserLogin = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    console.log("userLocal", userLocal);

    axios({
      method: "GET",
      url: "http://localhost:3579/api/v1/user/" + userLocal.id,
      headers: {
        Authorization: `Bearer ${userLocal.token}`,
      },
    })
      .then((response) => {
        // Xử lý response thành công
        console.log(response);
        console.log(response.data.user);
        let a = response.data.user.email.split("@")[0];
        response.data.user.shortName = a;
        console.log("a", a);
        setUserLogin(response.data.user);
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error(error);
        setUserLogin(null);
      });
  };
  useEffect(() => {
    loadUserLogin();
    loadCollections();
    loadDetailCollections();
  }, []);
  return (
    <>
      {userLogin === null ? (
        <h2>Đăng nhập để chỉnh xem hồ sơ của mình</h2>
      ) : (
        <div className="WrapperProfile">
          <div className="wrapperAvartar">
            <img
              src={
                userLogin.avartar !== null
                  ? userLogin.avartar
                  : "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
              }
              alt=""
            />
          </div>
          <div>
            <h1>{userLogin.name}</h1>
          </div>
          <div className="userNameWrapper">{userLogin.shortName}</div>
          <div className="descriptionYourSelft">
            {userLogin.url && (
              <Link to={`http://${userLogin.url}`} target="_blank">
                {userLogin.url}
              </Link>
            )}
            .{userLogin.description && <span>{userLogin.description}</span>}
          </div>

          <div className="subcriberWrapper">
            {subcriber.length === 0
              ? ""
              : `${subcriber.length} người đang theo dõi bạn. `}
            <br />
            {subing.length === 0
              ? ""
              : `${subing.length} người bạn đang theo dõi bạn.`}
            {/* Người theo dõi. Người đang theo dõi */}
          </div>
          {/* <div className="contactWrapper">
            <div className="message">Liên hệ</div>
            <div className="subcribeblack">Người đang theo dõi</div>
            <div className="subcribered">Theo dõi</div>
            <div className="more">
              <MoreHorizIcon />
            </div>
          </div> */}
          <div className="contactWrapper">
            {/* <div className="message">Chia sẻ</div> */}
            <Link
              to="/settingprofile"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="message" style={{ marginLeft: "10px" }}>
                Chỉnh sửa hồ sơ
              </div>
            </Link>
          </div>
          <div className="menuWrapper">
            <div className={`create`} onClick={() => setIsCreate(true)}>
              Đã tạo
            </div>
            <div className={`save `} onClick={() => setIsCreate(false)}>
              Đã lưu
            </div>
          </div>
          {isCreate ? (
            <div>
              <Create />
            </div>
          ) : (
            <div className="savedCollection">
              {collection?.map((co, i) => (
                <Collection
                  key={i}
                  nameCollection={co.name}
                  detailCollection={detailCollection}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Profile;
