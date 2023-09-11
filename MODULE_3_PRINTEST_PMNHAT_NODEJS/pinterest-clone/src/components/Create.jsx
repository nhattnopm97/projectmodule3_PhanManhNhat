import React, { useEffect, useState } from "react";
import "../css/create.css";
import axios from "axios";
import PinCreated from "./PinCreated";
import { Link } from "react-router-dom";

function Create(props) {
  const [pinCreated, setPinCreated] = useState([]);
  const loadPinCreated = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/pin/user/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          console.log(response.data);
          setPinCreated(response.data.pin);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
      // alert("Đăng nhập để xem chi tiết!");
    }
  };

  useEffect(() => {
    loadPinCreated();
  }, []);

  return (
    <div className="createWrapper">
      {pinCreated.length === 0 ? (
        <>
          <p>Chưa có gì để hiển thị! Ghim bạn tạo sẽ xuất hiện ở đây.</p>
          <Link to="/createanewpin">
            <button>Tạo ghim ý tưởng</button>
          </Link>
        </>
      ) : (
        <div className="mainBoardcontainerxxx" id="mainBoardcontainerxxx">
          {pinCreated.map((pin, i) => (
            <PinCreated pin={pin} key={i} loadPinCreated={loadPinCreated} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Create;
