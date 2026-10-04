const TMDB_API_BASE = "https://api.themoviedb.org/3";
const ALLOWED_QUERY_PARAMETERS = new Set(["endpoint", "language", "page", "query"]);

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    return response.status(503).json({ error: "TMDB is not configured on the server." });
  }

  const apiPath = request.query.endpoint;
  if (typeof apiPath !== "string") {
    return response.status(400).json({ error: "A TMDB endpoint is required." });
  }
  const isAllowedPath =
    apiPath === "movie/popular" ||
    apiPath === "search/movie" ||
    /^movie\/\d{1,10}$/.test(apiPath);
  if (!isAllowedPath) {
    return response.status(404).json({ error: "TMDB endpoint not found." });
  }

  const parameters = new URLSearchParams();
  parameters.set("language", "uk-UA");
  for (const [name, value] of Object.entries(request.query)) {
    if (name === "path" || name === "endpoint") {
      continue;
    }
    if (!ALLOWED_QUERY_PARAMETERS.has(name)) {
      return response.status(400).json({ error: "Unsupported query parameter." });
    }
    if (Array.isArray(value)) {
      return response.status(400).json({ error: "Invalid query parameter." });
    }
    if (name === "page" && !/^[1-9]\d{0,2}$/.test(String(value))) {
      return response.status(400).json({ error: "Invalid page number." });
    }
    if (name === "query" && String(value).length > 150) {
      return response.status(400).json({ error: "Search query is too long." });
    }
    parameters.set(name, String(value));
  }

  if (apiPath === "search/movie" && !parameters.get("query")?.trim()) {
    return response.status(400).json({ error: "A search query is required." });
  }

  const upstreamUrl = TMDB_API_BASE + "/" + apiPath + "?" + parameters.toString();
  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    const body = await upstreamResponse.text();
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return response.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("TMDB request failed.", error);
    return response.status(502).json({ error: "TMDB is temporarily unavailable." });
  }
};const TMDB_API_BASE = "https://api.themoviedb.org/3";
const ALLOWED_QUERY_PARAMETERS = new Set(["endpoint", "language", "page", "query"]);

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    return response.status(503).json({ error: "TMDB is not configured on the server." });
  }

  const apiPath = request.query.endpoint;
  if (typeof apiPath !== "string") {
    return response.status(400).json({ error: "A TMDB endpoint is required." });
  }
  const isAllowedPath =
    apiPath === "movie/popular" ||
    apiPath === "search/movie" ||
    /^movie\/\d{1,10}$/.test(apiPath);
  if (!isAllowedPath) {
    return response.status(404).json({ error: "TMDB endpoint not found." });
  }

  const parameters = new URLSearchParams();
  parameters.set("language", "uk-UA");
  for (const [name, value] of Object.entries(request.query)) {
    if (name === "path" || name === "endpoint") {
      continue;
    }
    if (!ALLOWED_QUERY_PARAMETERS.has(name)) {
      return response.status(400).json({ error: "Unsupported query parameter." });
    }
    if (Array.isArray(value)) {
      return response.status(400).json({ error: "Invalid query parameter." });
    }
    if (name === "page" && !/^[1-9]\d{0,2}$/.test(String(value))) {
      return response.status(400).json({ error: "Invalid page number." });
    }
    if (name === "query" && String(value).length > 150) {
      return response.status(400).json({ error: "Search query is too long." });
    }
    parameters.set(name, String(value));
  }

  if (apiPath === "search/movie" && !parameters.get("query")?.trim()) {
    return response.status(400).json({ error: "A search query is required." });
  }

  const upstreamUrl = TMDB_API_BASE + "/" + apiPath + "?" + parameters.toString();
  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    const body = await upstreamResponse.text();
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return response.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("TMDB request failed.", error);
    return response.status(502).json({ error: "TMDB is temporarily unavailable." });
  }
};
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const ALLOWED_QUERY_PARAMETERS = new Set(["language", "page", "query"]);

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    return response.status(503).json({ error: "TMDB is not configured on the server." });
  }

  const pathSegments = Array.isArray(request.query.path)
    ? request.query.path.map(String)
    : [];
  const apiPath = pathSegments.join("/");
  const isAllowedPath =
    apiPath === "movie/popular" ||
    apiPath === "search/movie" ||
    /^movie\/\d{1,10}$/.test(apiPath);
  if (!isAllowedPath) {
    return response.status(404).json({ error: "TMDB endpoint not found." });
  }

  const parameters = new URLSearchParams();
  parameters.set("language", "uk-UA");
  for (const [name, value] of Object.entries(request.query)) {
    if (name === "path") {
      continue;
    }
    if (!ALLOWED_QUERY_PARAMETERS.has(name)) {
      return response.status(400).json({ error: "Unsupported query parameter." });
    }
    if (Array.isArray(value)) {
      return response.status(400).json({ error: "Invalid query parameter." });
    }
    if (name === "page" && !/^[1-9]\d{0,2}$/.test(String(value))) {
      return response.status(400).json({ error: "Invalid page number." });
    }
    if (name === "query" && String(value).length > 150) {
      return response.status(400).json({ error: "Search query is too long." });
    }
    parameters.set(name, String(value));
  }

  if (apiPath === "search/movie" && !parameters.get("query")?.trim()) {
    return response.status(400).json({ error: "A search query is required." });
  }

  const upstreamUrl = `${TMDB_API_BASE}/${apiPath}?${parameters.toString()}`;
  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    const body = await upstreamResponse.text();
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return response.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("TMDB request failed.", error);
    return response.status(502).json({ error: "TMDB is temporarily unavailable." });
  }
};
