(function () {
  async function request(path, options) {
    const settings = options || {};
    const token = localStorage.getItem("jan-audit:access-token");
    const headers = { Accept: "application/json", ...(settings.body ? { "Content-Type": "application/json" } : {}), ...(settings.headers || {}), ...(token ? { Authorization: "Bearer " + token } : {}) };
    let response;
    try { response = await fetch(JanAuditConfig.API_BASE_URL.replace(/\/$/, "") + path, { ...settings, headers, body: settings.body && typeof settings.body !== "string" ? JSON.stringify(settings.body) : settings.body }); }
    catch (error) { console.error("API request failed.", error); throw new Error("Unable to reach the Jan Audit API. Please try again."); }
    let body;
    try { body = response.status === 204 ? null : await response.json(); }
    catch (error) { if (response.ok) throw new Error("The API returned an unreadable response."); body = null; }
    if (response.status === 401) { localStorage.removeItem("jan-audit:access-token"); localStorage.removeItem("jan-audit:current-user"); if (!location.pathname.endsWith("login.html")) location.replace("login.html"); throw new Error("Your session has expired. Please sign in again."); }
    if (!response.ok) throw new Error(body && (body.detail || body.message) || "Request failed (" + response.status + ").");
    return body;
  }
  window.JanAuditApi = {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    delete: (path) => request(path, { method: "DELETE" })
  };
  window.JanAuditData = window.JanAuditConfig.DATA_MODE === "api" ? {
    projects: {
      list: () => JanAuditApi.get("/projects"),
      get: (id) => JanAuditApi.get("/projects/" + encodeURIComponent(id)),
      create: (data) => JanAuditApi.post("/projects", data),
      update: (id, data) => JanAuditApi.put("/projects/" + encodeURIComponent(id), data),
      delete: (id) => JanAuditApi.delete("/projects/" + encodeURIComponent(id))
    },
    findings: {
      list: () => JanAuditApi.get("/findings"),
      get: (id) => JanAuditApi.get("/findings/" + encodeURIComponent(id)),
      create: (data) => JanAuditApi.post("/findings", data),
      delete: (id) => JanAuditApi.delete("/findings/" + encodeURIComponent(id))
    }
  } : window.JanAuditStorage;
})();
