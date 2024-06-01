import axios from "axios";
const baseUrl = "http://localhost:3001/api/contact";

const sendMessage = async (data) => {
  const response = await axios.post(baseUrl, data);
  return response.data;
};

export default { sendMessage };
