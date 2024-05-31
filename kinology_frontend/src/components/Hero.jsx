import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div className="box2"></div>
      <div className="box1">
        <div className="intro">
          <h2>
            Welcome to <strong>Kinology</strong>
          </h2>
          <div>
            <p>Choosing a movie made easy</p>
          </div>
          <div className="cta-with-buttons">
            <div className="search-div">
              Pick actors, directors or genres <br /> then{" "}
              <strong>explore</strong>
              <div className="searchButton">
                <Button
                  className="CTA-search"
                  variant="contained"
                  sx={{
                    backgroundColor: "#00C9AB",
                    "&:hover": { backgroundColor: "#00755F" },
                    fontSize: 25,
                  }}
                >
                  <a href="#search-function">search</a>
                </Button>
              </div>
            </div>
            <div className="register-div">
              <div>
                Too many good options to choose from?
                <br /> Create an account to save movies for later!
              </div>
              <div className="registerButton">
                <Button
                  className="CTA-register"
                  variant="contained"
                  sx={{
                    backgroundColor: "#00A660",
                    "&:hover": { backgroundColor: "#00532f" },
                    fontSize: 20,
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
