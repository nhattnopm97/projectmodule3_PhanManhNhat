import React, { useEffect, useState } from "react";
import "../css/collection.css";
import { Link } from "react-router-dom";

function Collection(props) {
  const [pinInCollection, setPinInCollection] = useState([]);

  const filterCollection = () => {
    let allPin = props.detailCollection.filter(
      (pin) => pin.name === props.nameCollection
    );
    console.log(allPin);
    setPinInCollection(allPin);
  };

  useEffect(() => {
    filterCollection();
  }, []);

  return (
    <div className="collection">
      {pinInCollection.length >= 3 ? (
        <Link to={`/collectiondetail/${props.nameCollection}`}>
          <div className="imgWrapper">
            <div className="img1">
              <img src={pinInCollection[0].link} alt="ảnh 1" />
            </div>
            <div className="img2VsImg3">
              <div className="img2">
                <img src={pinInCollection[1].link} alt="ảnh 2" />
              </div>
              <div className="img3">
                <img src={pinInCollection[2].link} alt="ảnh 3" />
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link to={`/collectiondetail/${props.nameCollection}`}>
          <div className="imgWrapper">
            <div>
              <img
                className="justOnePin"
                src={pinInCollection[0]?.link && pinInCollection[0].link}
                alt="ảnh 1"
              />
            </div>
          </div>
        </Link>
      )}

      <div className="textDetailCollection">
        <h4>{props.nameCollection}</h4>
        <span>{pinInCollection.length} Pin</span>
      </div>
    </div>
  );
}

export default Collection;
