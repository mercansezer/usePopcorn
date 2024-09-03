import "./index.css";
import { Main } from "./Main";
import { Logo } from "./Logo";
import { Search } from "./Search";
import { Numresults } from "./Numresults";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedMovieList } from "./WatchedMovieList";
import { WatchedSummary } from "./WatchedSummary";
import { Navbar } from "./Navbar";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";
import { MovieDetails } from "./MovieDeatils";
import { KEY } from "./Config";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocaleStorageState";
import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    setSelectedId(null);
  }
  function handleDeleteWatched(id) {
    setWatched((movie) => movie.filter((item) => item.imdbID !== id));
  }

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, isLoading, error } = useMovies(query, setSelectedId);
  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {error ? (
            <ErrorMessage error={error} />
          ) : isLoading ? (
            <Loader />
          ) : (
            <MovieList movies={movies} onSelectMovie={handleSelectedId} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              setSelectedId={setSelectedId}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export default App;
