/*
Frontend Authentication Module Responsibilities:
  - Register users
  - Login users
  - Store JWT access token
  - Remove token on logout
  - Provide authentication state to other modules
*/

const API_URL = "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

function isLoggedIn() {
  return Boolean(getToken());
}

function saveToken(token) {
  localStorage.setItem("access_token", token);
}

function clearToken() {
  localStorage.removeItem("access_token");
}

async function register() {
  const usernameValue = document.getElementById("username").value.trim();
  const passwordValue = document.getElementById("password").value;

  if (usernameValue.length < 3 || passwordValue.length < 6) {
    showAuthMessage("Username must be 3+ characters and password 6+ characters.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    showAuthMessage("Registration successful. You can now login.");
  } catch (error) {
    showAuthMessage(error.message);
  }
}

async function login() {
  const usernameValue = document.getElementById("username").value.trim();
  const passwordValue = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    saveToken(data.access_token);
    showAuthMessage("Login successful.");
    loadDashboard();
  } catch (error) {
    showAuthMessage(error.message);
  }
}

function logout() {
  clearToken();
  showAuthMessage("Logged out successfully.");
  document.getElementById("projectList").innerHTML =
    "<p>Please login to access protected project data.</p>";
}

function showAuthMessage(message) {
  document.getElementById("authMessage").textContent = message;
}
