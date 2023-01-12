import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MovieProvider } from './context/MovieContext';
import { PopularProvider } from './context/PopularContext';
import { RatingProvider } from './context/RatingContext';
import { FavouritesProvider } from './context/FavouritesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FavouritesProvider>
    <RatingProvider>
      <PopularProvider>
        <MovieProvider>
          <App />
        </MovieProvider>
      </PopularProvider>
    </RatingProvider>
  </FavouritesProvider>
);
