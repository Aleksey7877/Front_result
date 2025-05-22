import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { getFilmsFromStorage, saveFilmsToStorage } from "../utils/localFilms";
import "../styles/film_style.css";

const FilmPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);

  const [film, setFilm] = useState(null);

  useEffect(() => {
    const storedFilms = getFilmsFromStorage();
    const found = storedFilms.find((f) => f.title === decodedTitle);
    setFilm(found);

    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };
    preload("/img/star-icon.webp");
    preload("/img/star-outline.png");
  }, [decodedTitle]);

  const handleDelete = () => {
    const films = getFilmsFromStorage();
    const updated = films.filter((f) => f.title !== decodedTitle);
    saveFilmsToStorage(updated);

    if (favorites.includes(decodedTitle)) {
      toggleFavorite(decodedTitle);
    }

    navigate("/");
  };

  if (!film) {
    return (
      <div className="film-screen">
        <div className="film-div">
          <h1>Фильм не найден</h1>
          <button onClick={() => navigate("/")}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="film-main-page">
      <div className="film-page-container">
        <div className="film-content">
          <div className="film-top-nav">
            <span className="film-nav-item" onClick={() => navigate("/")}>
              Все фильмы
            </span>
            <span
              className="film-nav-item"
              onClick={() => navigate("/favorites")}
            >
              Избранное
            </span>
            <span className="film-nav-item" onClick={() => navigate("/add")}>
              Добавить фильм
            </span>
          </div>

          <div className="film-content-row">
            <img
              className="film-image"
              src={
                film.img.startsWith("data:image")
                  ? film.img
                  : `/img/${film.img}`
              }
              alt={film.title}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="film-text-wrapper">{film.title}</div>
                <img
                  className="m-icon-star"
                  src={
                    favorites.includes(film.title)
                      ? "/img/star-icon.webp"
                      : "/img/star-outline.png"
                  }
                  alt="star"
                  onClick={() => toggleFavorite(film.title)}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: "24px",
                  gap: "100px",
                }}
              >
                <div className="film-frame">
                  <div className="film-div-wrapper">
                    <div className="film-text-wrapper-3">{film.genre}</div>
                  </div>
                </div>

                <div className="film-group">
                  <div className="film-group-2">
                    <div className="film-text-wrapper-2">
                      <img
                        className="film-clock"
                        src="/img/clock-icon.jpg"
                        alt="clock"
                      />
                      {film.duration} минут
                    </div>
                  </div>
                </div>
              </div>

              <div className="film-group-wrapper" style={{ marginTop: "32px" }}>
                <div className="film-element-wrapper">
                  <p className="film-element">{film.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="film-actions">
            <button className="film-CTA" onClick={handleDelete}>
              Удалить
            </button>
            <button
              className="film-button"
              onClick={() =>
                navigate(`/edit/${encodeURIComponent(film.title)}`)
              }
            >
              Редактировать
            </button>
          </div>

          <div className="film-group-3">
            <div className="film-text-wrapper-5">Фильмограф</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmPage;
