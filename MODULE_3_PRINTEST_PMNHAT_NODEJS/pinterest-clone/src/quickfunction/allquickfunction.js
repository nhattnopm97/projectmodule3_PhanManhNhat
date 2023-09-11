export const loadDetailCollection = (userId) => {
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
        console.log(response.data);
        return 
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error(error);
      });
  } else {
    console.log("Chưa đăng nhập!");
  }
};
