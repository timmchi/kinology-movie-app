import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import PropTypes from "prop-types";

const GenreList = ({ genres }) => {
  if (genres)
    return (
      <List
        orientation="horizontal"
        variant="outlined"
        sx={{
          justifyContent: "center",
          padding: 0,
          borderWidth: 0,
        }}
      >
        {genres.map((genre) => (
          <div key={genre.id}>
            <ListItem sx={{ color: "#bdac4e", fontSize: "1.3rem" }}>
              {genre.name}
            </ListItem>
          </div>
        ))}
      </List>
    );
};

export default GenreList;

GenreList.propTypes = {
  genres: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]),
};
