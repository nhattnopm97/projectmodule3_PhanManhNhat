import React, { useEffect, useState } from "react";
import PinterestIcon from "@mui/icons-material/Pinterest";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import FaceIcon from "@mui/icons-material/Face";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useParams } from "react-router-dom";
import ModalboxSetting from "./ModalboxSetting";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [id, setId] = useState(null);
  const onSearchSubmit = (e) => {
    e.preventDefault();
    console.log(input);
  };

  //Check user login
  const loadUserLogin = async () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal !== null) {
      setId(userLocal.id);
      axios({
        method: "GET",
        url: "http://localhost:3579/api/v1/user/" + userLocal.id,
        headers: {
          Authorization: `Bearer ${userLocal.token}`,
        },
      })
        .then((response) => {
          // Xử lý response thành công
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
  useEffect(() => {
    loadUserLogin();
  }, []);
  return (
    <Wrapper>
      <LogoWrapper>
        <Link to="/">
          <PinterestIcon
            style={{
              color: "red",
              fontSize: "32px",
              cursor: "pointer",
              marginTop: "7px",
            }}
          />
        </Link>
      </LogoWrapper>
      <HomePageButton>
        <Link to="/">Trang chủ</Link>
      </HomePageButton>
      <FollowingButton>
        <Link to="/createanewpin">Tạo</Link>
      </FollowingButton>
      <SearhWrapper>
        <SearchBarWrapper>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <form>
            <input type="text" onChange={(e) => setInput(e.target.value)} />
            <button type="submit" onClick={onSearchSubmit}></button>
          </form>
        </SearchBarWrapper>
      </SearhWrapper>
      <IconButton>
        <NotificationsIcon />
      </IconButton>
      <IconButton>
        <TextsmsIcon />
      </IconButton>
      {userLogin === null ? (
        <Link to={`/profile`}>
          <IconButton>
            <FaceIcon />
          </IconButton>
        </Link>
      ) : (
        <>
          {userLogin?.avartar === null || userLogin?.avartar === "" ? (
            <Link to={`/profile/${id}`}>
              <IconButton>
                <FaceIcon />
              </IconButton>
            </Link>
          ) : (
            <Link to={`/profile/${id}`}>
              {/* <div className="w-[30px] h-[30px] overflow-hidden ">
                </div> */}
              <img
                src={userLogin?.avartar}
                style={{
                  width: "30px",
                  borderRadius: "100%",
                }}
              />
            </Link>
          )}
        </>
      )}
      <IconButton onClick={() => setOpenModalSetting(true)}>
        <KeyboardArrowDownIcon />
      </IconButton>
      {openModalSetting && (
        <ModalboxSetting
          openModalSetting={openModalSetting}
          setOpenModalSetting={setOpenModalSetting}
          userLogin={userLogin}
        />
      )}
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-item: center;
  height: 65px;
  padding: 12px 4px 4px 16px;
  background-color: white;
  color: black;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoWrapper = styled.div`
  .MuiSvgIcon-root {
    color: #e60023;
    font-size: 32px;
    cursor: pointer;
  }
`;

const HomeButton = styled.div`
  display: flex;
  height: 43px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
`;

const HomePageButton = styled(HomeButton)`
  background-color: rgb(17, 17, 17);
  a {
    text-decoration: none;
    color: white;
    font-weight: 700;
  }
`;

const FollowingButton = styled(HomeButton)`
  background-color: white;

  a {
    text-decoration: none;
    color: black;
    font-weight: 700;
  }

  :hover {
    background-color: #e1e1e1;
  }
`;

const SearhWrapper = styled.div`
  flex: 1;
`;

const SearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  height: 43px;
  width: 100;
  border-radius: 50px;
  border: none;
  padding-left: 10px;

  form {
    display: flex;
    flex: 1;
  }

  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    margin-left: 5px;
    font-size: 16px;
  }

  form > button {
    display: none;
  }

  input:focus {
    outline: none;
  }
`;

// const IconsWrapper = styled.div``;
