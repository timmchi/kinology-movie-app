import axios from "axios";
const baseUrl = "http://localhost:3001/api/comments";

const getProfileComments = async (id) => {
  const response = await axios.get(`${baseUrl}/profile/${id}`);
  return response.data;
};

const createProfileComment = async (id, comment, currentUser) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };
  console.log("token in frontend comments service", currentUser.token);
  console.log("config in frontend comments service", config);

  const response = await axios.post(
    `${baseUrl}/profile/${id}`,
    { content: comment },
    config
  );
  return response.data;
};

export default { getProfileComments, createProfileComment };
