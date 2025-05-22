import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import defaultFilms from "../data/films";
import "../styles/red_style.css";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

const getStoredFilms = () => {
  const stored = localStorage.getItem("films");
  return stored ? JSON.parse(stored) : defaultFilms;
};

const saveFilmsToStorage = (films) => {
  localStorage.setItem("films", JSON.stringify(films));
};

const EditFilmPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const films = getStoredFilms();
    const film = films.find((f) => f.title === decodedTitle);

    if (film) {
      setFormData({
        title: film.title,
        originalTitle: film.title,
        duration: film.duration,
        description: film.description,
        genre: { [film.genre]: true },
        img: film.img,
        imgPreview: film.img.startsWith("data:image")
          ? film.img
          : `/img/${film.img}`,
      });
    }
  }, [decodedTitle]);

  const toggleGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genre: { [genre]: true },
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setError("Пожалуйста, введите название фильма.");
      return;
    }

    const films = getStoredFilms();
    const newTitle = formData.title;
    const updated = films.map((f) =>
      f.title === formData.originalTitle
        ? {
            ...f,
            title: newTitle,
            duration: formData.duration,
            description: formData.description,
            genre: Object.keys(formData.genre).find((g) => formData.genre[g]),
            img: formData.img,
          }
        : f
    );

    saveFilmsToStorage(updated);

    if (
      formData.originalTitle !== newTitle &&
      favorites.includes(formData.originalTitle)
    ) {
      toggleFavorite(formData.originalTitle);
      toggleFavorite(newTitle);
    }

    navigate(`/film/${encodeURIComponent(newTitle)}`);
  };

  if (!formData) return <div style={{ padding: 32 }}>Фильм не найден</div>;

  return (
    <div className="red-wrapper-page">
      <div className="red-div">
        <div className="red-frame">
          <div className="red-text-wrapper-15" onClick={() => navigate("/")}>
            Все фильмы
          </div>
          <div
            className="red-text-wrapper-15"
            onClick={() => navigate("/favorites")}
          >
            Избранное
          </div>
          <div
            className="red-text-wrapper-15-add"
            onClick={() => navigate("/add")}
          >
            Добавить фильм
          </div>
        </div>

        <div className="red-overlap">
          <div className="red-text-wrapper-2">Редактировать фильм</div>

          {error && (
            <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>
          )}

          <div className="red-form-row">
            <label className="red-label">Название</label>
            <input
              type="text"
              className="red-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="red-form-row">
            <label className="red-label">Жанр</label>
            <div className="red-horizontal-filters">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className={`red-genre-filter red-genre-filter-${genre.toLowerCase()}`}
                  onClick={() => toggleGenre(genre)}
                >
                  <div
                    className={`red-circle ${
                      formData.genre[genre] ? "red-active" : ""
                    }`}
                  >
                    {formData.genre[genre] && (
                      <span className="red-checkmark">✓</span>
                    )}
                  </div>
                  <span className="red-genre-label">{genre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="red-form-row">
            <label className="red-label">Длительность</label>
            <input
              type="text"
              className="red-input"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </div>

          <div className="red-form-row">
            <label className="red-label">Описание</label>
            <textarea
              className="red-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="red-form-row">
            <label className="red-label">Фото</label>
            <div className="red-file-block">
              <label htmlFor="file-upload" className="red-button">
                Выбрать файл
              </label>
              <input
                id="file-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData((prev) => ({
                        ...prev,
                        img: reader.result,
                        imgPreview: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <img
                src={formData.imgPreview}
                alt={formData.title}
                className="red-image-preview"
              />
            </div>
          </div>

          <button className="red-button-2" onClick={handleSave}>
            Сохранить изменения
          </button>
        </div>

        <div className="red-group-3">
          <div className="red-text-wrapper-5">Фильмограф</div>
        </div>
      </div>
    </div>
  );
};

export default EditFilmPage;
