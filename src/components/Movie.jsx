import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import NoImage from "../assets/no_image.png"
import MovieContext from "../context/MovieContext";

function Movie({ movie }) {
  const [img, setImg] = useState();

  useEffect(() => {
    const image = new Image();
    if(movie.poster_path) {
      image.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    } else {
      image.src = NoImage
    }
    image.onload = () => {
      setImg(image)
    }
  }, [movie])

  return (
    <div className="flex flex-col space-y-6">
      {/* Movie Image */}
      {
        img ? (
          <Link to={`/movie/${movie.id}`}>
            <figure className="rounded-md overflow-hidden group">
              <img 
                src={img.src}
                className="group-hover:scale-110 duration-200 ease"
                alt=""
              />
            </figure>
          </Link>
        ) : (
          <div className="aspect-[2/3] animated-bg"></div>
        )
      }

      {/* Movie Details */}
      <div className="flex flex-col space-y-4">
        {/* Title & Release Date */}
        <div className="flex justify-between">
          <Link
            to={`/movie/${movie.id}`}
            className="font-semibold max-w-[80%] break-word overflow-hidden"
          >
            {movie.original_title}
          </Link>
          <div className="text-accent text-sm font-medium">
            {movie.release_date?.slice(0, 4)}
          </div>
        </div>
        {/* Language & Rating */}
        <div className="flex justify-between">
          <div className="px-2 py-1 border-2 border-white text-accent text-xs uppercase font-bold">
            {movie.original_language || 'N/A'}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs">
              <i className="fa-solid fa-thumbs-up text-accent"></i>
              <span className="text-gray-200">
                {movie.vote_average.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Movie