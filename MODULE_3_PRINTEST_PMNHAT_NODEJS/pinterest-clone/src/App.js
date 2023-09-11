import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import DetailImg from "./components/DetailImg";
import Header from "./components/Header";
import MainBoard from "./components/MainBoard";
import Modalbox from "./components/Modalbox";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import ModalboxSetting from "./components/ModalboxSetting";
import Register from "./components/Register";
import Login from "./components/Login";
import SettingProfile from "./components/SettingProfile";
import CollectionDetail from "./components/CollectionDetail";
import PinCreated from "./components/PinCreated";
import CreateANewPin from "./components/CreateANewPin";

function App() {
  const [state, setState] = useState([]);
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/detailimg/:id" element={<DetailImg />}></Route>
        <Route
          path="/"
          element={<MainBoard state={state} setState={setState} />}
        ></Route>
        <Route path="/modalbox" element={<Modalbox />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        {/* <Route path="/modalbox2" element={<ModalboxSetting />}></Route> */}
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/settingprofile" element={<SettingProfile />}></Route>
        <Route
          path="/collectiondetail/:collection"
          element={<CollectionDetail />}
        ></Route>
        <Route path="/pincreate" element={<PinCreated />}></Route>
        <Route path="/createanewpin" element={<CreateANewPin />}></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
