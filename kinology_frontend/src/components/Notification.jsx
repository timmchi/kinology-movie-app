import Alert from "@mui/material/Alert";
import { useNotificationValue } from "../contexts/NotificationContext";

// success/error
const NotificationAlert = () => {
  const { message, type } = useNotificationValue();
  if (!message) return null;

  return <Alert severity={type}>{message}</Alert>;
};

export default NotificationAlert;
