import { useNavigate } from "react-router-dom";

const LogOut = ({ user }) => {
  const navigate = useNavigate();

  if (!user) navigate("/login");
  return (
    <div>
      <h1>Log In</h1>
    </div>
  );
};

export default LogOut;
