import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import MovieFact from "../components/MovieFact";
import MovieContext from "../context/MovieContext";
import Movie from "../components/Movie"
import NoImage from "../assets/no_image.png"
import MovieSkeleton from "../components/MovieSkeleton";
import Cast from "../components/Cast";
import CastSkeleton from "../components/CastSkeleton";

function MoviePage() {
  const [movie, setMovie] = useState();
  const [recommended, setRecommended] = useState();
  const [credits, setCredits] = useState();
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState();
  const [backdropImg, setBackdropImg] = useState();
  const [inFavourites, setInFavourites] = useState(false);
  const { id } = useParams();
  const director = credits?.crew?.find(person => person.job.toLowerCase() === "director");

  useEffect(() => {
    if(movie) {
      const image = new Image();
      if(movie.poster_path) {
        image.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      } else {
        image.src = NoImage
      }
      image.onload = () => {
        setImg(image)
      }
      const backdropImage = new Image();
      if(movie?.backdrop_path) {
        backdropImage.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
      }
      backdropImage.onload = () => {
        setBackdropImg(backdropImage)
      }
    }
  }, [movie])

  useEffect(() => {
    async function getMovie() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`)
      setMovie(data)
    }
    async function getRecommended() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}`)
      setRecommended(data?.results)
    }
    async function getCredits() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`)
      setCredits(data);
    }
    async function getInformation() {
      window.scrollTo(0, 0)
      setLoading(true);
      await getMovie();
      await getRecommended();
      await getCredits();
      setTimeout(() => {
        setLoading(false);
      }, 500)
    }
    getInformation();
  }, [id])

  useEffect(() => {
    if(!localStorage?.getItem("favourites")) {
      setInFavourites(false)
      return;
    } else if(JSON.parse(localStorage.getItem("favourites"))?.includes(id)) {
      setInFavourites(true);
    } else {
      setInFavourites(false)
    }
  }, [id])

  const addToFavourites = () => {
    let favourites;
    if(localStorage?.getItem("favourites"))  {
      favourites = JSON.parse(localStorage?.getItem("favourites"));
    }
    if(favourites) {
      if(!favourites.includes(id)) {
        localStorage.setItem("favourites", JSON.stringify([...favourites, id]));
      }
    } else {
      localStorage.setItem("favourites", JSON.stringify([id]));
    }
    setInFavourites(true);
  }

  const removeFromFavourites = () => {
    let favourites;
    if(localStorage?.getItem("favourites"))  {
      favourites = JSON.parse(localStorage?.getItem("favourites"));
    }
    if(favourites) {
      if(favourites.includes(id)) {
        localStorage.setItem("favourites", 
        JSON.stringify(favourites.filter(item => item !== id)));
        setInFavourites(false);
      }
    }
  }

  return (
    <>
      <div className="relative overflow-hidden">
        {
          !loading && backdropImg && (
            <img 
              className="absolute inset-x-0 object-cover object-center opacity-[0.04] min-h-full min-w-full"
              src={backdropImg.src}
              alt="backdrop"
            ></img>
          )
        }
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
          {
            !loading ? (
              <div className="flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:items-start lg:space-x-12">
                {
                  img ? (
                    <img 
                      src={img.src} 
                      className="w-full max-w-xs rounded-md"
                      alt={movie?.original_title}
                    />
                  ) : (
                    <div className="w-full max-w-xs rounded-md aspect-[2/3] animated-bg"></div>
                  )
                }
                <div className="flex flex-col flex-1">
                  {/* Movie Title */}
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
                    {movie?.original_title}
                  </div>
                  {/* Movie Details */}
                  <div className="flex flex-wrap items-center mb-8 gap-y-3">
                    {/* Movie Language */}
                    <div className="px-2 py-1 bg-white text-black text-xs font-bold mr-5">
                      {movie?.original_language.toUpperCase()}
                    </div>
                    {/* Movie Genres */}
                    <div className="text-gray-100 text-sm mr-5">
                      {
                        movie?.genres && movie?.genres
                          .map(genre => genre.name)
                          .join(", ")
                      }
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      {/* Movie Release Date */}
                      <div className="flex items-center space-x-2">
                        <i className="fa-regular fa-calendar-days text-accent"></i>
                        <span>{movie?.release_date?.slice(0, 4) || 'N/A'}</span>
                      </div>
                      {/* Movie Runtime */}
                      <div className="flex items-center space-x-2">
                        <i className="fa-regular fa-clock text-accent"></i>
                        <span>{`${movie?.runtime} min` || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Movie Tagline */}
                  {
                    movie?.tagline && (
                      <div className="text-accent italic font-medium text-lg mb-3 flex space-x-1 max-w-xl">
                        "{movie?.tagline}"
                      </div>
                    )
                  }
                  {/* Movie Overview */}
                  <div className="mb-2 text-lg font-semibold">Overview</div>
                  <p className="leading-relaxed max-w-3xl mb-8">
                    {movie?.overview}
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 max-w-3xl gap-5 mb-8">
                    {
                      director && (
                        <MovieFact 
                          name="Director"
                          value={director?.name}
                        />
                      )
                    }
                    {
                      movie?.vote_average > 0 && (
                        <MovieFact 
                          name="User Score"
                          value={`${movie?.vote_average.toFixed(1)}/10` || 'N/A'}
                        />
                      )
                    }
                    {
                      movie?.budget > 0 && (
                        <MovieFact 
                          name="Budget"
                          value={`$${movie?.budget?.toLocaleString()}` || 'N/A'}
                        />
                      )
                    }
                    {
                      movie?.revenue > 0 && (
                        <MovieFact 
                          name="Box Office"
                          value={`$${movie?.revenue?.toLocaleString()}` || 'N/A'}
                        />
                      )
                    }
                  </div>
                  {/* Favourites Button */}
                  <button
                    onClick={() => inFavourites ? removeFromFavourites() : addToFavourites()}
                    className={`self-start border-2 uppercase py-2 px-8 tracking-widest font-semibold duration-150 ease text-sm 
                    w-full sm:w-auto
                    ${!inFavourites ? 'text-white border-[#68ded7] hover:bg-[#68ded7] hover:text-black' : 'bg-white border-white text-black hover:bg-gray-100'}`}
                  >
                    {
                      inFavourites ? 'Remove from favourites' : 'Add to favourites'
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-12 lg:space-y-0 lg:flex-row lg:items-start lg:space-x-12">
                <div className="w-full max-w-xs rounded-md aspect-[2/3] animated-bg"></div>
                <div className="flex flex-col flex-1">
                  {/* Movie Title */}
                  <div className="text-2xl lg:text-5xl font-bold leading-tight mb-4
                  w-full animated-bg max-w-sm">
                    &nbsp;
                  </div>
                  {/* Movie Details */}
                  <div className="w-full max-w-sm h-6 mb-8 animated-bg">
                  </div>
                  {/* Movie Tagline */}
                  <div className="max-w-[240px] h-6 mb-6 animated-bg"></div>
                  {/* Movie Overview */}
                  <div className="flex flex-col space-y-4 max-w-3xl mb-8">
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                  </div>
                  <div className="h-24 max-w-3xl animated-bg">

                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
      {/* Recommended Movies */}
      {
        recommended?.length > 0 && (
          <section className="bg-darker">
            <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
              <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
                Recommended Movies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                {
                  !loading ? (recommended
                    ?.slice(0, 4)
                    ?.map(movie => (
                    <Movie movie={movie} key={movie?.id} />
                  ))) :(
                    new Array(4).fill(0).map((_, index) => (
                      <MovieSkeleton key={index} />
                    ))
                  )
                }
              </div>
            </div>
          </section>
        )
      }
      {/* Main Cast */}
      {
        credits?.cast?.length > 0 && (
          <section className="bg-dark">
            <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
              <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
                Main Cast
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
                {
                  !loading ? (credits?.cast
                    ?.slice(0, 12)
                    ?.map(cast => (
                      <Cast cast={cast} key={cast?.id} />
                    ))) : (
                      new Array(12).fill(0).map((_, index) => (
                        <CastSkeleton key={index} />
                      ))
                    )
                }
              </div>
            </div>
          </section>
        )
      }

    </>
  )
}
export default MoviePage