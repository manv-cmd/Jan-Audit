(function () {
  const A = window.JanAuditAuth;
  const D = window.JanAuditData;   // may be undefined on login page
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
  const date = (value) => {
    if (!value) return "—";
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + "T00:00:00") : new Date(value);
    return Number.isNaN(parsed.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
  };
  const shortDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value)) : "—";
  const badge = (value) => '<span class="badge ' + esc(String(value || "").toLowerCase().replace(/\s+/g, "-")) + '">' + esc(value || "") + "</span>";
  
  function getInitials(name) {
    if (!name || typeof name !== "string") return "JA";
    const parts = name.trim().split(/\s+/);
    return parts.map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "JA";
  }

  const page = location.pathname.split("/").pop() || "index.html";
  const pageMeta = {
    "dashboard.html": ["Dashboard", "A clear view of public works across your district.", "layout-dashboard"],
    "projects.html": ["Projects", "Track, manage and monitor development works.", "folder-kanban"],
    "project-details.html": ["Project details", "Project record, implementation timeline and audit trail.", "map"],
    "findings.html": ["Audit findings", "Review observations recorded during social audits.", "clipboard-check"],
    "reports.html": ["Reports & analytics", "Evidence-led reporting for accountable delivery.", "chart-no-axes-column"],
    "profile.html": ["User profile", "Account details and demo role access.", "user-round"]
  };
  function icon(name, size) { return '<i data-lucide="' + esc(name) + '" width="' + (size || 18) + '" height="' + (size || 18) + '" aria-hidden="true"></i>'; }
  function notify(message, type) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; stack.setAttribute("aria-live", "polite"); document.body.appendChild(stack); }
    const item = document.createElement("div"); item.className = "toast " + (type || "success"); item.textContent = message; stack.appendChild(item);
    setTimeout(() => { item.classList.add("toast-hide"); setTimeout(() => item.remove(), 220); }, 3600);
  }
  function modal(title, content, wide) {
    closeModal();
    const root = document.createElement("div"); root.className = "modal-backdrop"; root.innerHTML = '<section class="modal' + (wide ? " modal-wide" : "") + '" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><p class="eyebrow">JAN AUDIT</p><h2 id="modal-title">' + esc(title) + '</h2></div><button class="icon-button" data-modal-close aria-label="Close dialog">' + icon("x") + "</button></header>" + content + "</section>";
    root.addEventListener("click", (event) => { if (event.target === root || event.target.closest("[data-modal-close]")) closeModal(); });
    document.body.appendChild(root); document.body.classList.add("modal-open"); root.querySelector("input,select,textarea,button:not([data-modal-close])")?.focus();
    document.addEventListener("keydown", escapeModal);
    return root;
  }
  function escapeModal(event) { if (event.key === "Escape") closeModal(); }
  function closeModal() { document.querySelector(".modal-backdrop")?.remove(); document.body.classList.remove("modal-open"); document.removeEventListener("keydown", escapeModal); }
  window.JanAuditUI = { esc, money, date, shortDate, badge, icon, notify, modal, closeModal, shell };

  function shell(content) {
    const activeUser = A.currentUser() || { name: "User", role: "Administrator", email: "admin@janaudit.in" };
    const [title, subtitle, pageIcon] = pageMeta[page] || pageMeta["dashboard.html"];
    const nav = [
      ["dashboard.html", "Overview", "layout-dashboard"],
      ["projects.html", "Projects", "folder-kanban"],
      ["findings.html", "Audit findings", "clipboard-check"],
      ["reports.html", "Reports", "chart-no-axes-column"],
      ["profile.html", "User profile", "user-round"]
    ];
    document.title = title + " | Jan Audit";
    document.getElementById("app").innerHTML =
      '<aside class="sidebar" id="sidebar"><a class="brand" href="dashboard.html"><img src="assets/logo.svg" alt=""><span>Jan Audit<small>PUBLIC WORKS MONITOR</small></span></a><div class="sidebar-label">WORKSPACE</div><nav class="side-nav" aria-label="Main navigation">' +
      nav.map(([href, label, symbol]) => '<a href="' + href + '" class="nav-link ' + (page === href ? "active" : "") + '"><span>' + icon(symbol) + "</span>" + label + "</a>").join("") +
      '</nav><div class="sidebar-bottom"><div class="help-card"><span class="help-icon">' + icon("shield-check") + '</span><strong>Public records, open oversight.</strong><p>Every project tells a story. Keep its progress visible.</p><span class="help-link">JAN AUDIT</span></div><button class="sidebar-user" data-profile><span class="avatar">' + esc(getInitials(activeUser.name)) + '</span><span class="user-summary"><strong>' + esc(activeUser.name) + "</strong><small>" + esc(activeUser.role) + '</small></span>' + icon("chevrons-up-down", 16) + '</button></div></aside><div class="app-main"><header class="topbar"><button class="mobile-menu icon-button" data-menu aria-label="Open navigation">' + icon("menu") + '</button><div class="breadcrumb"><span>Workspace</span>' + icon("chevron-right", 14) + '<strong>' + esc(title) + '</strong></div><div class="topbar-actions"><span class="environment-pill"><span></span> LIVE API</span><button class="topbar-user" data-profile><span class="avatar avatar-small">' + esc(getInitials(activeUser.name)) + '</span><span class="topbar-name">' + esc(activeUser.name.split(" ")[0]) + "</span>" + icon("chevron-down", 15) + '</button></div></header><main class="content"><section class="page-heading"><div class="heading-copy"><div class="heading-icon">' + icon(pageIcon, 20) + '</div><div><h1>' + esc(title) + '</h1><p>' + esc(subtitle) + '</p></div></div></section><div id="page-content">' + content + '</div><footer class="footer"><span>JAN AUDIT <span class="dot-separator">•</span> SOCIAL AUDIT PORTAL</span><span>Public money. Public accountability.</span></footer></main></div><div class="sidebar-scrim" data-menu></div>';
    document.querySelectorAll("[data-profile]").forEach((el) => el.addEventListener("click", () => { location.href = "profile.html"; }));
    document.querySelectorAll("[data-menu]").forEach((el) => el.addEventListener("click", () => { document.body.classList.toggle("nav-open"); }));
    if (window.lucide) lucide.createIcons();
  }

  /* ── Login page ──────────────────────────────────────────────────────────── */
  function loginPage() {
    document.title = "Sign in | Jan Audit";
    document.getElementById("app").innerHTML = `
      <section class="login-layout">
        <div class="login-visual"><a class="brand brand-light" href="login.html"><img src="assets/logo.svg" alt=""><span>Jan Audit<small>PUBLIC WORKS MONITOR</small></span></a>
          <div class="login-story"><span class="overline"><span></span> PUBLIC ACCOUNTABILITY, MADE VISIBLE</span><h1>Better projects.<br><em>Stronger communities.</em></h1><p>A shared view of the public works shaping villages across India — from the first sanction to the final social audit.</p><div class="login-stats"><div><strong>01</strong><span>Transparent<br>project tracking</span></div><div><strong>02</strong><span>Community-led<br>oversight</span></div><div><strong>03</strong><span>Evidence-based<br>reporting</span></div></div></div>
          <div class="login-visual-foot"><span>DEMO ENVIRONMENT · FICTIONAL SAMPLE RECORDS</span><span>Built for public service</span></div>
        </div>
        <div class="login-panel"><div class="login-box"><div class="mobile-brand"><img src="assets/logo.svg" alt=""> Jan Audit</div><div class="login-kicker">WELCOME BACK</div><h2>Sign in to your workspace</h2><p class="login-copy">Enter your credentials to continue to Jan Audit.</p>
          <form id="login-form" novalidate><label for="email">Email address</label><div class="input-icon-wrap"><span>${icon("mail", 17)}</span><input id="email" name="email" type="email" autocomplete="username" placeholder="you@janaudit.in" required value="admin@janaudit.in"></div>
            <label for="password">Password</label><div class="input-icon-wrap"><span>${icon("lock-keyhole", 17)}</span><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required><button type="button" class="password-toggle" aria-label="Show password" id="password-toggle">${icon("eye", 17)}</button></div>
            <div class="form-error" id="login-error" role="alert"></div><div class="login-options"><label class="check-label"><input type="checkbox" name="remember" checked> Remember me</label><span>Secure demo access</span></div><button class="button button-primary login-submit" type="submit" id="login-btn">Sign in <span>${icon("arrow-right", 17)}</span></button>
          </form>
          <div class="demo-credential"><div class="demo-credential-title">${icon("flask-conical", 15)} DEMO CREDENTIALS</div><div><span>Email</span><strong>admin@janaudit.in</strong></div><div><span>Password</span><strong>Admin@123</strong></div></div><p class="login-disclaimer">Demo authentication only. This environment does not use real accounts or store sensitive credentials.</p>
        </div></div>
      </section>`;
    if (window.lucide) lucide.createIcons();
    document.getElementById("password-toggle").addEventListener("click", (event) => {
      const input = document.getElementById("password"); input.type = input.type === "password" ? "text" : "password"; event.currentTarget.setAttribute("aria-label", input.type === "password" ? "Show password" : "Hide password");
    });
    document.getElementById("login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const error = document.getElementById("login-error");
      const btn = document.getElementById("login-btn");
      error.textContent = "";
      btn.disabled = true;
      btn.classList.add("loading");
      btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> <span>Signing in…</span>';
      try {
        await A.login(data.get("email"), data.get("password"), data.has("remember"));
        location.replace("dashboard.html");
      } catch (err) {
        error.textContent = err.message;
        document.getElementById("password").setAttribute("aria-invalid", "true");
        btn.disabled = false;
        btn.classList.remove("loading");
        btn.innerHTML = "Sign in <span>" + icon("arrow-right", 17) + "</span>";
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  /* ── Route ───────────────────────────────────────────────────────────────── */
  const currentUser = A.currentUser();
  if (page === "login.html" || page === "index.html") {
    if (currentUser) location.replace("dashboard.html"); else loginPage();
    return;
  }
  if (!A.requireAuth()) return;
  if (page === "dashboard.html") shell(window.JanAuditDashboard.render());
  else if (page === "projects.html") shell(window.JanAuditProjects.render());
  else if (page === "findings.html") shell(window.JanAuditFindings.render());
  else if (page === "project-details.html") shell(window.JanAuditProjects.renderDetails());
  else if (page === "reports.html") shell(window.JanAuditReports.render());
  else if (page === "profile.html") shell(profileMarkup());
  else { location.replace("dashboard.html"); return; }
  if (page === "projects.html") window.JanAuditProjects.bind();
  if (page === "project-details.html") window.JanAuditProjects.bindDetails();
  if (page === "findings.html") window.JanAuditFindings.bind();
  if (page === "reports.html") window.JanAuditReports.bind();
  if (window.lucide) lucide.createIcons();
  // Sync with backend API in the background so database changes persist across restarts
  if (currentUser && window.JanAuditStorage && window.JanAuditStorage.syncFromApi) {
    window.JanAuditStorage.syncFromApi().then((hasUpdate) => {
      if (hasUpdate) {
        if (page === "projects.html" && window.JanAuditProjects?.refresh) window.JanAuditProjects.refresh();
        else if (page === "dashboard.html" && window.JanAuditDashboard) {
          const el = document.getElementById("page-content");
          if (el) el.innerHTML = window.JanAuditDashboard.render();
          if (window.lucide) lucide.createIcons();
        } else if (page === "findings.html" && window.JanAuditFindings?.refresh) window.JanAuditFindings.refresh();
      }
    });
  }

  document.getElementById("app").addEventListener("click", (event) => {
    const logout = event.target.closest("[data-logout]"); if (logout) A.logout();
  });

  /* ── Profile page markup ─────────────────────────────────────────────────── */
  function profileMarkup() {
    const active = A.currentUser() || {
      name: "Ananya Sharma",
      email: "admin@janaudit.in",
      role: "Administrator",
      title: "District Programme Administrator",
      department: "Rural Development Department"
    };

    const demoRoles = [
      { email: "admin@janaudit.in",   name: "Ananya Sharma",  role: "Administrator", title: "District Programme Administrator",  department: "Rural Development Department" },
      { email: "auditor@janaudit.in", name: "Ravi Kumar",     role: "Auditor",       title: "Social Audit Officer",               department: "Social Audit Unit" },
      { email: "official@janaudit.in",name: "Meera Devi",     role: "Official",      title: "Block Development Officer",           department: "Block Administration" },
    ];
    return `
      <div class="profile-layout">
        <section class="panel profile-card"><div class="profile-banner"></div><div class="profile-body">
          <div class="profile-avatar">${esc(getInitials(active.name))}</div><div class="profile-name-row"><div><h2>${esc(active.name)}</h2><p>${esc(active.title || "")}</p></div>${badge(active.role)}</div>
          <div class="profile-details"><div><span>EMAIL ADDRESS</span><strong>${esc(active.email)}</strong></div><div><span>DEPARTMENT</span><strong>${esc(active.department || "")}</strong></div><div><span>ACCOUNT TYPE</span><strong>Demonstration account</strong></div><div><span>ACCESS STATUS</span><strong><i class="status-dot"></i> Active</strong></div></div>
          <div class="profile-note">${icon("info", 17)}<span>Roles in this demonstration illustrate frontend visibility only. Enforce all permissions in the backend before production use.</span></div>
        </div></section>
        <section class="panel role-panel"><div class="panel-heading"><div><h2>Explore demo roles</h2><p>Switch account to preview role-aware access.</p></div>${icon("users-round", 19)}</div>
          <div class="role-list">${demoRoles.map((entry) => `<article class="role-option ${active.email === entry.email ? "role-active" : ""}"><div class="role-avatar">${esc(getInitials(entry.name))}</div><div class="role-option-copy"><strong>${esc(entry.name)}</strong><span>${esc(entry.title)}</span><small>${esc(entry.email)}</small></div>${badge(entry.role)}${active.email === entry.email ? `<span class="current-role">${icon("check", 14)} Current</span>` : `<button class="button button-outline button-small" data-switch-email="${esc(entry.email)}">Switch role</button>`}</article>`).join("")}</div>
          <div class="role-permissions"><h3>Demo permissions</h3><div><span>${icon("folder-kanban", 15)} Administrator</span><p>Manage projects and audit findings; view reports.</p></div><div><span>${icon("clipboard-check", 15)} Auditor</span><p>Review projects and create audit findings; view reports.</p></div><div><span>${icon("eye", 15)} Official</span><p>Read-only access to projects, findings and reports.</p></div></div>
        </section>
      </div>
      <section class="panel account-actions"><div><h3>Session &amp; demo data</h3><p>Sign out of this demo session.</p></div><div><button class="button button-danger-outline" data-logout>${icon("log-out", 16)} Sign out</button></div></section>`;
  }

  document.getElementById("app").addEventListener("click", async (event) => {
    const switcher = event.target.closest("[data-switch-email]");
    if (switcher) {
      const btn = switcher;
      btn.disabled = true;
      btn.textContent = "Switching…";
      try {
        await A.switchUser(switcher.dataset.switchEmail);
        notify("Signed in as " + A.currentUser().role);
        setTimeout(() => location.reload(), 400);
      } catch (error) {
        notify(error.message, "error");
        btn.disabled = false;
        btn.textContent = "Switch role";
      }
    }
  });
})();
