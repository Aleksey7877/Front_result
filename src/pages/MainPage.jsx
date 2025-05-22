import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { getFilmsFromStorage, initFilmsIfEmpty } from "../utils/localFilms"; // утилиты для работы с localStorage
import "../styles/m_style.css";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

// для перезагрузки локального хранилища - восстановить 9 фильмов по-умолчанию:
// localStorage.removeItem("films");
// window.location.reload();

const MainPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(genres.map((g) => [g, true]))
  );
  const [films, setFilms] = useState([]);

  const toggleGenre = (genre) => {
    setFilters((prev) => ({ ...prev, [genre]: !prev[genre] }));
  };

  useEffect(() => {
    initFilmsIfEmpty();
    const stored = getFilmsFromStorage();
    setFilms(stored);
  }, []);

  return (
    <div className="m-main-page">
      <div className="m-page-container">
        <div className="m-top-nav">
          <span className="m-nav-item-all" onClick={() => navigate("/")}>
            Все фильмы
          </span>
          <span className="m-nav-item" onClick={() => navigate("/favorites")}>
            Избранное
          </span>
          <span className="m-nav-item" onClick={() => navigate("/add")}>
            Добавить фильм
          </span>
        </div>

        <div className="m-toolbar">
          <div className="m-title">Фильмы</div>
          <div className="m-horizontal-filters">
            {genres.map((genre) => (
              <div
                key={genre}
                className={`m-genre-filter m-genre-filter-${genre.toLowerCase()}`}
                onClick={() => toggleGenre(genre)}
              >
                <div className={`m-circle ${filters[genre] ? "m-active" : ""}`}>
                  {filters[genre] && <span className="m-checkmark">✓</span>}
                </div>
                <span className="m-genre-label">{genre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="m-component">
          {films
            .filter((film) => filters[film.genre])
            .map((film) => (
              <div
                key={film.title}
                className={`m-film-block m-genre-${film.genre.toLowerCase()}`}
              >
                <img
                  className="m-image"
                  src={
                    film.img.startsWith("data:image")
                      ? film.img
                      : `/img/${film.img}`
                  }
                  alt={film.title}
                  onClick={() =>
                    navigate(`/film/${encodeURIComponent(film.title)}`)
                  }
                  style={{ cursor: "pointer" }}
                />
                <div
                  className="m-card-title"
                  onClick={() =>
                    navigate(`/film/${encodeURIComponent(film.title)}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {film.title}
                </div>

                <div className="m-characteristics">
                  <div className="m-text-wrapper-genre">{film.genre}</div>

                  <div className="m-duration-group">
                    <img
                      className="m-icon m-icon-clock"
                      src="/img/clock-icon.jpg"
                      alt="clock"
                    />
                    <div className="m-text-wrapper-6">{film.duration} мин.</div>
                  </div>

                  <div
                    className={`m-icon-star ${
                      favorites.includes(film.title) ? "filled" : ""
                    }`}
                    onClick={() => toggleFavorite(film.title)}
                    title="Добавить в избранное"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="m-group-3">
        <div className="m-text-wrapper-5">Фильмограф</div>
      </div>
    </div>
  );
};

export default MainPage;
