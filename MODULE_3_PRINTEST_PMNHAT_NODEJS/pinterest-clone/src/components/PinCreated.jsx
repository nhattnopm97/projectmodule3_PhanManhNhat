import React from "react";
import styled from "styled-components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../css/pin.css";
import UploadIcon from "@mui/icons-material/Upload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function PinCreated({ pin, key, loadPinCreated }) {
  const navigate = useNavigate();
  const handleEditOwnPin = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      axios({
        method: "DELETE",
        url: "http://localhost:3579/api/v1/pin/" + pin.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          console.log(response.data);
          // Xử lý response thành công
          loadPinCreated();
          // alert(`Bạn đã xóa ảnh!`);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Bạn chưa đăng nhập!");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Link to={`/detailimg/${pin.id}`}>
          <img src={pin.link} alt="" />
          <div className="button-container">
            <div className="collectiona">
              <KeyboardArrowDownIcon />
            </div>
            <div className="collectiona"></div>
            {/* <div className="save">Lưu</div> */}
            {/* <div className="upload">
              <UploadIcon />
            </div> */}
            <div className="more" onClick={handleEditOwnPin}>
              {/* <MoreHorizIcon /> */}
              <DriveFileRenameOutlineIcon />
            </div>
          </div>
        </Link>
      </Container>
    </Wrapper>
  );
}

export default PinCreated;

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
    background-color: balck;
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
