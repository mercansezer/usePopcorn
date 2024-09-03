import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { KEY } from "./Config";

export function MovieDetails({
  selectedId,
  onAddWatched,
  setSelectedId,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handeAdd() {
    const handleWatchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(handleWatchedMovie);
  }

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useKey("Escape", setSelectedId);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={() => setSelectedId(null)}>
              {" "}
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated the movie with {watchedUserRating} ⭐️</p>
              ) : (
                <StarRating
                  size={24}
                  maxRating={10}
                  onSetRating={setUserRating}
                />
              )}

              {userRating > 0 ? (
                <button className="btn-add" onClick={handeAdd}>
                  {" "}
                  + Add to list
                </button>
              ) : (
                ""
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
