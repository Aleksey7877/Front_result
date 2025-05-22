import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import defaultFilms from "../data/films";
import "../styles/fav_style.css";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("films");
    setFilms(stored ? JSON.parse(stored) : defaultFilms);
  }, []);

  const favoriteFilms = films.filter((f) => favorites.includes(f.title));

  return (
    <div className="fav-screen">
      <div className="fav-div">
        <div className="fav-content">
          <div className="fav-top">
            <div className="fav-nav">
              <div className="fav-link" onClick={() => navigate("/")}>
                Все фильмы
              </div>
              <div
                className="fav-link active"
                onClick={() => navigate("/favorites")}
              >
                Избранное
              </div>
              <div className="fav-link" onClick={() => navigate("/add")}>
                Добавить фильм
              </div>
            </div>
            <div className="fav-subtitle">Избранное</div>
          </div>

          <div className="fav-list">
            {favoriteFilms.map((film) => (
              <div className="fav-film-block" key={film.title}>
                <img
                  className="fav-film-img"
                  src={
                    film.img.startsWith("data:image")
                      ? film.img
                      : `/img/${film.img}`
                  }
                  alt={film.title}
                  onClick={() =>
                    navigate(`/film/${encodeURIComponent(film.title)}`)
                  }
                />
                <div className="fav-film-info">
                  <div className="fav-film-title">{film.title}</div>
                  <div className="fav-film-duration">
                    <img
                      className="fav-film-icon"
                      src="/img/clock-icon.jpg"
                      alt="clock"
                    />
                    {film.duration} мин.
                  </div>
                </div>
                <div
                  className="fav-film-delete"
                  onClick={() => toggleFavorite(film.title)}
                >
                  Удалить
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fav-footer">
          <div className="fav-footer-text">Фильмограф</div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
