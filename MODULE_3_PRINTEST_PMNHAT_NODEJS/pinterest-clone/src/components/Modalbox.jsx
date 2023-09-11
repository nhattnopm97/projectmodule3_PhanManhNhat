import "../css/modalbox.css";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
function Modalbox({
  collection,
  detailCollection,
  setOpenModal,
  handleSave,
  setOpenCreateTable,
}) {
  const handleClose = () => {
    setOpenModal(false);
  };

  const setThumbnail = (value) => {
    console.log("value", value);
    let collectionHaveThumbnail = detailCollection.find(
      (detail) => detail.name === value
    );
    console.log(collectionHaveThumbnail);
    if (collectionHaveThumbnail) {
      return collectionHaveThumbnail;
    } else {
      return null;
    }
  };

  const handleClick = (a, b) => {
    handleClose();
    handleSave(a, b);
  };

  const handleCreateTable = () => {
    let userLocal = JSON.parse(localStorage.getItem("userLocal"));
    if (userLocal === null) {
      return alert("Bạn chưa đăng nhập!");
    }
    handleClose();
    setOpenCreateTable(true);
  };

  return (
    <>
      <div className="totalmodal">
        <div className="modalContainer">
          <div className="closeIconWrapper" onClick={handleClose}>
            <CloseIcon className="closeIcon" />
          </div>
          <div className="titleModal">
            <div>Lưu</div>
          </div>
          <div className="searchBoxModal">
            <div className="wrapperInputSearch">
              <SearchIcon />
              <input type="text" placeholder="Tìm kiếm" />
            </div>
          </div>
          <div className="collectionModal">
            <p>Các lựa chọn hay nhất</p>
            {collection?.map((collection) => (
              <div onClick={(event) => handleClick(event, collection.name)}>
                <div>
                  <img
                    src={
                      setThumbnail(collection.name) !== null
                        ? `${setThumbnail(collection.name).link}`
                        : ""
                    }
                    alt="Thumbnail"
                  />
                </div>
                <div className="collectionName">{collection.name}</div>
                <button>Lưu</button>
              </div>
            ))}
          </div>
          <div className="newTableModal" onClick={handleCreateTable}>
            <div className="addIcon">
              <AddIcon />
            </div>
            <div>Tạo bảng</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modalbox;
