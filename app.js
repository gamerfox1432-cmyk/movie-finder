const API_BASE = "/api/tmdb";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const FAVORITES_KEY = "movie-finder:favorites";
const LEGACY_TOKEN_KEY = "movie-finder:tmdb-read-access-token";
const DEMO_MOVIES = [
  {
    id: 27205,
    title: "Початок",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    overview: "Злодій, який викрадає корпоративні таємниці за допомогою технології спільних сновидінь, отримує завдання імплантувати ідею у свідомість керівника.",
    genres: [{ name: "Фантастика" }, { name: "Бойовик" }, { name: "Пригоди" }],
    runtime: 148,
  },
  {
    id: 157336,
    title: "Інтерстеллар",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    release_date: "2014-11-05",
    vote_average: 8.5,
    overview: "Коли Земля стає непридатною для життя, команда дослідників вирушає крізь червоточину в космосі, щоб знайти людству новий дім.",
    genres: [{ name: "Пригоди" }, { name: "Драма" }, { name: "Фантастика" }],
    runtime: 169,
  },
  {
    id: 438631,
    title: "Дюна",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    release_date: "2021-09-15",
    vote_average: 7.8,
    overview: "Пол Атрід разом із родиною вирушає на небезпечну пустельну планету Арракіс — єдине джерело найціннішої речовини у всесвіті.",
    genres: [{ name: "Фантастика" }, { name: "Пригоди" }],
    runtime: 155,
  },
  {
    id: 155,
    title: "Темний лицар",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    overview: "Бетмен, прокурор Гарві Дент і комісар Гордон об'єднуються, щоб зупинити Джокера — злочинця, який занурює Ґотем у хаос.",
    genres: [{ name: "Бойовик" }, { name: "Кримінал" }, { name: "Драма" }],
    runtime: 152,
  },
  {
    id: 329865,
    title: "Прибуття",
    poster_path: "/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    release_date: "2016-11-10",
    vote_average: 7.6,
    overview: "Лінгвістка намагається розшифрувати мову прибульців, які прибули на Землю, і з'ясувати, чого вони прагнуть.",
    genres: [{ name: "Драма" }, { name: "Фантастика" }, { name: "Детектив" }],
    runtime: 116,
  },
  {
    id: 603,
    title: "Матриця",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    overview: "Програміст Нео дізнається, що звична реальність — це симуляція, і приєднується до боротьби за свободу людства.",
    genres: [{ name: "Бойовик" }, { name: "Фантастика" }],
    runtime: 136,
  },
  {
    id: 693134,
    title: "Дюна: Частина друга",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    overview: "Пол Атрід об'єднується з фременами та вирушає шляхом помсти, намагаючись запобігти жахливому майбутньому.",
    genres: [{ name: "Фантастика" }, { name: "Пригоди" }, { name: "Бойовик" }],
    runtime: 167,
  },
  {
    id: 76600,
    title: "Аватар: Шлях води",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    release_date: "2022-12-14",
    vote_average: 7.6,
    overview: "Джейк і Нейтірі разом із родиною шукають прихистку серед океанічного народу Пандори, коли давня загроза повертається.",
    genres: [{ name: "Фантастика" }, { name: "Пригоди" }, { name: "Бойовик" }],
    runtime: 192,
  },
];

const elements = {
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  discoverNav: document.querySelector("#discover-nav"),
  favoritesNav: document.querySelector("#favorites-nav"),
  favoriteCount: document.querySelector("#favorite-count"),
  resultsKicker: document.querySelector("#results-kicker"),
  resultsTitle: document.querySelector("#results-title"),
  resultsMeta: document.querySelector("#results-meta"),
  movieGrid: document.querySelector("#movie-grid"),
  notice: document.querySelector("#notice"),
  pagination: document.querySelector("#pagination"),
  previousPage: document.querySelector("#previous-page"),
  nextPage: document.querySelector("#next-page"),
  pageLabel: document.querySelector("#page-label"),
  dialog: document.querySelector("#movie-dialog"),
  dialogClose: document.querySelector("#dialog-close"),
  dialogContent: document.querySelector("#dialog-content"),
};

