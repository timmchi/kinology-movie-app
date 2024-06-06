import { useState, useRef } from "react";
import SearchModal from "../Search/SearchModal";
import MovieList from "../Movie/MovieList";
import ScrollTop from "../Pagination/ScrollTop";
import Hero from "../Hero/Hero";
import PropTypes from "prop-types";

const LandingPage = ({ onButtonPress, onButtonUnpress, user }) => {
  const [movies, setMovies] = useState([]);
  const searchRef = useRef(null);

  const goToSearch = () => {
    searchRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <>
      <Hero goToSearch={goToSearch} />
      <div id="search-function" ref={searchRef}>
        <SearchModal setMovies={setMovies} />
        <MovieList
          movies={movies}
          onButtonPress={onButtonPress}
          onButtonUnpress={onButtonUnpress}
          user={user}
        />
        {movies.length > 0 && <ScrollTop goToSearch={goToSearch} />}
      </div>
    </>
  );
};

export default LandingPage;

LandingPage.propTypes = {
  onButtonPress: PropTypes.func,
  onButtonUnpress: PropTypes.func,
  user: PropTypes.object,
};
