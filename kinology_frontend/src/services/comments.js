import axios from "axios";
const baseUrl = "http://localhost:3001/api/comments";

const getProfileComments = async (profileId) => {
  const response = await axios.get(`${baseUrl}/profile/${profileId}`);
  return response.data;
};

const createProfileComment = async (profileId, comment, currentUser) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.post(
    `${baseUrl}/profile/${profileId}`,
    { content: comment },
    config
  );
  return response.data;
};

const deleteProfileComment = async (profileId, commentId, currentUser) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.delete(
    `${baseUrl}/profile/${profileId}/${commentId}`,
    config
  );
  return response.data;
};

const updateProfileComment = async (
  profileId,
  commentId,
  currentUser,
  content
) => {
  const config = {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  };

  const response = await axios.put(
    `${baseUrl}/profile/${profileId}/${commentId}`,
    { content: content },
    config
  );
  return response.data;
};

export default {
  getProfileComments,
  createProfileComment,
  deleteProfileComment,
  updateProfileComment,
};
