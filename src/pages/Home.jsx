import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HorrorMovie from "../assets/horror_movie.svg"
import Movie from "../components/Movie";
import MovieSkeleton from "../components/MovieSkeleton";
import MovieContext from "../context/MovieContext";
import PopularContext from "../context/PopularContext";
import RatingContext from "../context/RatingContext";

function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [popular, setPopular] = useState();
  const [topRated, setTopRated] = useState();
  const [loading, setLoading] = useState(false);
  const { setSearchTerm, setMovies, setTotalPages, reset } 
  = useContext(MovieContext)
  const { reset: resetPopular } = useContext(PopularContext)
  const { reset: resetTopRated } = useContext(RatingContext)
  const navigate = useNavigate();

  useEffect(() => {
    reset();
    resetPopular();
    resetTopRated();
  }, [])

  useEffect(() => {
    async function getPopular() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`)
      setPopular(data?.results)
    }
    async function getTopRated() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}`)
      setTopRated(data?.results)
    }
    async function getInformation() {
      setLoading(true);
      await getPopular()
      await getTopRated()
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }
    getInformation();
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();
    if(searchText.trim() === '') {
      return;
    }
    setSearchLoading(true);
    setSearchTerm(searchText)
    const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&include_adult=false&query=${searchText}&page=1`)
    setMovies(data?.results.map((movie, index) => ({...movie, index})))
    setTotalPages(data?.total_pages)
    setTimeout(() => {
      setSearchLoading(false);
      navigate('/search')
    }, 500)
  }

  return (
    <main>
      {/* Header */}
      <section 
        id="header"
        className="container mx-auto max-w-7xl p-6"
      >
        {/* Description */}
        <div className="flex items-center lg:w-3/5">
          <div className="flex flex-col mt-20 mb-48">
            <div className="bg-accent h-2 w-32 mb-4 hidden md:block"></div>
            <div className="font-bold text-5xl md:text-6xl leading-tight max-w-xl mb-12">
              Millions of <span className="text-accent">movies</span> to discover.
            </div>
            <form
              onSubmit={onSubmit}
              className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 md:p-6 md:bg-darkest rounded"
            >
              <input 
                type="text"
                className="py-3 px-5 focus:outline-none rounded text-black flex-1"
                placeholder="Search movies..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="bg-accent flex items-center justify-center rounded text-white px-8 py-3 md:w-28 h-12">
                {
                  !searchLoading ? <i className="fa-solid fa-magnifying-glass text-xl"></i> 
                  : <i className="fa-solid fa-spinner text-2xl animate-spin"></i>
                }
              </button>
            </form>
          </div>
        </div>
        {/* Image */}
        <figure className="w-2/5 hidden lg:block">
          <img 
            src={HorrorMovie}
            className="mt-20"
            alt=""
          />
        </figure>
      </section>
      {/* Popular Movies */}
      <section id="popular" className="bg-darker">
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Popular Movies
              </h2>
            </div>
            <Link
              to="/popular"
              className="hidden md:block border-2 border-[#68ded7] text-white uppercase px-10 py-2 tracking-widest font-semibold hover:bg-[#68ded7] hover:text-black 
              duration-150 ease"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {
              !loading ? (popular
                ?.slice(0, 12)
                ?.map(movie => (
                <Movie movie={movie} key={movie?.id} />
              ))) :(
                new Array(12).fill(0).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))
              )
            }
          </div>
          <Link
            to="/popular"
            className="border-2 border-[#68ded7] text-white uppercase w-full px-10 py-2 tracking-widest font-semibold hover:bg-[#68ded7] hover:text-black duration-150 ease block text-center mt-12 md:hidden"
          >
            View all
          </Link>
        </div>
      </section>
      {/* Top Rated Movies */}
      <section id="toprated" className="bg-dark">
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Top Rated Movies
              </h2>
            </div>
            <Link
              to="/toprated"
              className="hidden md:block border-2 border-[#68ded7] text-white uppercase px-10 py-2 tracking-widest font-semibold hover:bg-[#68ded7] hover:text-black 
              duration-150 ease"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {
              !loading ? (topRated
                ?.slice(0, 12)
                ?.map(movie => (
                <Movie movie={movie} key={movie?.id} />
              ))) :(
                new Array(12).fill(0).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))
              )
            }
          </div>
          <Link
            to="/toprated"
            className="border-2 border-[#68ded7] text-white uppercase w-full px-10 py-2 tracking-widest font-semibold hover:bg-[#68ded7] hover:text-black duration-150 ease block text-center mt-12 md:hidden"
          >
            View all
          </Link>
        </div>
      </section>
    </main>
  )
}
export default Home