import axios from "axios"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { Link } from "react-router-dom"
import Movie from "../components/Movie"
import MovieSkeleton from "../components/MovieSkeleton"
import Pagination from "../components/Pagination"
import FavouritesContext from "../context/FavouritesContext"
import MovieContext from "../context/MovieContext"
import RatingContext from "../context/RatingContext"

function Favourites() {
  const [seeMore, setSeeMore] = useState(false);
  const { genres } = useContext(MovieContext)
  const { movies, setMovies, setTotalPages, currentPage, activeGenres, setActiveGenres, loading, setLoading } 
  = useContext(FavouritesContext)
  const moviesPerPage = 8;

  useEffect(() => {
    async function getMovie(id) {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`)
      return data; 
    }
    async function getMovies() {
      let favourites;
      if(localStorage?.getItem("favourites")) {
        favourites = JSON.parse(localStorage.getItem("favourites"));
      }
      setLoading(true);
      setActiveGenres([]);
      if(favourites) {
        const data  = await Promise.all(
          favourites
            .slice(((currentPage - 1) * moviesPerPage), ((currentPage) * moviesPerPage))
            .map(id => getMovie(id))
        );
        setMovies(data)
        setTotalPages(Math.ceil(favourites.length / moviesPerPage))
      }
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
    const movieGenreIDs = movie?.genres?.map(genre => genre.id);
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
          <h1 className="text-3xl md:text-4xl font-bold">Favourites</h1>
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
                      for(let id of movie?.genres?.map(genre => genre?.id)) {
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
                      for(let id of movie?.genres?.map(genre => genre?.id)) {
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
        {/* No movies */}
        {
          !loading && movies?.length === 0 && (
            <div className="flex flex-col">
              <div className="text-lg md:text-xl mb-6">
                There are no movies in your favourites.
              </div>
              <Link to='/search' className="self-start border-2 border-[#68ded7] text-white uppercase px-10 py-2 tracking-widest font-semibold hover:bg-[#68ded7] hover:text-black text-sm md:text-base
              duration-150 ease">
                Browse movies
              </Link>
            </div>
          )
        }
        {/* Pagination */}
        <Pagination context={FavouritesContext} />
      </div>

    </div>
  )
}
export default Favourites