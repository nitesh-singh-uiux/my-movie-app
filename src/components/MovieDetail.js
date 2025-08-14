// src/MovieDetail.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MovieDetail.module.css";

function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL se movie ka ID nikalenge
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    if (!apiKey) {
      setError("API key is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`; // ID se fetch karenge

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True") {
          setMovieDetails(data); // Saara data store karenge
        } else {
          setError(data.Error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Network error: Could not fetch movie details.");
        setIsLoading(false);
      });
  }, [id]); // dependency array mein 'id' rakhenge

  if (isLoading) {
    return <p>Loading movie details...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Yahan movie details render honge
  if (!movieDetails) {
    return <p>No movie details found.</p>;
  }

  return (
    <div className={styles.detailContainer}>
      <button onClick={() => navigate("/")} className={styles.goBackButton}>
        Go Back
      </button>
      <h1 className={styles.movieTitle}>{movieDetails.Title}</h1>
      <p>
        <strong>Year:</strong> {movieDetails.Year}
      </p>
      <img
        src={movieDetails.Poster}
        alt={movieDetails.Title}
        className={styles.moviePoster}
      />
      <p className={styles.moviePlot}>
        <strong>Plot:</strong> {movieDetails.Plot}
      </p>
      <p>
        <strong>Director:</strong> {movieDetails.Director}
      </p>
      <p>
        <strong>Actors:</strong> {movieDetails.Actors}
      </p>
    </div>
  );
}

export default MovieDetail;
