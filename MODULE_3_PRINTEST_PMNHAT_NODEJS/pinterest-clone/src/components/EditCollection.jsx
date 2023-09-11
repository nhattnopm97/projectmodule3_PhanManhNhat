import React, { useEffect, useState } from "react";
import "../css/editcollection.css";
import axios from "axios";

function EditCollection({
  open,
  setOpen,
  pin,
  loadCollections,
  loadDetailCollections,
}) {
  const [openSettingCollection, setOpenSettingCollection] = useState(open);
  const [collectionName, setCollectionName] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const handleClose = () => {
    setOpenSettingCollection(false);
    setOpen(false);
  };
  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  const handleInputChange = (e) => {
    let a = false;
    if (e.target.value.length !== 0) {
      a = true;
    } else {
      a = false;
    }
    setIsWriting(a);
    setCollectionName(e.target.value);
  };

  const handleCreatNewTable = () => {
    console.log("collectionName", collectionName);
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal === null) {
      // alert("Vui lòng đăng nhập để có bộ sưu tập");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:3579/api/v1/collection/",
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
        data: {
          name: collectionName,
          user_id: userLocal.id,
          pin_id: pin.id,
        },
      })
        .then((response) => {
          // Xử lý response thành công
          loadCollections();
          loadDetailCollections();
          console.log(response.data);
          // alert(`${response.data.message},Lưu vào bảng ${collectionName}`);
          handleClose();
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    }
  };

  return (
    <>
      {/* The Modal */}
      <div
        onClick={handleClose}
        className="modala"
        style={
          openSettingCollection ? { display: "block" } : { display: "none" }
        }
      >
        {/* Modal content */}
        <div className="modal-contentx" onClick={handleModalContentClick}>
          <div className="settingEditCollection">
            <div className="Taobang">Tạo bảng</div>
            <div className="nameCollection">
              <div className="imageWrapper">
                <img src={pin.link} alt="pin" />
              </div>
              <div className="newCollection">
                <div>Tên</div>
                <div className="inputWrapper">
                  <input
                    value={collectionName}
                    type="text"
                    placeholder="Tên bảng"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="huyVaTao">
              <button onClick={handleClose}>Hủy</button>
              <button
                className={isWriting === true ? "isWriting" : ""}
                onClick={handleCreatNewTable}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCollection;
