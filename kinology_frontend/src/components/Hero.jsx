import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div className="intro">
        <h2>
          Welcome to <strong>Kinology</strong>
        </h2>
        <div>
          Choosing a movie made easy
          <br />
          <br />
          Pick actors, directors or genres <br /> then <strong>explore</strong>
        </div>
        <div className="searchButton">
          <Button className="CTA-search" variant="contained">
            <a href="#search-function">search</a>
          </Button>
        </div>
      </div>
      <div className="register">
        <div>
          Too many good options to choose from?
          <br /> Create an account to save movies for later!
        </div>
        <div className="registerButton">
          <Button
            className="CTA-register"
            variant="contained"
            onClick={() => navigate("/signup")}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
