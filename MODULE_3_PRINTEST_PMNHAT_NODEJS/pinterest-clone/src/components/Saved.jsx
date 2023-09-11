import React from "react";
import "../css/save.css";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import Collection from "./Collection";
function Saved(props) {
  return (
    <div>
      <div className="wrapperSaved">
        <div className="buttonTune" title="Sắp xếp">
          <TuneIcon />
        </div>
        <div className="buttonAdd add" title="Tạo thêm">
          <AddIcon />
        </div>
      </div>
      {Math.floor(Math.random() * 10) >= 10 ? (
        <div className="contentWrapperNoPin">
          <div>Bạn chưa có ghim nào</div>
          <button>Tìm ý tưởng</button>
        </div>
      ) : (
        <div className="collectionWrapper">
          <Collection />
          <Collection />
          <Collection />
          <Collection />
          <Collection />
          <Collection />
          <Collection />
          <Collection />
        </div>
      )}
    </div>
  );
}

export default Saved;
