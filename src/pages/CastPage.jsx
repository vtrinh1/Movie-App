import axios from "axios";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import NoImage from "../assets/no_image.png"
import Movie from "../components/Movie";
import MovieFact from "../components/MovieFact";
import MovieSkeleton from "../components/MovieSkeleton";

function CastPage() {
  const [cast, setCast] = useState();
  const [knownFor, setKnownFor] = useState();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState();
  const [readMore, setReadMore] = useState(false);
  const [bioOffsetHeight, setBioOffsetHeight] = useState(0);
  const [bioScrollHeight, setBioScrollHeight] = useState(0);
  const { id } = useParams();
  const bioRef = useRef(null);

  useEffect(() => {
    if(cast) {
      const image = new Image();
      if(cast.profile_path) {
        image.src = `https://image.tmdb.org/t/p/original/${cast.profile_path}`;
      } else {
        image.src = NoImage
      }
      image.onload = () => {
        setImg(image)
      }
    }
  }, [cast])

  useEffect(() => {
    async function getCast() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_API_KEY}`)
      setCast(data);
    }
    async function getKnownFor() {
      const { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_API_KEY}`)
      setKnownFor(data?.cast);
    }
    async function getInformation() {
      window.scrollTo(0, 0)
      setLoading(true);
      await getCast();
      await getKnownFor();
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
    getInformation();
  }, [id])

  const onResize = () => {
    setBioOffsetHeight(bioRef?.current?.offsetHeight);
    setBioScrollHeight(bioRef?.current?.scrollHeight);
  }

  useEffect(() => {
    onResize();
  })

  useEffect(() => {
    window.addEventListener('resize', onResize);
    
    return(() => {
        window.removeEventListener('resize', onResize);
    })
  }, [])

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20 z-10">
          {
            !loading ? (
              <div className="flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:items-start lg:space-x-12">
                {
                  img ? (
                    <img 
                      src={img.src} 
                      className="w-full max-w-xs rounded-md"
                      alt={cast?.name}
                    />
                  ) : (
                    <div className="w-full max-w-xs rounded-md aspect-[2/3] animated-bg"></div>
                  )
                }
                <div className="flex flex-col flex-1">
                    {/* Actor Name */}
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
                      {cast?.name}
                    </div>
                    {/* Actor Biography */}
                    <div className="mb-2 text-lg font-semibold">Biography</div>
                    <div className="leading-relaxed max-w-3xl mb-8">
                      <p 
                        className={`leading-relaxed max-w-3xl 
                        ${!readMore ? 'line-clamp-4' : ''}`}
                        ref={bioRef}
                      >
                        {cast?.biography}
                      </p>
                      {
                        bioOffsetHeight < bioScrollHeight && (
                          <button 
                            className="text-accent border-b border-accent leading-tight
                            space-x-2"
                            onClick={() => setReadMore(!readMore)}
                          >
                            <span>Read more</span>
                          </button>           
                        )
                      }
                      {
                        readMore && (
                          <button 
                            className="text-accent border-b border-accent leading-tight
                            space-x-2"
                            onClick={() => setReadMore(!readMore)}
                          >
                            <span>Read less</span>
                          </button>   
                        )
                      }
                    </div>
                    {/* Actor Facts */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 max-w-3xl gap-5">
                      {
                        cast?.gender && (
                          <MovieFact 
                            name="Gender"
                            value={cast.gender === 1 ? 'Female' : cast.gender === 2 ? 'Male' : 'Not specified'}
                          />
                        )
                      }
                      {
                        cast?.birthday && (
                          <MovieFact 
                            name="Born"
                            value={cast.birthday}
                          />
                        )
                      }
                      {
                        cast?.deathday && (
                          <MovieFact 
                            name="Died"
                            value={cast.deathday}
                          />
                        )
                      }
                      {
                        cast?.place_of_birth && (
                          <MovieFact 
                            name="Birthplace"
                            value={cast.place_of_birth}
                          />
                        )
                      }
                      {
                        cast?.known_for_department && (
                          <MovieFact 
                            name="Known For"
                            value={cast.known_for_department}
                          />
                        )
                      }
                    </div>
                  </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:items-start lg:space-x-12">
                <div className="w-full max-w-xs rounded-md aspect-[2/3] animated-bg"></div>
                <div className="flex flex-col flex-1">
                  {/* Actor Name */}
                  <div className="text-2xl lg:text-5xl font-bold leading-tight mb-4
                  w-full animated-bg max-w-sm">
                    &nbsp;
                  </div>
                  {/* Actor Biography */}
                  <div className="flex flex-col space-y-4 max-w-3xl mb-8">
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                    <div className="h-6 animated-bg"></div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {/* Known For */}
      <section className="bg-darker">
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20 z-10">
          <div className="h-1 w-24 bg-accent mb-3 hidden md:block"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
            Known For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {
              !loading ? (knownFor
                ?.slice(0, 8)
                ?.map(movie => (
                <Movie movie={movie} key={movie?.id} />
              ))) :(
                new Array(8).fill(0).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))
              )
            }
          </div>
        </div>
      </section>
    </>
  )
}
export default CastPage