const state = {
  favorites: readFavorites(),
  mode: "popular",
  query: "",
  page: 1,
  totalPages: 1,
  currentMovies: [],
  activeMovieId: null,
};

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((movie) => movie && Number.isInteger(movie.id)) : [];
  } catch (error) {
    console.error("Could not read saved favorites from LocalStorage.", error);
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
  } catch (error) {
    console.error("Could not save favorites to LocalStorage.", error);
    showNotice("Обране не вдалося зберегти в цьому браузері. Перевір налаштування сховища.", true);
  }
  updateFavoriteCount();
}

function updateFavoriteCount() {
  elements.favoriteCount.textContent = String(state.favorites.length);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function showNotice(message, isError = false) {
  elements.notice.innerHTML = message;
  elements.notice.classList.toggle("is-error", isError);
  elements.notice.hidden = false;
}

function hideNotice() {
  elements.notice.hidden = true;
  elements.notice.classList.remove("is-error");
  elements.notice.textContent = "";
}

function showSetupNotice() {
  showNotice(
    '<strong>Демо-режим:</strong> показані приклади фільмів. Щоб увімкнути пошук у TMDB, налаштуй змінну ' +
      '<code>TMDB_READ_ACCESS_TOKEN</code> у Vercel. Інструкція — у README.',
  );
}

function getDemoMovies() {
  if (state.mode !== "search") {
    return DEMO_MOVIES;
  }
  const searchTerm = state.query.toLocaleLowerCase("uk-UA");
  return DEMO_MOVIES.filter((movie) =>
    movie.title.toLocaleLowerCase("uk-UA").includes(searchTerm),
  );
}

function setActiveNavigation(mode) {
  elements.discoverNav.classList.toggle("is-active", mode !== "favorites");
  elements.favoritesNav.classList.toggle("is-active", mode === "favorites");
}

function setLoading() {
  elements.movieGrid.innerHTML = Array.from({ length: 10 }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-poster"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  `).join("");
}

function imageUrl(path) {
  return path ? `${IMAGE_BASE}${path}` : "";
}

function renderMovies(movies) {
  state.currentMovies = movies;
  if (!movies.length) {
    elements.movieGrid.innerHTML = `
      <div class="empty-state">
        <strong>${state.mode === "favorites" ? "Тут поки порожньо" : "Нічого не знайдено"}</strong>
        ${state.mode === "favorites"
          ? "Тисни на сердечко біля фільму, щоб додати його сюди."
          : "Спробуй іншу назву або перевір написання."}
      </div>
    `;
    return;
  }

  elements.movieGrid.innerHTML = movies.map((movie) => {
    const poster = imageUrl(movie.poster_path);
    const isFavorite = state.favorites.some((favorite) => favorite.id === movie.id);
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "Рік невідомий";
    const rating = Number.isFinite(Number(movie.vote_average))
      ? Number(movie.vote_average).toFixed(1)
      : "—";
    const title = escapeHtml(movie.title || movie.name || "Без назви");

    return `
      <article class="movie-card">
        <div class="poster-wrap">
          <button class="poster-button" type="button" data-action="details" data-id="${movie.id}" aria-label="Деталі фільму: ${title}">
          ${poster
            ? `<img class="poster-image" src="${escapeHtml(poster)}" alt="Постер фільму «${title}»" loading="lazy" />`
            : `<span class="poster-placeholder" aria-hidden="true">M</span>`}
          <span class="rating-badge"><span class="rating-star">★</span> ${rating}</span>
          </button>
          <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-action="favorite" data-id="${movie.id}" aria-label="${isFavorite ? "Прибрати з обраного" : "Додати в обране"}" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        </div>
        <h3 class="movie-title" title="${title}">${title}</h3>
        <span class="movie-year">${escapeHtml(year)}</span>
      </article>
    `;
  }).join("");
}

function setResultsHeading() {
  const headings = {
    popular: ["Твоя добірка", "Популярне зараз"],
    search: ["Результати пошуку", `«${state.query}»`],
    favorites: ["Твоя колекція", "Обране"],
  };
  const [kicker, title] = headings[state.mode];
  elements.resultsKicker.textContent = kicker;
  elements.resultsTitle.textContent = title;
}

function updatePagination() {
  const shouldShow = state.mode !== "favorites" && state.totalPages > 1;
  elements.pagination.hidden = !shouldShow;
  elements.previousPage.disabled = state.page <= 1;
  elements.nextPage.disabled = state.page >= state.totalPages;
  elements.pageLabel.textContent = `Сторінка ${state.page} з ${state.totalPages}`;
}

async function request(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
  for (const [key, value] of Object.entries({ language: "uk-UA", ...params })) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    const error = new Error(`Помилка API (${response.status}). Спробуй ще раз трохи пізніше.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function loadMovies() {
  hideNotice();
  setResultsHeading();
  elements.resultsMeta.textContent = "";

  setLoading();
  try {
    const endpoint = state.mode === "search" ? "/search/movie" : "/movie/popular";
    const params = { page: state.page };
    if (state.mode === "search") {
      params.query = state.query;
    }
    const data = await request(endpoint, params);
    const movies = Array.isArray(data.results) ? data.results : [];
    state.totalPages = Math.min(Number(data.total_pages) || 1, 500);
    elements.resultsMeta.textContent = data.total_results
      ? `${Number(data.total_results).toLocaleString("uk-UA")} фільмів`
      : "";
    renderMovies(movies);
    updatePagination();
  } catch (error) {
    if (error.status === 404 || error.status === 503 || error instanceof TypeError) {
      const demoMovies = getDemoMovies();
      state.totalPages = 1;
      renderMovies(demoMovies);
      elements.resultsMeta.textContent = `${demoMovies.length} фільмів · демо`;
      showSetupNotice();
      elements.pagination.hidden = true;
      return;
    }
    console.error("Could not load movies from TMDB.", error);
    renderMovies([]);
    showNotice(`<strong>Не вдалося завантажити фільми.</strong> ${escapeHtml(error.message)}`, true);
    elements.pagination.hidden = true;
  }
}

function toggleFavorite(movie) {
  const exists = state.favorites.some((favorite) => favorite.id === movie.id);
  if (exists) {
    state.favorites = state.favorites.filter((favorite) => favorite.id !== movie.id);
  } else {
    state.favorites = [movie, ...state.favorites];
  }
  saveFavorites();
  if (state.mode === "favorites") {
    renderMovies(state.favorites);
  } else {
    renderMovies(state.currentMovies);
  }
  if (state.activeMovieId === movie.id && elements.dialog.open) {
    renderMovieDetails(movie.id);
  }
}

function getMovie(id) {
  return state.currentMovies.find((movie) => movie.id === id)
    ?? state.favorites.find((movie) => movie.id === id);
}

async function openMovieDetails(id) {
  state.activeMovieId = id;
  elements.dialogContent.innerHTML = `
    <div class="skeleton skeleton-poster"></div>
    <div class="dialog-copy">
      <p class="eyebrow">Завантаження деталей</p>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  `;
  if (!elements.dialog.open) {
    elements.dialog.showModal();
  }
  await renderMovieDetails(id);
}

async function renderMovieDetails(id) {
  try {
    const movie = await request(`/movie/${id}`);
    if (!movie) {
      throw new Error("TMDB повернув порожню відповідь.");
    }
    renderMovieDetailsContent(movie);
  } catch (error) {
    console.error("Could not load movie details from TMDB.", error);
    if (state.activeMovieId !== id || !elements.dialog.open) {
      return;
    }
    const movie = getMovie(id);
    if (movie && (error.status === 404 || error.status === 503 || error instanceof TypeError)) {
      renderMovieDetailsContent(movie);
      return;
    }
    elements.dialogContent.innerHTML = `
      ${movie?.poster_path
        ? `<img class="dialog-poster" src="${escapeHtml(imageUrl(movie.poster_path))}" alt="" />`
        : `<div class="dialog-poster poster-placeholder" aria-hidden="true">M</div>`}
      <div class="dialog-copy">
        <p class="eyebrow">Про фільм</p>
        <h2 id="dialog-title">${escapeHtml(movie?.title || "Деталі фільму")}</h2>
        <p class="dialog-overview">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function renderMovieDetailsContent(movie) {
  if (state.activeMovieId !== movie.id || !elements.dialog.open) {
    return;
  }
  const poster = imageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "Рік невідомий";
  const genres = (movie.genres ?? []).map((genre) =>
    `<span class="genre-chip">${escapeHtml(genre.name)}</span>`,
  ).join("");
  const runtime = movie.runtime ? `${movie.runtime} хв` : "";
  const rating = Number.isFinite(Number(movie.vote_average))
    ? Number(movie.vote_average).toFixed(1)
    : "—";
  const isFavorite = state.favorites.some((favorite) => favorite.id === movie.id);

  elements.dialogContent.innerHTML = `
    ${poster
      ? `<img class="dialog-poster" src="${escapeHtml(poster)}" alt="Постер фільму «${escapeHtml(movie.title)}»" />`
      : `<div class="dialog-poster poster-placeholder" aria-hidden="true">M</div>`}
    <div class="dialog-copy">
      <p class="eyebrow">Про фільм</p>
      <h2 id="dialog-title">${escapeHtml(movie.title || "Без назви")}</h2>
      <div class="dialog-facts">
        <span>${escapeHtml(releaseYear)}</span>
        ${runtime ? `<span>${runtime}</span>` : ""}
        <span><span class="rating-star">★</span> ${rating}</span>
      </div>
      ${genres ? `<div class="genre-list">${genres}</div>` : ""}
      <p class="dialog-overview">${escapeHtml(movie.overview || "Опис цього фільму поки недоступний українською.")}</p>
      <button class="dialog-favorite" type="button" data-action="dialog-favorite" data-id="${movie.id}">
        ${isFavorite ? "♥ У обраному" : "♡ Додати в обране"}
      </button>
    </div>
  `;
}

function showFavorites() {
  state.mode = "favorites";
  state.page = 1;
  setActiveNavigation(state.mode);
  hideNotice();
  elements.resultsMeta.textContent = `${state.favorites.length} фільмів`;
  setResultsHeading();
  renderMovies(state.favorites);
  elements.pagination.hidden = true;
}

function showDiscover() {
  state.mode = state.query ? "search" : "popular";
  state.page = 1;
  setActiveNavigation(state.mode);
  loadMovies();
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = elements.searchInput.value.trim();
  state.mode = state.query ? "search" : "popular";
  state.page = 1;
  setActiveNavigation(state.mode);
  loadMovies();
});

elements.discoverNav.addEventListener("click", showDiscover);
elements.favoritesNav.addEventListener("click", showFavorites);

elements.previousPage.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadMovies();
    window.scrollTo({ top: elements.resultsTitle.offsetTop - 90, behavior: "smooth" });
  }
});

elements.nextPage.addEventListener("click", () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    loadMovies();
    window.scrollTo({ top: elements.resultsTitle.offsetTop - 90, behavior: "smooth" });
  }
});

elements.movieGrid.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }
  const id = Number(actionTarget.dataset.id);
  const movie = getMovie(id);
  if (!movie) {
    return;
  }
  if (actionTarget.dataset.action === "favorite") {
    event.stopPropagation();
    toggleFavorite(movie);
  } else if (actionTarget.dataset.action === "details") {
    openMovieDetails(id);
  }
});

elements.dialogContent.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="dialog-favorite"]');
  if (!button) {
    return;
  }
  const movie = getMovie(Number(button.dataset.id));
  if (movie) {
    toggleFavorite(movie);
  }
});

elements.dialogClose.addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) {
    elements.dialog.close();
  }
});
elements.dialog.addEventListener("close", () => {
  state.activeMovieId = null;
});

async function initialize() {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch (error) {
    console.error("Could not remove the old browser-stored TMDB token.", error);
  }
  updateFavoriteCount();
  await loadMovies();
}

initialize();
