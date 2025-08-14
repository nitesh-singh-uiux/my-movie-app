import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MovieList.module.css";

function MovieList() {
  // movie list ka liya

  const [movieLists, setMovieLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // search ka liya
  const [searchQuery, setSearchQuery] = useState("");

  // search bar ka liya
  const onChangeEvent = (e) => {
    setSearchQuery(e.target.value);
  };

  // movie list show karna ka liya
  useEffect(() => {
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;
    if (searchQuery.length < 3) {
      setMovieLists([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true); // API call se pehle loading true karein
    setError(null); // Error ko bhi reset karein

    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // Data.Search mein movies ka array hota hai
        if (data.Response === "True") {
          setMovieLists(data.Search);
        } else {
          setError(data.Error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [searchQuery]);

  return (
    <div className={styles.container}>
      <h1>Movie Lists</h1>

      <input
        placeholder="Search for a movie"
        onChange={onChangeEvent}
        value={searchQuery}
      />

      {isLoading && <p>Fetching data, please wait...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading &&
        !error &&
        movieLists.length === 0 &&
        searchQuery.length === 0 && <p>Search for a movie to get started!</p>}
      {!isLoading &&
        !error &&
        movieLists.length === 0 &&
        searchQuery.length >= 3 && <p>No movies found for your search.</p>}

      {!isLoading && !error && movieLists.length > 0 && (
        <div className={styles.movieList}>
          {movieLists.map((movieList) => (
            <Link
              to={`/movie/${movieList.imdbID}`}
              key={movieList.imdbID}
              className={styles.movieCard}
            >
              <div>
                <h3>{movieList.Title}</h3>
                <p>({movieList.Year})</p>
                <img
                  src={movieList.Poster}
                  alt={movieList.Title}
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
