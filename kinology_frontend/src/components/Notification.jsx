import Alert from "@mui/material/Alert";

// success/error
const NotificationAlert = ({ type, message }) => {
  if (!message) return null;

  return <Alert severity={type}>{message}</Alert>;
};

export default NotificationAlert;
