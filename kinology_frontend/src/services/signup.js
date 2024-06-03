import axios from "axios";
const baseUrl = "/api/users";

const signUp = async (userData) => {
  const response = await axios.post(baseUrl, userData);
  return response.data;
};

export default { signUp };
