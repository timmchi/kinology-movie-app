import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MovieSmallCard from "./MovieSmallCard";
import myFavoriteMovies from "../data/myFavoriteMovies";

const About = () => {
  return (
    <div>
      <h1>About Kinology</h1>
      <h2>Web app uses TMDB api</h2>
      <div>
        This website uses TMDB (The Movie Database) api to implement its core
        functionality, and I am highly thankful to them for providing their api
        for free.
      </div>
      <div>
        TMDB api has great documentation and it is fairly easy to use, so I
        suggest you give it a shot if you have some web app ideas related to
        movies.
      </div>
      <p>
        Link to TMDB{" "}
        <a href="https://www.themoviedb.org" target="_blank">
          <OpenInNewIcon />
        </a>
      </p>
      <h2>Fullstack open</h2>
      <div>
        This website is my attempt at completing a 10 credit final project,
        which is a part of Full Stack Open course.
      </div>
      <div>
        {" "}
        I gained most of my React and Express knowledge through that course, so
        I highly recommend it to anyone who wants to get better at modern web
        development.
      </div>
      Link to the course{" "}
      <a href="https://fullstackopen.com/en/" target="_blank">
        <OpenInNewIcon />
      </a>
      <h2>About me</h2>
      <ul>
        <li>
          <a href="https://github.com/timmchi" target="_blank">
            <GitHubIcon />
          </a>
        </li>
        <li>
          portfolio <OpenInNewIcon />
        </li>
        <li>contact me</li>
      </ul>
      <h3>my favorite movies</h3>
      <div className="profileMovieContainer">
        {myFavoriteMovies.map((movie) => (
          <div key={movie.tmdbId} className="movieSmallCard">
            <MovieSmallCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
