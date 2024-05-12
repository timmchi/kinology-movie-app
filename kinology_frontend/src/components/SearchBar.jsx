import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, minLength } from "valibot";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import PaginationController from "./PaginationController";
import genreOptions from "../data/genres";

import SearchIcon from "@mui/icons-material/Search";
import moviesService from "../services/movies";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const SearchBar = ({ setMovies }) => {
  const [genres, setGenres] = useState([]);
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [ratingUpper, setRatingUpper] = useState(10);
  const [ratingLower, setRatingLower] = useState(0);
  const [actor, setActor] = useState("");
  const [actors, setActors] = useState([]);
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  //   const [newSearch, setNewSearch] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    // resolver: valibotResolver(LoginSchema),
    defaultValues: { genresSelect: {} },
  });

  const onSubmit = (data) => console.log(data, actors);

  const searchForMovies = async (data, pageValue) => {
    console.log(data);
    const actorsQuery = actors.map((actor) => actor.value);
    const { genresSelect, director, year, ratingUpper, ratingLower, country } =
      data;
    const genres = genresSelect.map((genreOption) => `${genreOption.value}`);
    const { movieToFrontObjectArray: movies, totalPages: totalPageNumber } =
      await moviesService.search({
        genres,
        director,
        year,
        ratingUpper,
        ratingLower,
        actors: actorsQuery,
        country,
        page: pageValue,
      });
    console.log(movies);
    console.log("page number in searchbar", totalPageNumber);
    setTotalPages(totalPageNumber);
    setMovies(movies);
  };

  //   const searchForMovies = async (e, pageValue) => {
  //     e.preventDefault();
  //     const actorsQuery = actors.map((actor) => actor.value);
  //     console.log("page in search bar searchForMovies", page);
  //     const { movieToFrontObjectArray: movies, totalPages: totalPageNumber } =
  //       await moviesService.search({
  //         genres,
  //         director,
  //         year,
  //         ratingUpper,
  //         ratingLower,
  //         actors: actorsQuery,
  //         country,
  //         page: pageValue,
  //       });
  //     console.log(movies);
  //     console.log("page number in searchbar", totalPageNumber);
  //     setTotalPages(totalPageNumber);
  //     setMovies(movies);
  //   };

  const handleKeyDown = (event) => {
    if (!actor) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setActors((prev) => [...prev, createOption(actor)]);
        setActor("");
        event.preventDefault();
    }
  };

  const onGenresChange = (e) => {
    const updatedGenres = e.map((genre) => genre.value);
    setGenres(updatedGenres);
  };

  const handleNewSearch = () => {
    setDirector("");
    setYear("");
    setRatingLower(0);
    setRatingUpper(10);
    setActors([]);
    setCountry("");
    setPage(1);
    setTotalPages(-1);
    setMovies([]);
  };

  return (
    <form onSubmit={handleSubmit((data) => searchForMovies(data, 1))}>
      <Controller
        name="genresSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={genreOptions}
            isMulti
            placeholder="Select genres"
          />
        )}
      />
      <div className="director">
        <p>director</p>
        <input {...register("director")} />
      </div>
      <div className="year">
        <p>year</p>
        <input {...register("year")} />
      </div>
      <div className="rating">
        <p>Rating range</p>
        <input {...register("ratingLower")} placeholder={0} type="number" />
        <input {...register("ratingUpper")} placeholder={10} type="number" />
      </div>
      <div className="actors">
        <Controller
          name="actorsSelect"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              components={components}
              options={genreOptions}
              inputValue={actor}
              isMulti
              isClearable
              menuIsOpen={false}
              placeholder="Type in actor and press enter"
              onChange={(newActor) => setActors(newActor)}
              onInputChange={(newActor) => setActor(newActor)}
              onKeyDown={handleKeyDown}
              value={actors}
            />
          )}
        />
      </div>
      <div className="country">
        <p>country</p>
        <input {...register("year")} />
      </div>
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );

  //   return (
  //     <div>
  //       <h1>search bar</h1>
  //       <button onClick={handleNewSearch}>new search</button>
  //       <form onSubmit={(e) => searchForMovies(e, 1)} className="searchBar">
  //         {/* <div className="container"> */}
  //         <div className="genres">
  //           <Select
  //             styles={{
  //               control: (baseStyles) => ({
  //                 ...baseStyles,
  //                 borderWidth: 0,
  //                 borderRadius: 10,
  //               }),
  //             }}
  //             closeMenuOnSelect={false}
  //             isMulti
  //             options={genreOptions}
  //             placeholder="Select genres"
  //             onChange={onGenresChange}
  //           />
  //         </div>
  //         <div className="director">
  //           <p>director</p>
  //           <input
  //             type="text"
  //             className="bar-input"
  //             value={director}
  //             onChange={(event) => setDirector(event.target.value)}
  //             placeholder="Director"
  //             data-testid="director"
  //           />
  //         </div>
  //         <div className="year">
  //           <p>year</p>
  //           <input
  //             type="number"
  //             className="bar-input"
  //             min="1874"
  //             max={new Date().getFullYear()}
  //             value={year}
  //             onChange={(event) => setYear(event.target.value)}
  //             placeholder="Year"
  //             data-testid="year"
  //           />
  //         </div>
  //         <div className="rating">
  //           <p>Lowest to highest rating</p>
  //           <input
  //             type="number"
  //             className="bar-input"
  //             min="0"
  //             max="10"
  //             value={ratingLower}
  //             onChange={(event) => setRatingLower(event.target.value)}
  //             placeholder="Lower boundary"
  //             data-testid="ratingLow"
  //           />
  //           <input
  //             type="number"
  //             className="bar-input"
  //             min="0"
  //             max="10"
  //             value={ratingUpper}
  //             onChange={(event) => setRatingUpper(event.target.value)}
  //             placeholder="Upper boundary"
  //             data-testid="ratingHigh"
  //           />
  //         </div>
  //         <div className="actors">
  //           <CreatableSelect
  //             components={components}
  //             styles={{
  //               control: (baseStyles) => ({
  //                 ...baseStyles,
  //                 borderWidth: 0,
  //               }),
  //             }}
  //             inputValue={actor}
  //             isClearable
  //             isMulti
  //             menuIsOpen={false}
  //             onChange={(newActor) => setActors(newActor)}
  //             onInputChange={(newActor) => setActor(newActor)}
  //             onKeyDown={handleKeyDown}
  //             placeholder="Type in actor and press enter"
  //             value={actors}
  //           />
  //         </div>
  //         <div className="country">
  //           <p>country</p>
  //           <input
  //             type="text"
  //             className="bar-input"
  //             value={country}
  //             onChange={(event) => setCountry(event.target.value)}
  //             placeholder="Country"
  //             data-testid="country"
  //           />
  //           <button type="submit">
  //             <SearchIcon />
  //           </button>
  //         </div>

  //         {/* </div> */}
  //       </form>
  //       <PaginationController
  //         pages={totalPages}
  //         page={page}
  //         setPage={setPage}
  //         pageChange={(event, value) => searchForMovies(event, value)}
  //       />
  //     </div>
  //   );
};

export default SearchBar;
