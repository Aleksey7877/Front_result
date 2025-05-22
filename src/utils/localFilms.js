import defaultFilms from "../data/films";

export const getFilmsFromStorage = () => {
  const stored = localStorage.getItem("films");
  return stored ? JSON.parse(stored) : defaultFilms;
};

export const saveFilmsToStorage = (films) => {
  localStorage.setItem("films", JSON.stringify(films));
};

export const initFilmsIfEmpty = () => {
  if (!localStorage.getItem("films")) {
    localStorage.setItem("films", JSON.stringify(defaultFilms));
  }
};
