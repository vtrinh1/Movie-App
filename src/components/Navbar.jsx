import { useRef } from "react"
import { Link } from "react-router-dom"

function Navbar() {
  const hamburgerRef = useRef();
  const hamburgerMenuRef = useRef();

  const toggleMenu = () => {
    hamburgerRef?.current?.classList.toggle('open')
    hamburgerMenuRef?.current?.classList.toggle('open')
    document.body.classList.toggle('menu__open');
  }

  return (
    <nav className="bg-darkest">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to='/' className="text-2xl select-none font-medium">
            best
            <span className="text-accent">movies</span>
          </Link>
          {/* Links - Above 768px */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to='/'
              className="nav__link"
            >
              Home
            </Link>
            <Link 
              to='/search'
              className="nav__link"
            >
              Search
            </Link>
            <Link 
              to='/popular'
              className="nav__link"
            >
              Popular
            </Link>
            <Link 
              to='/toprated'
              className="nav__link"
            >
              Top Rated
            </Link>
            <Link 
              to='/favourites'
              className="nav__link"
            >
              Favourites
            </Link>
          </div>
          {/* Hamburger - Below 768px */}
          <div 
            className="hamburger relative z-20 md:hidden"
            ref={hamburgerRef}
            onClick={toggleMenu}
          >
            <div className="hamburger__top"></div>
            <div className="hamburger__middle"></div>
            <div className="hamburger__bottom"></div>
          </div>
          <div 
            className="hamburger__menu fixed flex flex-col space-y-10 justify-center duration-200 ease z-10
            md:hidden text-black text-center text-xl"
            ref={hamburgerMenuRef}
          >
            <Link 
              to='/'
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to='/search'
              onClick={toggleMenu}
            >
              Search
            </Link>
            <Link
              to='/popular'
              onClick={toggleMenu}
            >
              Popular
            </Link>
            <Link
              to='/toprated'
              onClick={toggleMenu}
            >
              Top Rated
            </Link>
            <Link
              to='/favourites'
              onClick={toggleMenu}
            >
              Favourites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar