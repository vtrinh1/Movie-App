import { useContext } from "react"
import MovieContext from "../context/MovieContext"
import PaginationButton from "./PaginationButton"
import PaginationInput from "./PaginationInput"

function Pagination({ context }) {
  const { totalPages, currentPage, changeCurrentPage } = useContext(context)

  const buttons = (startPage, endPage) => {
    return (<>
      {
        endPage ? (
          <>
            {
              new Array(endPage - startPage + 1).fill(0).map((_, index) => (
                <PaginationButton 
                  page={index + startPage}
                  key={index}
                  context={context}
                />
              ))
            }
          </>
        ) : (
          <PaginationButton page={startPage} context={context} />
        )
      }
    </>)
  }

  const paginate = (current, total) => {
    if(total <= 5) {
      return buttons(1, total)
    } else if (current <= 3) {
      return <>
        {buttons(1, 3)}
        <PaginationInput context={context} />
        {buttons(total)}
      </>
    } else if (current >= total - 2) {
      return <>
        {buttons(1)}
        <PaginationInput context={context} />
        {buttons(total - 2, total)}
      </>
    } else {
      return <>
        {buttons(1)}
        <PaginationInput context={context} />
        {buttons(current)}
        <PaginationInput context={context} />
        {buttons(total)}
      </>
    }
  }

  return (
    <div className={`py-12 ${totalPages < 2 ? 'hidden' : 'block'}`}>
      <div className="flex justify-center items-center space-x-2 md:space-x-6">
        <button
          onClick={() => changeCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-8 leading-8 px-3 text-sm flex justify-center items-center rounded md:w-[72px]
          ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-darker'}`}
        >
          <div 
            className={`w-2 h-2 border-b-2 border-l-2 rotate-45
            ${currentPage === 1 ? 'border-gray-400' : ''}`}
          ></div>
          <span className="ml-1 hidden md:block">Back</span> 
        </button>
        <div className="flex items-center space-x-2">
          {
            paginate(currentPage, totalPages)
          }
        </div>
        <button 
          onClick={() => changeCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`h-8 leading-8 px-3 text-sm flex justify-center items-center rounded md:w-[72px]
          ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-darker'}`}
        >
          <span className="mr-1 hidden md:block">Next</span> 
          <div 
            className={`w-2 h-2 border-t-2 border-r-2 rotate-45
            ${currentPage === totalPages ? 'border-gray-400' : ''}`}
          ></div>
        </button>
      </div>
    </div>
  )
}
export default Pagination