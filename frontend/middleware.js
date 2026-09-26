/*
Frontend Middleware / API Interceptor
This module sits between UI code and fetch(). It automatically:
  - adds the JWT Authorization header
  - handles common API errors
  - detects unauthorized sessions
  - measures request duration
  - exposes one reusable API function
*/

async function apiRequest(endpoint, options = {}) {
  const startTime = performance.now();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error("Backend server is unavailable.");
  }

  const elapsed = performance.now() - startTime;
  console.debug(`[API] ${options.method || "GET"} ${endpoint} - ${elapsed.toFixed(2)}ms`);

  if (response.status === 401) {
    clearToken();
    throw new Error("Session expired. Please login again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "API request failed.");
  }

  return data;
}
