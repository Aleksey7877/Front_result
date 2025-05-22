import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultFilms from "../data/films";
import "../styles/add_style.css";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

const getStoredFilms = () => {
  const stored = localStorage.getItem("films");
  return stored ? JSON.parse(stored) : defaultFilms;
};

const saveFilmsToStorage = (films) => {
  localStorage.setItem("films", JSON.stringify(films));
};

const AddFilmPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    description: "",
    genre: {},
    img: "",
    imgPreview: "",
  });

  const [error, setError] = useState("");

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

    if (!Object.values(formData.genre).includes(true)) {
      setError("Пожалуйста, выберите жанр.");
      return;
    }

    const films = getStoredFilms();

    const newFilm = {
      title: formData.title.trim(),
      duration: formData.duration,
      description: formData.description,
      genre: Object.keys(formData.genre).find((g) => formData.genre[g]),
      img: formData.img,
    };

    saveFilmsToStorage([...films, newFilm]);
    navigate("/");
  };

  return (
    <div className="add-div-wrapper">
      <div className="add-div">
        <div className="add-frame">
          <div className="add-text-wrapper-15" onClick={() => navigate("/")}>
            Все фильмы
          </div>
          <div
            className="add-text-wrapper-15"
            onClick={() => navigate("/favorites")}
          >
            Избранное
          </div>
          <div
            className="add-text-wrapper-15-add"
            onClick={() => navigate("/add")}
          >
            Добавить фильм
          </div>
        </div>

        <div className="add-overlap">
          <div className="add-text-wrapper-2">Добавить фильм</div>

          {error && (
            <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>
          )}

          <div className="add-form-row">
            <label className="add-label">Название</label>
            <input
              type="text"
              className="add-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="add-form-row">
            <label className="add-label">Жанр</label>
            <div className="add-horizontal-filters">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className={`add-genre-filter add-genre-filter-${genre.toLowerCase()}`}
                  onClick={() => toggleGenre(genre)}
                >
                  <div
                    className={`add-circle ${
                      formData.genre[genre] ? "add-active" : ""
                    }`}
                  >
                    {formData.genre[genre] && (
                      <span className="add-checkmark">✓</span>
                    )}
                  </div>
                  <span className="add-genre-label">{genre}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="add-form-row">
            <label className="add-label">Длительность</label>
            <input
              type="text"
              className="add-input"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </div>

          <div className="add-form-row">
            <label className="add-label">Описание</label>
            <textarea
              className="add-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="add-form-row">
            <label className="add-label">Загрузить фото</label>
            <div className="add-file-block">
              <label htmlFor="file-upload" className="add-button">
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
              {formData.imgPreview && (
                <img
                  src={formData.imgPreview}
                  alt="preview"
                  className="add-image-preview"
                />
              )}
            </div>
          </div>

          <button className="add-button-2" onClick={handleSave}>
            Добавить фильм
          </button>
        </div>

        <div className="add-group-3">
          <div className="add-text-wrapper-5">Фильмограф</div>
        </div>
      </div>
    </div>
  );
};

export default AddFilmPage;
