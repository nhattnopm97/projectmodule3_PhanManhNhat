import React, { useEffect, useState } from "react";
import "../css/collectiondetail.css";
import SortIcon from "@mui/icons-material/Sort";
import axios from "axios";
import { useParams } from "react-router-dom";
import PinInCollection from "./PinInCollection";

function CollectionDetail(props) {
  const [detailCollection, setDetailCollection] = useState(null);
  const [pinClt, setPinClt] = useState(null);

  const { collection } = useParams();
  let userLocal = JSON.parse(localStorage.getItem("userLocal"));

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
          let result = response.data.detailCollection.filter(
            (pin) => pin.name === collection
          );
          setPinClt(result);
          setDetailCollection(response.data.detailCollection);
          console.log(response.data);
        })
        .catch((error) => {
          // Xử lý lỗi
          console.error(error);
        });
    } else {
      console.log("Chưa đăng nhập!");
      alert("Bạn chưa đăng nhập!");
    }
  };

  useEffect(() => {
    loadDetailCollections();
  }, []);

  return (
    <div className="mainContainer">
      <div className="cltAvt">
        <div className="clt">{collection}</div>
        <div className="avt">
          <img src={userLocal.avartar} alt="" />
        </div>
        {userLocal.name}
      </div>
      <div className="qttPAS">
        <div className="qttPina">{pinClt?.length} Ghim</div>
        <div className="sortIC">
          <SortIcon />
        </div>
      </div>
      <div className="mainBoardcontainer">
        {pinClt?.map((pin, i) => (
          <PinInCollection
            pin={pin}
            key={i}
            pinClt={pinClt}
            setPinClt={setPinClt}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionDetail;
