import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import Movie from "../components/Movie";
import MovieSkeleton from "../components/MovieSkeleton";
import Pagination from "../components/Pagination";
import MovieContext from "../context/MovieContext"

function Search() {
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState("Featured");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const { movies, setMovies, searchTerm, setSearchTerm, setTotalPages, currentPage, setCurrentPage, genres, activeGenres, setActiveGenres, loading, setLoading } 
  = useContext(MovieContext)
  const dropdownRef = useRef();

  useEffect(() => {
    setSearchText(searchTerm)
    const hideDropdownOnBlur = (e) => {
      if(!e?.target?.classList?.contains('dropdown') 
      && !dropdownRef?.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', hideDropdownOnBlur)
    return () => {
      document.removeEventListener('click', hideDropdownOnBlur)
    }
  }, [])

  useEffect(() => {
    async function getMovies() {
      if(searchText) {
        setLoading(true);
        setActiveGenres([]);
        const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&include_adult=false&query=${searchText}&page=${currentPage}`)
        setMovies(data?.results.map((movie, index) => ({...movie, index})))
        setTotalPages(data?.total_pages)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }
    getMovies();
  }, [currentPage])

  const onSubmit = async (e) => {
    e.preventDefault();
    if(searchText.trim() === '') {
      return;
    }
    setLoading(true);
    setActiveGenres([]);
    setSearchTerm(searchText)
    const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&include_adult=false&query=${searchText}&page=1`)
    setMovies(data?.results.map((movie, index) => ({...movie, index})))
    setCurrentPage(1);
    setTotalPages(data?.total_pages)
    setTimeout(() => {
      setLoading(false);
    }, 500)
  }

  const movieHasActiveGenres = (movie) => {
    if(activeGenres.length === 0) {
      return true;
    }
    const movieGenreIDs = movie.genre_ids;
    const activeGenreIDs = activeGenres.map(genre => genre.id);
    const commonGenreIDs = movieGenreIDs.filter(id => activeGenreIDs.includes(id));
    if(commonGenreIDs.length === activeGenreIDs.length) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="flex-1">
      {/* Search & Filters */}
      <div className="bg-darkest border-t border-dark">
        <div className="container mx-auto max-w-7xl p-6 md:py-3 flex flex-col md:flex-row gap-y-4 md:items-center justify-between">
          <form
            onSubmit={onSubmit} 
            className="flex flex-1 max-w-lg overflow-hidden"
          >
            <input 
              type="text"
              className="p-3 pr-0 md:px-5 focus:outline-none rounded-l text-sm text-black flex-1"
              placeholder="Search movies..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="bg-accent flex items-center justify-center rounded-r text-white md:px-8 py-3 w-12 sm:w-20 h-12">
              {
                !loading ? <i className="fa-solid fa-magnifying-glass text-xl"></i> 
                : <i className="fa-solid fa-spinner text-2xl animate-spin"></i>
              }
            </button>
          </form>
          {/* Dropdown */}
          <div className="relative">
            <div 
              className="dropdown h-10 px-4 w-48 bg-[#303a4f] hover:bg-[#3b465c] rounded-md cursor-pointer flex items-center justify-between text-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              ref={dropdownRef}
            >
              <span className="leading-10">{sortBy}</span>
              <i className={`fa-solid fa-chevron-down duration-200
              ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}></i>
            </div>
            <div className={`absolute z-10 top-14 inset-x-0 w-48 rounded-md cursor-pointer overflow-hidden text-sm leading-10 ${dropdownOpen ? 'block' : 'hidden'}`}>
              <div 
                className="bg-[#303a4f] hover:bg-[#3b465c] px-4 h-10"
                onClick={() => setSortBy('Featured')}
              >
                Featured
              </div>
              <div 
                className="bg-[#303a4f] hover:bg-[#3b465c] px-4 h-10"
                onClick={() => setSortBy('Newest')}
              >
                Newest
              </div>
              <div 
                className="bg-[#303a4f] hover:bg-[#3b465c] px-4 h-10"
                onClick={() => setSortBy('Oldest')}
              >
                Oldest
              </div>
              <div 
                className="bg-[#303a4f] hover:bg-[#3b465c] px-4 h-10"
                onClick={() => setSortBy('Rating')}
              >
                Rating
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Genres */}
      {
        movies.length > 0 && (
          <div className="container mx-auto max-w-7xl p-6 pb-4">
            <div className="hidden md:flex flex-wrap text-sm gap-y-2">
              {
                genres
                  .filter(genre => {
                    let genreInMovies = false;
                    for(let movie of movies) {
                      for(let id of movie?.genre_ids) {
                        if(id === genre.id) {
                          genreInMovies = true;
                          break;
                        }
                      }
                    }
                    return genreInMovies
                  })
                  .map(genre => (
                      <div 
                        key={genre.id}
                        className={`px-4 py-1 rounded-full cursor-pointer mr-2
                        ${activeGenres?.includes(genre) ? 'bg-[#68ded7] text-black' : 'bg-[#303a4f] hover:bg-[#3b465c] text-white'}`}
                        onClick={() => {
                          if(activeGenres?.includes(genre)) {
                            setActiveGenres(activeGenres.filter(item => item.id !== genre.id))
                          } else {
                            setActiveGenres([...activeGenres, genre])
                          }
                        }}
                      >
                        {genre.name}
                      </div>
                    )
                  )
              }
            </div>
            <div className="flex md:hidden flex-wrap text-sm gap-y-2">
              {
                genres
                  .slice()
                  .slice(0, seeMore ? genres.length : 1)
                  .filter(genre => {
                    let genreInMovies = false;
                    for(let movie of movies) {
                      for(let id of movie?.genre_ids) {
                        if(id === genre.id) {
                          genreInMovies = true;
                          break;
                        }
                      }
                    }
                    return genreInMovies
                  })
                  .map(genre => (
                      <div 
                        key={genre.id}
                        className={`px-4 py-1 rounded-full cursor-pointer mr-2
                        ${activeGenres?.includes(genre) ? 'bg-[#68ded7] text-black' 
                        : 'bg-[#303a4f] text-white'}`}
                        onClick={() => {
                          if(activeGenres?.includes(genre)) {
                            setActiveGenres(activeGenres.filter(item => item.id !== genre.id))
                          } else {
                            setActiveGenres([...activeGenres, genre])
                          }
                        }}
                      >
                        {genre.name}
                      </div>
                    )
                  )
              }
              {
                !seeMore ? (
                  <div 
                    className="px-4 py-1 rounded-full cursor-pointer 
                    bg-[#303a4f] text-white"
                    onClick={() => setSeeMore(true)}
                  >
                    <span className="mr-2">See More</span>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                ) : (
                  <div 
                    className="px-4 py-1 rounded-full cursor-pointer 
                    bg-[#303a4f] text-white"
                    onClick={() => setSeeMore(false)}
                  >
                    <span className="mr-2">See Less</span>
                    <i className="fa-solid fa-chevron-up text-xs"></i>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
      {/* Movies Grid */}
      <div className="container mx-auto max-w-7xl p-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {
            !loading ? 
            movies
              .sort((a, b) => {
                if(sortBy === 'Featured') return a?.index - b?.index
                if(sortBy === 'Newest') return Date.parse(b?.release_date) - Date.parse(a?.release_date)
                if(sortBy === 'Oldest') return Date.parse(a?.release_date) - Date.parse(b?.release_date)
                if(sortBy === 'Rating') return b?.vote_average - a?.vote_average
              })
              .filter(movie => movieHasActiveGenres(movie))
              .map((movie) => <Movie movie={movie} key={movie.id} />)
            : new Array(20).fill(0).map((_, index) => <MovieSkeleton key={index} />)
          }
        </div>
        {/* No movies */}
        {
          !loading && movies?.length === 0 && searchTerm && (
            <div className="text-lg md:text-xl my-6">
              There are no movies that matched your query.
            </div>
          )
        }
        {/* Pagination */}
        <Pagination context={MovieContext} />
      </div>
      
    </div>
  )
}
export default Search