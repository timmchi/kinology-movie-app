import Alert from "@mui/material/Alert";
import { useNotificationValue } from "../../contexts/NotificationContext";

const NotificationAlert = () => {
  const { message, type } = useNotificationValue();
  if (!message) return null;

  return (
    <div className="notification">
      <Alert severity={type}>{message}</Alert>
    </div>
  );
};

export default NotificationAlert;
