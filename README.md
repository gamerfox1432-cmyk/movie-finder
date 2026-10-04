# Movie Finder

A responsive movie discovery app built with HTML, CSS, and vanilla JavaScript. Browse popular titles, search TMDB, view film details, and save favorites in your browser.

## Features

- Live popular-movie listings and title search through the TMDB REST API.
- Posters, release dates, ratings, descriptions, and genres.
- Movie details dialog with runtime and genre information.
- Favorites stored in LocalStorage and preserved across reloads.
- Responsive layout, loading states, pagination, and API error handling.
- Server-side API proxy keeps the TMDB access token out of frontend code.

## Run locally

1. Install Node.js and the Vercel CLI, then authenticate with Vercel.
2. Copy .env.example to .env.local.
3. Set TMDB_READ_ACCESS_TOKEN in .env.local. Use a TMDB Read Access Token and never commit the local environment file.
4. Run vercel dev and open the local URL it prints.

Create or rotate a token in TMDB account settings: https://www.themoviedb.org/settings/api.

## Deploy

1. Import this GitHub repository into Vercel.
2. In Project Settings, add TMDB_READ_ACCESS_TOKEN as an environment variable for Production (and Preview, if needed).
3. Redeploy. The client calls /api/tmdb/proxy with an allowlisted endpoint; the server forwards the request to TMDB using the secret token.

If TMDB is unavailable or the server token is not configured, the app falls back to demo movies.

Movie data and images are provided by TMDB: https://www.themoviedb.org/. This project uses the TMDB API but is not endorsed or certified by TMDB.
