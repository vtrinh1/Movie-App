function MovieSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Movie Image */}
      <div className="aspect-[2/3] rounded-md animated-bg"></div>
      {/* Movie Details */}
      <div className="flex flex-col space-y-4">
        {/* Title & Release Date */}
        <div className="flex justify-between animated-bg rounded font-semibold">
          &nbsp;
        </div>
        {/* Language & Rating */}
        <div className="flex justify-between animated-bg rounded w-4/5">
          <div className="px-2 py-1 border-2 border-transparent text-accent text-xs uppercase font-bold">
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  )
}
export default MovieSkeleton