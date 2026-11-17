// Automatically determine the API host based on where the page is loaded from
const apiHost = window.location.hostname || "127.0.0.1";

window.JanAuditConfig = Object.freeze({
  API_BASE_URL: `http://${apiHost}:8000`,
  DATA_MODE: "api",
  STORAGE_PREFIX: "jan-audit:"
});
