import axios from "axios";
import { createContext, useEffect, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [activeGenres, setActiveGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeCurrentPage = (number) => {
    if(number >= 0 && number <= totalPages) {
      setActiveGenres([])
      setCurrentPage(number)
      window.scrollTo(0, 0)
    }
  }

  const reset = () => {
    setMovies([]);
    setActiveGenres([])
    setSearchTerm('');
    setTotalPages(0);
    setCurrentPage(1);
  }

  useEffect(() => {
    async function getGenres() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`)
      setGenres(data?.genres)
    }
    getGenres();
  }, [])

  return (
    <MovieContext.Provider value={{
      searchTerm,
      setSearchTerm,
      movies,
      setMovies,
      currentPage,
      setCurrentPage,
      totalPages,
      setTotalPages,
      changeCurrentPage,
      genres,
      activeGenres,
      setActiveGenres,
      loading,
      setLoading,
      reset
    }}>
      {children}
    </MovieContext.Provider>
  )
}

export default MovieContext;