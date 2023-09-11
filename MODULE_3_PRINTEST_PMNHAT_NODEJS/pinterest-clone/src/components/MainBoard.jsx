import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Pin from "./Pin";
import "../css/MainBoard.css";
import axios from "axios";
function MainBoard(props) {
  const [pin, setPin] = useState([]);
  const [pinLoad, setPinLoad] = useState([]);
  const [timeLoad, setTimeLoad] = useState(0);
  const [collection, setCollection] = useState(null);
  const [detailCollection, setDetailCollection] = useState(null);

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
  useEffect(() => {
    loadUserLogin();
  }, []);

  const loadPin = async () => {
    let data = await axios.get("http://localhost:3579/api/v1/pin");
    data.data.pin.sort((a, b) => {
      return 0.5 - Math.random();
    });
    setPin(data.data.pin);
    console.log(data.data.pin);
    let pinloaded = data.data.pin.slice(0, 10);
    setTimeLoad(1);
    setPinLoad(pinloaded);
  };

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

  const [loadMore, setLoadMore] = useState(true);
  const getData = (a) => {
    let newTimeLoad = timeLoad + 1;
    let newPinLoad = pin.slice(0, timeLoad * 5);
    setPinLoad(newPinLoad);
    setTimeLoad(newTimeLoad);
  };

  const scrollView = () => {
    const mainBoardcontainer = document.getElementById("mainBoardcontainer");
    if (props.scrollable) {
      // list has fixed height
      mainBoardcontainer.addEventListener("scroll", (e) => {
        const el = e.target;
        if (el.scrollTop + el.clientHeight === el.scrollHeight) {
          setLoadMore(true);
        }
      });
    } else {
      // list has auto height
      window.addEventListener("scroll", () => {
        if (
          window.scrollY + window.innerHeight + 10 >
          mainBoardcontainer.clientHeight + mainBoardcontainer.offsetTop
        ) {
          setLoadMore(true);
        }
      });
    }
  };

  useEffect(() => {
    scrollView();
  }, [loadMore]);

  useEffect(() => {
    const mainBoardcontainer = document.getElementById("mainBoardcontainer");

    if (
      mainBoardcontainer.clientHeight <= window.innerHeight &&
      mainBoardcontainer.clientHeight
    ) {
      setLoadMore(true);
    }
  }, [props.state]);

  useEffect(() => {
    getData(loadMore);
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    loadPin();
    loadCollections();
    loadDetailCollections();
  }, []);

  // const chuyendoidulieu = async () => {
  //   for (let i = 0; i < pin.length; i++) {
  //     let pinUpdate = pin[i];
  //     pinUpdate.userId = 1;
  //     console.log(pinUpdate);
  //     let res = await axios.post("http://localhost:3333/pin", pinUpdate);
  //     console.log(res.data);
  //   }
  // };
  return (
    <Wrapper>
      {/* <button onClick={chuyendoidulieu} style={{ width: "200px" }}>
        chuyen doi du lieu
      </button> */}
      <Container className="mainBoardcontainer" id="mainBoardcontainer">
        {pinLoad?.map((pin, i) => (
          <Pin
            detailCollection={detailCollection}
            key={i}
            pin={pin}
            collection={collection}
            loadCollections={loadCollections}
            loadDetailCollections={loadDetailCollections}
          />
        ))}
      </Container>
    </Wrapper>
  );
}

export default MainBoard;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 15px;
  justify-content: center;
`;

const Container = styled.div`
  column-gap: 1px;
  margin: 0 auto;
  height: 100%;
  background-color: white;
  overflow-y: auto hidden;
`;
