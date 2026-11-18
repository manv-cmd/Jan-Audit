(function () {
  const TOKEN_KEY = "jan-audit:access-token";
  const USER_KEY  = "jan-audit:current-user";

  const defaultUser = {
    id: "usr-admin",
    name: "Ananya Sharma",
    email: "admin@janaudit.in",
    role: "Administrator",
    title: "District Programme Administrator",
    department: "Rural Development Department"
  };

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  function saveSession(user, token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("jan-audit:session");
  }

  /* ── Public API ─────────────────────────────────────────────────────────── */
  const auth = {
    /** Return the cached user object, or default/fallback if not signed in. */
    currentUser() {
      try {
        const u = JSON.parse(localStorage.getItem(USER_KEY));
        if (u && u.name) return u;
      } catch {}
      // Check legacy session
      try {
        const legacy = JSON.parse(localStorage.getItem("jan-audit:session"));
        if (legacy && legacy.userId) {
          saveSession(defaultUser, "demo-fallback-token");
          return defaultUser;
        }
      } catch {}
      return null;
    },

    /**
     * POST /auth/login → stores the Bearer token + user profile.
     * Returns the user object on success, throws on failure.
     */
    async login(email, password, remember) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Enter a valid email address.");

      let response, body;
      try {
        const baseUrl = (window.JanAuditConfig && window.JanAuditConfig.API_BASE_URL) || "http://127.0.0.1:8001";
        response = await fetch(
          baseUrl.replace(/\/$/, "") + "/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password, remember: Boolean(remember) }),
          }
        );
        body = await response.json();
      } catch (err) {
        throw new Error("Unable to reach the Jan Audit API. Please check that the backend is running.");
      }

      if (!response.ok) {
        throw new Error((body && (body.detail || body.message)) || "Login failed.");
      }

      saveSession(body.user, body.access_token);
      return body.user;
    },

    logout() {
      clearSession();
      location.replace("login.html");
    },

    requireAuth() {
      const user = this.currentUser();
      if (!user) {
        location.replace("login.html");
        return null;
      }
      return user;
    },

    canManageProjects(user) { return user && user.role === "Administrator"; },
    canManageFindings(user) { return user && (user.role === "Administrator" || user.role === "Auditor"); },

    /* ── Demo role-switcher still works (hits the API for a fresh token) ─── */
    async switchUser(email) {
      return this.login(email, "Admin@123", true);
    },
  };

  window.JanAuditAuth = auth;
})();
