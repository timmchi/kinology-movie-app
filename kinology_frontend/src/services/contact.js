import axios from "axios";
const baseUrl = "/api/contact";

const sendMessage = async (data) => {
  const response = await axios.post(baseUrl, data);
  return response.data;
};

export default { sendMessage };
