import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MoviePage from "./pages/MoviePage";
import CastPage from "./pages/CastPage";
import Popular from "./pages/Popular";
import TopRated from "./pages/TopRated";
import Favourites from "./pages/Favourites";

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen bg-dark text-white">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/popular' element={<Popular />} />
          <Route path='/toprated' element={<TopRated />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path='/movie/:id' element={<MoviePage />} />
          <Route path='/actor/:id' element={<CastPage />} />
        </Routes>
      </div>
    </Router> 
  );
}

export default App;
