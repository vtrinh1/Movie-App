import axios from "axios"
import { useEffect, useState } from "react"
import { useContext } from "react"
import Movie from "../components/Movie"
import MovieSkeleton from "../components/MovieSkeleton"
import Pagination from "../components/Pagination"
import MovieContext from "../context/MovieContext"
import PopularContext from "../context/PopularContext"

function Popular() {
  const [seeMore, setSeeMore] = useState(false);
  const { genres } = useContext(MovieContext)
  const { movies, setMovies, setTotalPages, currentPage, activeGenres, setActiveGenres, loading, setLoading } 
  = useContext(PopularContext)

  useEffect(() => {
    async function getMovies() {
      setLoading(true);
      setActiveGenres([]);
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&page=${currentPage}`)
      setMovies(data?.results.map((movie, index) => ({...movie, index})))
      setTotalPages(500)
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }
    getMovies();
  }, [currentPage])

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
      {/* Title */}
      <div className="container mx-auto max-w-7xl px-6 pt-12 flex flex-col md:flex-row gap-y-4 md:items-center justify-between">
        <div className="flex flex-col">
          <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
          <h1 className="text-3xl md:text-4xl font-bold">Popular Movies</h1>
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
              .filter(movie => movieHasActiveGenres(movie))
              .map((movie) => <Movie movie={movie} key={movie.id} />)
            : new Array(20).fill(0).map((_, index) => <MovieSkeleton key={index} />)
          }
        </div>
        {/* Pagination */}
        <Pagination context={PopularContext} />
      </div>
    </div>
  )
}
export default Popular