import { useNavigate } from "react-router-dom";

const SignUp = ({ user }) => {
  const navigate = useNavigate();

  if (user) navigate("/");
  return (
    <div>
      <h1>SIgn up</h1>
    </div>
  );
};

export default SignUp;
