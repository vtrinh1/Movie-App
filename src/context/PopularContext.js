import { createContext, useEffect, useState } from "react";

const PopularContext = createContext();

export const PopularProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeGenres, setActiveGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeCurrentPage = (number) => {
    if(number >= 0 && number <= totalPages) {
      setCurrentPage(number)
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    if(totalPages > 500) {
      setTotalPages(500)
    }
  }, [totalPages])

  const reset = () => {
    setActiveGenres([]);
    setCurrentPage(1);
  }

  return (
    <PopularContext.Provider value={{
      movies,
      setMovies,
      currentPage,
      setCurrentPage,
      totalPages,
      setTotalPages,
      changeCurrentPage,
      activeGenres, 
      setActiveGenres,
      loading,
      setLoading,
      reset
    }}>
      {children}
    </PopularContext.Provider>
  )
}

export default PopularContext;