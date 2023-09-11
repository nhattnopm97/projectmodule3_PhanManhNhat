import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../css/pinincollection.css";
import UploadIcon from "@mui/icons-material/Upload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import axios from "axios";

function PinInCollection({ pin, key, pinClt, setPinClt }) {
  const handleUnSave = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    // let findCollection = detailCollection.filter(
    //   (collection) => collection.pin_id === props.pin.id
    // );
    // console.log("findCollection", findCollection);
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/collection/" + pin.pin_id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: pin.name,
          user_id: userLocal.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          let newPinClt = [...pinClt];
          let result = newPinClt.filter(
            (pinA, i) => pinA.pin_id !== pin.pin_id
          );
          setPinClt(result);
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
  return (
    <Wrapper>
      <Container>
        <Link>
          <img src={pin.link} alt="" />
          <div className="button-container">
            <div className="collectiona">{pin.name}</div>
            <div className="saved" onClick={handleUnSave}>
              Bỏ lưu
            </div>
            <div className="upload">
              <UploadIcon />
            </div>
            <div className="more">
              <MoreHorizIcon />
            </div>
          </div>
        </Link>
      </Container>
    </Wrapper>
  );
}

export default PinInCollection;

const Wrapper = styled.div`
  display: inline-flex;
  padding: 8px;
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  width: 236px;
  :hover .button-container {
    opacity: 1;
  }

  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    object-fit: cover;
    border-radius: 16px;
  }
  .button-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: zoom-in;
  }
  .button-container .collectiona {
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    left: 5%;
  }
  .button-container .save {
    background-color: red;
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    right: 5%;
  }
  .button-container .saved {
    background-color: rgb(165, 165, 165);
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .button-container .upload {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 19%;
  }
  .button-container .more {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
`;
