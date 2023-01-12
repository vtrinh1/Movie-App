import { useContext, useEffect, useRef, useState } from "react";
import MovieContext from "../context/MovieContext";

function PaginationInput({ context }) {
  const [number, setNumber] = useState();
  const { changeCurrentPage } = useContext(context)
  const buttonRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const closeInputOnBlur = (e) => {
      if(!e.target?.classList.contains('pagination__input')) {
        buttonRef?.current?.classList.remove('hidden');
        inputRef?.current?.classList.add('hidden');
      }
    }
    document.addEventListener('click', closeInputOnBlur);
    return () => {
      document.removeEventListener('click', closeInputOnBlur)
    }
  }, [])

  const toggleInput = () => {
    buttonRef?.current?.classList.toggle('hidden')
    inputRef?.current?.classList.toggle('hidden')
    inputRef?.current?.focus()
    inputRef.current.value = ''
  }
  
  const onSubmit = (e) => {
    e.preventDefault();
    changeCurrentPage(number)
    toggleInput();
  }

  return (
    <>
      <button
        className="w-8 h-8 leading-8 text-center rounded bg-dark hover:bg-darker
        pagination__input"
        ref={buttonRef}
        onClick={toggleInput}
      >
        ...
      </button>
      <form onSubmit={onSubmit}>
        <input
          className="h-8 w-10 leading-8 px-1 text-center rounded focus:outline-none text-black pagination__input hidden"
          ref={inputRef}
          onChange={(e) => setNumber(+e.target.value)}
          type="number"
        />
      </form>
    </>
  )
}
export default PaginationInput