function CastSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
    {/* Actor Image */}
    <div className="aspect-[2/3] animated-bg rounded-md"></div>
    {/* Cast Details */}
    <div className="flex flex-col animated-bg">
      <div className="font-semibold text-sm">
        &nbsp;
      </div>
      <div className="text-xs">
        &nbsp;
      </div>
    </div>
  </div>
  )
}
export default CastSkeleton