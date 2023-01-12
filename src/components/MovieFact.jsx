function MovieFact({ name, value }) {
  return (
    <div>
      <div className="font-semibold leading-relaxed">
        {name}
      </div>
      <div>
        {value}
      </div>
    </div>
  )
}
export default MovieFact