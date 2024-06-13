import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MovieSmallCard from "../Movie/MovieSmallCard";
import ContactModal from "../Contact/ContactModal";
import myFavoriteMovies from "../../data/myFavoriteMovies";

const About = () => {
  return (
    <div>
      <div className="aboutContainer">
        <div className="box">
          <h2>About author</h2>
          <div className="content">
            <div className="about-me-info">
              <div>
                <a
                  href="https://github.com/timmchi"
                  target="_blank"
                  aria-label="Github profile"
                >
                  <GitHubIcon sx={{ fontSize: "3rem" }} />
                </a>
              </div>
              <div>
                <ContactModal />
              </div>
            </div>
            <h3>Kinology author&apos;s favorite movies</h3>
            <div className="profileMovieContainer about">
              {myFavoriteMovies.map((movie) => (
                <div key={movie.tmdbId} className="movieSmallCard">
                  <MovieSmallCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="box">
          <h2>Web app uses TMDB api</h2>
          <div className="content">
            <p>
              This website uses TMDB (The Movie Database) api to implement its
              core functionality, and I am highly thankful to them for providing
              their api for free.
            </p>
            <p>
              TMDB api has great documentation and it is fairly easy to use, so
              I suggest you give it a shot if you have some web app ideas
              related to movies.
            </p>
            <p>
              Link to TMDB{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                aria-label="TMDB link"
              >
                <OpenInNewIcon sx={{ fontSize: "2rem" }} />
              </a>
            </p>
          </div>
        </div>
        <div className="box">
          <h2>Fullstack open</h2>
          <div className="content">
            <p>
              This website is my submission for the final project part of Full
              Stack Open course, worth 10 credits or 175 hours.
            </p>
            <p>
              {" "}
              I gained most of my React and Node knowledge through that course,
              so I highly recommend it to anyone who wants to get better at
              modern web development.
            </p>
            <p>
              Link to the course{" "}
              <a
                href="https://fullstackopen.com/en/"
                target="_blank"
                aria-label="Fullstackopen link"
              >
                <OpenInNewIcon sx={{ fontSize: "2rem" }} />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
