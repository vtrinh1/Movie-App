import { useContext } from "react"
import MovieContext from "../context/MovieContext"

function PaginationButton({ page, context }) {
  const { currentPage, changeCurrentPage } = useContext(context)

  return (
    <button
      onClick={() => changeCurrentPage(page)}
      className={`w-8 h-8 leading-8 text-center rounded
      ${page === currentPage ? 'bg-[#68ded7] text-black' : 'bg-dark hover:bg-darker'}`} 
    >
      {page}
    </button>
  )
}
export default PaginationButton