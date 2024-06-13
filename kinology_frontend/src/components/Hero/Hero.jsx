import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ctaStyle = {
  backgroundColor: "#00A660",
  "&:hover": { backgroundColor: "#00755F" },
  fontSize: 20,
  "@media (max-width: 1024px)": {
    fontSize: 15,
  },
};

// box 2 is used to move box1 to the right side of the screen on big screens, on mobile it hosts a background image that goes on top of the screen
const Hero = ({ goToSearch }) => {
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
                  sx={ctaStyle}
                  onClick={goToSearch}
                >
                  Search
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
                  sx={ctaStyle}
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

Hero.propTypes = {
  goToSearch: PropTypes.func,
};
