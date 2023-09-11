import React, { useState } from "react";
import "../css/createanewpin.css";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CreateANewPin(props) {
  const initialValue = {
    link: "",
    title: "",
    description: "",
    tag: "",
    timeupload: "",
    user_id: "",
  };
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formValue, setFormValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleInputFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Xem trước ảnh
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChangetext = (event) => {
    const { name, value } = event.target;
    console.log(formValue);
    setFormValue({ ...formValue, [name]: value });
  };

  const handleCreateANewPin = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (image) {
      const formData = new FormData();
      formData.append("aNewPin", image);

      try {
        const response = await axios.post(
          "http://localhost:3579/api/v1/pin/newimage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userLocal.token}`,
            },
          }
        );
        console.log(response.data.data);
        const fileName = response.data.data.split("\\").pop();
        let timeUpdate = getCurrentDate();
        formValue.link = `http://localhost:3579/${fileName}`;
        formValue.user_id = userLocal.id;
        formValue.timeupload = timeUpdate;
        console.log(formValue);
        axios({
          method: "POST",
          url: "http://localhost:3579/api/v1/pin/newPin",
          headers: {
            Authorization: `Bearer ${userLocal.token}`,
          },
          data: formValue,
        })
          .then((res) => {
            console.log(res);
            // alert("Tạo một ghim mới thành công!");
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
      alert("Bạn chưa có ảnh!");
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  return (
    <WrapperCreate>
      <ContentCreateWrapper>
        <HeaderContentWrapper>
          <div>{/* <CloseIcon /> */}</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Tải nội dung lên để tạo Ghim
          </div>
          <div>{/* <QuestionMarkIcon /> */}</div>
        </HeaderContentWrapper>
        <ContentCreate>
          <ImageWrapper>
            <img src={previewImage} alt="" />
            <input
              type="file"
              name="aNewPin"
              id="aNewPin"
              onChange={handleInputFileChange}
            />
          </ImageWrapper>
          <div className="ttl">
            Tiêu đề
            <div>
              <input
                type="text"
                value={formValue.title}
                placeholder="Tiêu đề"
                name="title"
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="ttl">
            Mô tả
            <div>
              <input
                type="text"
                value={formValue.description}
                placeholder="Mô tả"
                name="description"
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="ttl">
            Tag: Mỗi thẻ tag cách nhau bởi dấu phẩy.
            <div>
              <input
                value={formValue.tag}
                type="text"
                placeholder="Tag"
                name="tag"
                onChange={handleInputChangetext}
              />
            </div>
          </div>

          <button onClick={handleCreateANewPin}>Thêm Ghim mới</button>
        </ContentCreate>
      </ContentCreateWrapper>
    </WrapperCreate>
  );
}

export default CreateANewPin;

const WrapperCreate = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  algin-items: center;
`;

const ContentCreateWrapper = styled.div`
  width: 70%;
  border-radius: 40px;
  overflow-y: auto;
  background-color: white;
  color: black;
`;

const HeaderContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ContentCreate = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .ttl {
    margin-top: 20px;
  }
  .ttl div {
    border: 1px solid black;
    border-radius: 20px;
    overflow: hidden;
    width: 300px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ttl div input {
    width: 100%;
    border: none;
    outline: none;
    margin-left: 10px;
  }

  button {
    border: none;
    outline: none;
    background-color: red;
    color: white;
    margin: 10px 20px;
    border-radius: 20px;
    padding: 10px 20px;
  }
  button:hover {
    background-color: rgb(95, 3, 3);
  }
`;
const ImageWrapper = styled.div`
  margin-top: 20px;
  width: 80%;
  overflow: hidden;
  display: flex;

  img {
    width: 70%;
    border-radius: 20px;
    overflow: hidden;
    margin-right: 20px;
  }
`;
