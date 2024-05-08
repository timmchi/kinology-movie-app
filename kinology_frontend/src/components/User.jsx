import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import usersService from "../services/users";

const User = () => {
  let { id } = useParams();
  const [user, setUser] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await usersService.getUser(id);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [id]);

  console.log(user.watchedMovies);
  return (
    <div>
      <h1>User</h1>
      <p>
        <strong>{user.name}</strong>
      </p>
      <img src={user.avatar} alt="user avatar" />
      <div>
        <h2>About me</h2>
        <p>{user.biography}</p>
      </div>
      <div>
        <h3>favorite movies</h3>
        <ul>
          {user?.favoriteMovies?.map((movie) => (
            <li key={movie.id}>{movie.tmdbId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>watched movies</h3>
        <ul>
          {user?.watchedMovies?.map((movie) => (
            <li key={movie.id}>{movie.tmdbId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>comments</h2>
        <ul>
          {user?.profileComments?.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default User;
