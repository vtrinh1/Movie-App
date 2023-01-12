import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoImage from "../assets/no_image.png"

function Cast({ cast }) {
  const [img, setImg] = useState();

  useEffect(() => {
    const image = new Image();
    if(cast?.profile_path) {
      image.src = `https://image.tmdb.org/t/p/original/${cast.profile_path}`;
    } else {
      image.src = NoImage
    }
    image.onload = () => {
      setImg(image)
    }
  }, [cast])

  return (
    <div className="flex flex-col space-y-4">
      {/* Actor Image */}
      {
        img ? (
          <Link to={`/actor/${cast?.id}`}>
            <figure className="rounded-md overflow-hidden group">
              <img 
                src={img.src}
                className="group-hover:scale-110 duration-200 ease"
                alt=""
              />
            </figure>
          </Link>
        ) : (
          <div className="aspect-[2/3] animated-bg rounded-md"></div>
        )
      }
      {/* Cast Details */}
      <div className="flex flex-col">
        <div className="font-semibold">
          {cast?.name}
        </div>
        <div className="text-sm">
          {cast?.character}
        </div>
      </div>
    </div>
  )
}
export default Cast