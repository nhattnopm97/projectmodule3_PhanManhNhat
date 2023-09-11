import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getVideos } from "../slices/videoSlice";
import axios from "axios";
import { getAllChannels } from "../slices/channelSlice";

const UploadVideo = ({ setOpen, user }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [secondStep, setSecondStep] = useState(true);
  const [selectInput, setSelectInput] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const [message, setMessage] = useState("");
  const [existVideo, setExistVideo] = useState(false);
  const videos = useSelector(getVideos);
  const allChannels = useSelector(getAllChannels);
  // tạo videoId ngẫu nhiên
  const generateRandomId = () => {
    const min = 1000000;
    const max = 9999999;
    let newId = Math.floor(Math.random() * (max - min + 1)) + min;
    // Kiểm tra xem newId đã tồn tại trong mảng videos hay chưa
    while (videos.some((video) => video.video_id === newId)) {
      newId = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return newId;
  };

  // lấy dữ liệu ngày tháng năm của hôm nay
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (event) => {
    setSelectedVideo(event.target.files[0]);
    setMessage("");
    setSelectInput(3);
  };

  const channelId = allChannels.find(
    (channel) => channel.email === user.email
  ).channel_id;
  const currentDate = getCurrentDate();
  const video_id = generateRandomId();
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!selectedVideo) {
      setMessage("Please choose a video");
    } else {
      const formData = new FormData();
      formData.append("video", selectedVideo);
      formData.append("video_id", video_id);
      formData.append("channel_id", channelId);
      formData.append("upload_date", currentDate);
      formData.append("title", "draft");
      formData.append("views", 0);

      await axios
        .post("http://localhost:8000/api/v1/videos", formData)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            console.log("Thêm video thành công");
            setMessage("");
            setSecondStep(true);
          }
        })
        .catch((error) => console.log(error));
    }
  };
  // Khi người dùng đã chọn ảnh
  const handleImgChange = (event) => {
    setSelectedImg(event.target.files[0]);
    setMessage("");
  };
  console.log(selectInput);
  const handleUpdateDetail = () => {};

  return (
    <div
      className="w-[100%] h-[100%] absolute left-0 bg-overlay-40 flex items-center 
    justify-center z-20"
    >
      <div
        className="w-[100%] h-[100%] fixed left-0 bg-overlay-40 flex items-center 
    justify-center z-21"
        onClick={() => setOpen(false)}
      ></div>
      <div
        className="wrap_img w-[800px] h-[600px] bg-yt-light-2 text-yt-white p-5 flex flex-col gap-5 
      fixed rounded-md z-25"
      >
        {!secondStep ? (
          <>
            <div
              className="absolute top-5 right-5 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <AiOutlineClose />
            </div>
            <p className="text-center text-2xl font-semibold mt-2">
              Upload a new Video
            </p>
            <div className="flex flex-col">
              <div className="flex items-center w-full justify-center">
                <div className="rounded-full bg-yt-light-1 w-36 h-36 flex items-center justify-center">
                  {/* <span className='rounded-full text-center'> */}
                  <RiUploadCloud2Line size={50} />
                  {/* </span> */}
                </div>
              </div>
              <p className="text-center mt-4 text-md">
                Your videos will be private until you publish them.
              </p>
            </div>
            <div className="border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center">
              <form
                action="/api/v1/videos/upload"
                method="post"
                enctype="multipart/form-data"
                className="flex flex-col items-center"
                onSubmit={handleAddVideo}
              >
                <input
                  type="file"
                  name="video"
                  onChange={handleInputChange}
                  className="rounded-md m-2 border-solid border-1 p-4 bg-transparent text-md"
                />
                <button className="py-2 bg-[#3EA6FF] px-20 rounded-sm text-yt-black font-medium my-3">
                  UPLOAD
                </button>
              </form>
            </div>
            <div>
              <p className="text-[13px] text-center my-1">
                By submitting your videos to YouTube, you acknowledge that you
                agree to YouTube's
                <span className="text-[#1967D2]"> Terms of Service </span>
                and
                <span className="text-[#1967D2]"> Community Guidelines</span>.
              </p>
              <p className="text-[13px] text-center">
                Please be sure not to violate others' copyright or privacy
                rights.
                <span className="text-[#1967D2]"> Learn more </span>
              </p>
              {message && (
                <div className="text-center ">
                  <p className="mt-10 bg-yt-gray w-fit m-auto p-2 rounded-sm">
                    {message}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          // bước 2
          <div className="w-full">
            <div
              className="absolute top-5 right-5 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <AiOutlineClose />
            </div>
            <p className="text-center text-2xl font-semibold my-2">
              Video Details
            </p>
            <div className="border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center">
              <form
                //  action="/api/v1/videos/upload" method="put" enctype="multipart/form-data"
                className="flex flex-col items-start gap-2 w-full px-10"
                onSubmit={handleUpdateDetail}
              >
                <div
                  className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm p-2 w-full
                 ${selectInput === 1 ? "border-[#3EA6FF]" : "border-yt-gray"}
                `}
                >
                  <label className={`${selectInput === 1 && "text-[#3EA6FF]"}`}>
                    Title (required)
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="bg-yt-light-2 text-yt-white outline-none w-full"
                    onClick={() => setSelectInput(1)}
                  />
                </div>
                <div
                  className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm p-2 w-full
                 ${selectInput === 2 ? "border-[#3EA6FF]" : "border-yt-gray"}
                `}
                >
                  <labell
                    className={`${selectInput === 2 && "text-[#3EA6FF]"}`}
                  >
                    Description (required)
                  </labell>
                  <textarea
                    rows={3}
                    type="text"
                    name="description"
                    className="bg-yt-light-2 text-yt-white outline-none w-full"
                    onClick={() => setSelectInput(2)}
                  />
                </div>
                <div
                  className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm p-2 w-full
                 ${selectInput === 2 ? "border-[#3EA6FF]" : "border-yt-gray"}
                `}
                >
                  <label className={`${selectInput === 3 && "text-[#3EA6FF]"}`}>
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    className="bg-yt-light-2 text-yt-white outline-none w-full"
                    onChange={handleImgChange}
                  />
                </div>
                <input
                  type="file"
                  name="thumbnail"
                  className="rounded-md m-2 border-solid border-1 p-4 bg-transparent text-md"
                />
                <input type="text" name="tags" />
                <div className="flex gap-2">
                  <input type="radio" value="notForKid" name="notForKid" />
                  <label htmlFor="">Yes, it's 'Made for Kids'</label>
                </div>
                <div className="flex gap-2">
                  <input type="radio" value="forKid" name="forKid" />
                  <label htmlFor="">No, it's not 'Made for Kids'</label>
                </div>

                <div className="flex justify-end">
                  <button className="py-2 px-20 rounded-sm text-yt-gray font-medium my-3 focus: bg-yt-light-2">
                    BACK
                  </button>
                  <button className="py-2 bg-[#3EA6FF] px-20 rounded-sm text-yt-black font-medium my-3">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
            <div>
              {message && (
                <div className="text-center ">
                  <p className="mt-10 bg-yt-gray w-fit m-auto p-2 rounded-sm">
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
// Post video

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public/assets`);
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.split(".")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/", (req, res) => {
  console.log(req.body);
  upload.array("video", 1)(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(500).json({ message: "Lỗi khi tải lên video" });
    } else if (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi khi tải lên video" });
    } else {
      if (req.files) {
        const newVideo = {
          video_id: req.body.video_id,
          channel_id: req.body.channel_id,
          videoURL: `https://localhost:8000/assets/${req.files[0].filename}`,
          upload_date: req.body.upload_date,
          views: 0,
          title: req.body.title,
        };
        try {
          const query = `
        INSERT INTO videos (video_id, channel_id, upload_date, videoURL, views,title) 
        VALUES (?, ?, ?, ?, ?,?);
      `;
          const params = [
            newVideo.video_id,
            newVideo.channel_id,
            newVideo.upload_date,
            newVideo.videoURL,
            newVideo.views,
            newVideo.title,
          ];
          await database.execute(query, params);
          return res.status(200).json({
            status: 200,
            success: true,
            message: "Upload successfully",
            newVideo,
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Upload failed.", error });
        }
      }
    }
  });
});
