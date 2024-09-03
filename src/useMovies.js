import { useState, useEffect } from "react";
import { KEY } from "./Config";
export function useMovies(query, callback) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        callback?.();
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setIsLoading(false);
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        }
      }
      if (query.length < 3) {
        setIsLoading(false);
        setError("");
        setMovies([]);
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
