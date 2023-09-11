import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../css/detailimages.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pin from "./Pin";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditCollection from "./EditCollection";
import Modalbox from "./Modalbox";

function DetailImg() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pin, setPin] = useState({});
  const [relatePins, setRelatePins] = useState([]);
  const [collection, setCollection] = useState([]);
  const [detailCollection, setDetailCollection] = useState([]);
  const [userLogin, setUserLogin] = useState(null);
  const [comment, setComment] = useState([]);
  const [ipCmt, setIpCmt] = useState("");
  const [likeOfPin, setLikeOfPin] = useState([]);
  const [pinOwner, setPinOwner] = useState({});
  const [subcriber, setSubscriber] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateTable, setOpenCreateTable] = useState(false);
  let userLocal = JSON.parse(localStorage.getItem("userLocal"));

  const loadLikeOfPin = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/likepin/" + id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log("response.data", response.data);
          setLikeOfPin(response.data.likepin);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("b chua dang nhap");
    }
  };

  //load tên độc nhất của collection
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
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/user/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log("userLogin", response.data.user);
          setUserLogin(response.data.user);
        })
        .catch((error) => {
          console.error(error);
          setUserLogin(null);
          navigate("/login");
        });
    } else {
      navigate("/register");
    }
  };

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
          console.log(response.data);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  // lấy người sở sở hữu pin, người subcriber pin, pin liên quan
  const loadPin2 = async () => {
    try {
      //lấy pin theo id
      let data = await axios.get(`http://localhost:3579/api/v1/pin/${id}`);
      // Người người sở hữu
      let user = await axios.get(
        `http://localhost:3579/api/v1/pin/userCreatePin/${id}`
      );

      console.log("user.data", user.data.user[0]);
      setPinOwner(user.data.user[0]);

      // người subcriber
      let subcriber = await axios.get(
        `http://localhost:3579/api/v1/subcriber/${user.data.user[0].id}`
      );
      console.log("subcriber", subcriber.data);
      setSubscriber(subcriber.data.subcriber);
      console.log(data.data.relate);
      let result = data.data.relate.filter((pin) => pin.id !== id);
      setPin(data.data.pin[0]);
      setRelatePins(result);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCommentOfPin = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    console.log("id", id);
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/comment/" + id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          setComment(response.data.comment);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
    }
  };

  const handleIpCmt = (event) => {
    setIpCmt(event.target.value);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  //gửi comment lên
  const handleComment = () => {
    let timecomment = getCurrentDate();

    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/comment/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          user_id: userLocal.id,
          pin_id: id,
          comment: ipCmt,
          timecomment: timecomment,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          loadCommentOfPin();
          setIpCmt("");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/register");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleComment();
    }
  };

  //bỏ likev và like
  const disLike = () => {
    console.log("aa");
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/likepin/" + id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          user_id: userLocal.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          loadLikeOfPin();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/register");
    }
  };
  const like = () => {
    console.log("bbbbbbb");
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/likepin/" + id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          user_id: userLocal.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          loadLikeOfPin();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/register");
    }
  };

  //Lưu và bỏ lưu
  const handleSave = () => {
    let newNameCollection = undefined;
    console.log("newNameCollection", newNameCollection);
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      let newName = "";
      if (newNameCollection === undefined) {
        newName =
          collection && collection.length > 0
            ? collection[0]?.name
            : "Bảng mới";

        console.log("newName", newName);
      } else {
        newName = newNameCollection;
      }
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/collection/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: newName,
          user_id: userLocal.id,
          pin_id: pin.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          loadDetailCollections();
          // alert(`${response.data.message}`);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
          alert("lỗi server");
        });
    } else {
      console.log("Chưa đăng nhập!");
      alert("Bạn chưa đăng nhập!");
    }
  };
  const handleUnSaved = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    let findCollection = detailCollection.filter(
      (collection) => collection.pin_id === pin.id
    );
    console.log("findCollection", findCollection);
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/collection/" + pin.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: findCollection[0]?.name,
          user_id: userLocal.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          loadDetailCollections();
          // alert(`${response.data.message}`);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      alert("Bạn chưa đăng nhập");
    }
  };

  const subscribe = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/subcriber/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          user_id: pinOwner.id,
          user_id_follower: userLocal.id,
        },
      })
        .then((response) => {
          console.log(response.data);
          // Xử lý response thành công
          loadPin2();
          // alert(`Bạn đã theo dõi ${pinOwner.name}`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Bạn chưa đăng nhập!");
    }
  };
  const unSubscribe = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/subcriber/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          user_id: pinOwner.id,
          user_id_follower: userLocal.id,
        },
      })
        .then((response) => {
          console.log(response.data);
          // Xử lý response thành công
          loadPin2();
          // alert(`Bạn đã bỏ theo dõi ${pinOwner.name}`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Bạn chưa đăng nhập!");
    }
  };

  const handleShow = () => {
    console.log("aaaaaaaaaa");
    setOpenModal(true);
    console.log(openModal);
  };

  useEffect(() => {
    loadCommentOfPin();
    loadPin2();
    window.scrollTo(0, 0);
    loadCollections();
    loadDetailCollections();
    loadUserLogin();
    loadLikeOfPin();
  }, [id]);
  return (
    <>
      <Wrapper>
        {openModal === true ? (
          <Modalbox
            collection={collection}
            detailCollection={detailCollection}
            setOpenModal={setOpenModal}
            handleSave={handleSave}
            setOpenCreateTable={setOpenCreateTable}
            openCreateTable={openCreateTable}
          />
        ) : (
          <></>
        )}
        {openCreateTable === true ? (
          <EditCollection
            open={openCreateTable}
            setOpen={setOpenCreateTable}
            pin={pin}
            loadCollections={loadCollections}
            loadDetailCollections={loadDetailCollections}
          />
        ) : (
          <></>
        )}
        <div className="littleWrapper">
          <img src={pin?.link} width="508px" alt="" />
          <BorderOfImgAndCmt />
          <WrapperDetailComments>
            <WrapperAction>
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
              <IconButton>
                <UploadIcon />
              </IconButton>
              <IconButton>
                <InsertLinkIcon />
              </IconButton>
              {/* <div className="nonebreakspace">
            </div> */}
              {!detailCollection?.find(
                (collection) => collection?.pin_id === pin?.id
              ) ? (
                <div
                  className="collectiona"
                  style={{ display: "inline-block", cursor: "pointer" }}
                  onClick={handleShow}
                >
                  {collection === null || collection?.length === 0
                    ? "Bảng mới"
                    : collection[0]?.name}

                  <KeyboardArrowDownIcon />
                </div>
              ) : (
                <Link
                  to={`/collectiondetail/${
                    detailCollection?.find(
                      (collection) => collection.pin_id === pin?.id
                    ).name
                  }`}
                >
                  <div
                    className="collectiona"
                    style={{ display: "inline-block" }}
                  >
                    {
                      detailCollection?.find(
                        (collection) => collection.pin_id === pin?.id
                      ).name
                    }
                  </div>
                </Link>
              )}
              {!detailCollection?.find(
                (collection) => collection.pin_id === pin.id
              ) ? (
                <SaveButton onClick={handleSave}>Lưu</SaveButton>
              ) : (
                <SaveButton
                  style={{ backgroundColor: " rgb(165, 165, 165)" }}
                  onClick={handleUnSaved}
                >
                  Đã lưu
                </SaveButton>
              )}
            </WrapperAction>
            <WrapperAllComments>
              <div className="aboutComments">
                <div>
                  <h1>{pin.title?.length === 0 ? "Chưa viết" : pin.title} </h1>
                </div>
                <div className="addSpacing">
                  <p>{pin.description?.length === 0 ? "" : pin.description}</p>
                </div>
                <div className="addSpacing owner">
                  <div className="avatarOwner">
                    <img
                      src={pinOwner.avartar}
                      alt=""
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div className="detailOwner">
                    <div className="userName">{pinOwner.name}</div>
                    <div>{subcriber?.length} người theo dõi</div>
                  </div>
                  {console.log(subcriber.find((sub) => sub.user_id_follower))}
                  {subcriber?.find(
                    (sub) => sub.user_id_follower === userLogin?.id
                  ) ? (
                    <button className="subcriberOwnerxxx" onClick={unSubscribe}>
                      Đang theo dõi
                    </button>
                  ) : pinOwner?.id === userLogin?.id ? (
                    ""
                  ) : (
                    <button className="subcriberOwner" onClick={subscribe}>
                      Theo dõi
                    </button>
                  )}

                  {/* {subcriber.find(
                    (sub) => sub.user_id_follower === userLogin.id
                  ) ? (
                    <button className="subcriberOwnerxxx" onClick={unSubscribe}>
                      Đang theo dõi
                    </button>
                  ) : (
                    <button className="subcriberOwner" onClick={subscribe}>
                      Theo dõi
                    </button>
                  )} */}
                  {/* <button className="subcriberOwner">Theo dõi</button>
                  <button className="subcriberOwnerxxx">Đang theo dõi</button> */}
                </div>
                {comment.length > 0 ? (
                  <div className="cmtInDtImg">
                    <div>Nhận xét</div>
                    {comment.map((cmt) => (
                      <div className="cmtWrapper">
                        <div className="avttWrapper">
                          <img src={cmt.avartar} alt="" />
                        </div>
                        <div className="dtlCmt">
                          <div className="nACmt">
                            <div style={{ fontWeight: "bold" }}>{cmt.name}</div>
                            <div style={{ marginLeft: "10px" }}>
                              {cmt.comment}
                            </div>
                          </div>
                          <div className="nACmt">
                            <div>{cmt.timecomment.split("T")[0]}</div>
                            <div style={{ marginLeft: "20px" }}>
                              <ThumbUpOffAltIcon />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="addSpacing countComment">
                    <div className="notify">Chưa có nhận xét nào!</div>
                    {/* <IconButton style={{ flex: "1" }}>
                      <FavoriteIcon />
                    </IconButton> */}
                  </div>
                )}
              </div>
              <div className="qttHeartAqttCmt">
                <div>
                  {comment.length > 0 ? (
                    <>{comment.length} Nhận xét</>
                  ) : (
                    "Chưa có nhận xét nào!"
                  )}
                </div>
                <div>
                  {likeOfPin.length}
                  {userLocal &&
                  likeOfPin.find((user) => user.user_id === userLocal.id) ? (
                    <FavoriteIcon
                      onClick={disLike}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={like}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
              <div className="myComment">
                <div className="myAvartar">
                  <img
                    src={userLogin?.avartar}
                    width="50px"
                    height="50px"
                    alt=""
                  />
                </div>

                <div className="inputComment">
                  <input
                    id="IpcmtUs"
                    value={ipCmt}
                    type="text"
                    placeholder="Thêm nhận xét"
                    onChange={handleIpCmt}
                    onKeyDown={handleKeyPress}
                  />
                  <IconButton onClick={handleComment}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </WrapperAllComments>
          </WrapperDetailComments>
        </div>
      </Wrapper>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Các Ghim tương tự
      </h3>
      <div className="mainBoardcontainer">
        <div className="relateContainer">
          <div className="containerOfRelate">
            {relatePins?.map((pin, i) => (
              <Pin
                detailCollection={detailCollection}
                key={i}
                pin={pin}
                collection={collection}
                loadCollections={loadCollections}
                loadDetailCollections={loadDetailCollections}
              ></Pin>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailImg;

const Wrapper = styled.div`
  margin-top: 50px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  .littleWrapper {
    border-radius: 50px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    background-color: rgb(250, 250, 250);
  }
`;

const BorderOfImgAndCmt = styled.div`
  width: 30px;
`;

const WrapperDetailComments = styled.div`
  width: 508px;
`;

const WrapperAction = styled.div``;
const WrapperAllComments = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SaveButton = styled.button`
  padding: 10px 10px;
  border-radius: 20px;
  background-color: red;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  :hover {
    background-color: rgb(92, 0, 0);
  }
`;
