# Movie Finder

Responsive movie finder built with HTML, CSS and vanilla JavaScript. It uses the TMDB REST API for popular movies, search and movie details; favorites are saved in the browser with LocalStorage.

## Run locally

1. Install the [Vercel CLI](https://vercel.com/docs/cli) and log in with `vercel login`.
2. Add your TMDB Read Access Token to a local `.env.local` file (copy `.env.example` first). Do not commit this file.
3. Start the app with Vercel's local runtime:

   ```bash
   vercel dev
   ```

4. Open the local URL printed by Vercel.

To create or rotate a TMDB token, use [TMDB account settings](https://www.themoviedb.org/settings/api). Never put the token in frontend JavaScript or send it through the app. The Vercel function reads it from a server-only environment variable.

## Features

- Browse popular movies and search by title.
- View posters, release years, ratings, descriptions and genres.
- Open a movie details dialog.
- Save and remove favorites; they persist in LocalStorage.
- Responsive layout, loading placeholders, pagination and API error messages.

## Deploy to Vercel

1. Push this project to a GitHub repository and import it into Vercel.
2. In **Project → Settings → Environment Variables**, add `TMDB_READ_ACCESS_TOKEN` with your TMDB API Read Access Token for Production (and Preview if needed).
3. Redeploy the project. The frontend calls `/api/tmdb/...`; Vercel proxies those requests server-side, and the token is never sent to the browser.

If the proxy is not configured or unavailable, the app shows demo movies instead.

Movie metadata and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
