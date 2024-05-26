import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Test = () => {
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
          <Button
            className="CTA-search"
            variant="contained"
            sx={{
              backgroundColor: "#C08B5C",
              "&:hover": { backgroundColor: "#795458" },
            }}
          >
            <a href="#search-function">search</a>
          </Button>
        </div>

        <div>
          Too many good options to choose from?
          <br /> Create an account to save movies for later!
        </div>
        <div className="registerButton">
          <Button
            className="CTA-register"
            variant="contained"
            sx={{
              backgroundColor: "#D9CE88",
              "&:hover": { backgroundColor: "#8F916B" },
            }}
            onClick={() => navigate("/signup")}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Test;
