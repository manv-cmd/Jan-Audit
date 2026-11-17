(function () {
  const S = window.JanAuditStorage, U = new Proxy({}, { get: (_, property) => window.JanAuditUI[property] });
  function render() {
    const projects = S.projects.list(), findings = S.findings.list(), activity = S.activity.list();
    const completed = projects.filter((project) => project.status === "Completed").length;
    const ongoing = projects.filter((project) => project.status !== "Completed").length;
    const recent = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
    const recentFindings = findings.slice(0, 4), recentActivity = activity.slice(0, 5);
    setTimeout(() => { JanAuditCharts.status("status-chart", projects); JanAuditCharts.village("village-chart", projects); }, 0);
    return `
      <div class="kpi-grid">
        <article class="kpi-card"><div class="kpi-head"><span>Total projects</span><span class="kpi-icon kpi-blue">${U.icon("folder-kanban")}</span></div><strong>${projects.length}</strong><div class="kpi-foot"><span class="kpi-foot-icon">${U.icon("arrow-up-right", 14)}</span><span>Across <b>${new Set(projects.map((p) => p.village)).size}</b> villages</span><span class="kpi-foot-right">ALL WORKS</span></div></article>
        <article class="kpi-card"><div class="kpi-head"><span>Completed projects</span><span class="kpi-icon kpi-green">${U.icon("circle-check")}</span></div><strong>${completed}</strong><div class="kpi-foot"><span class="kpi-good">${projects.length ? Math.round(completed / projects.length * 100) : 0}%</span><span>of all registered works</span><span class="kpi-foot-right">DELIVERED</span></div></article>
        <article class="kpi-card"><div class="kpi-head"><span>Pending / in progress</span><span class="kpi-icon kpi-amber">${U.icon("clock-3")}</span></div><strong>${ongoing}</strong><div class="kpi-foot"><span>Requires ongoing oversight</span><span class="kpi-foot-right">ACTIVE</span></div></article>
        <article class="kpi-card"><div class="kpi-head"><span>Audit findings</span><span class="kpi-icon kpi-teal">${U.icon("clipboard-check")}</span></div><strong>${findings.length}</strong><div class="kpi-foot"><span>${findings.filter((f) => f.severity === "High").length} high severity</span><span class="kpi-foot-right">OBSERVATIONS</span></div></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel chart-panel"><div class="panel-heading"><div><h2>Project status</h2><p>Distribution of all registered works</p></div><span class="panel-icon">${U.icon("chart-pie", 18)}</span></div><div class="donut-wrap"><canvas id="status-chart" aria-label="Project status distribution"></canvas><div class="donut-center"><strong>${projects.length}</strong><span>PROJECTS</span></div></div><div class="chart-legend"><span><i class="legend-dot green"></i>Completed <b>${completed}</b></span><span><i class="legend-dot blue"></i>In progress <b>${projects.filter((p) => p.status === "In Progress").length}</b></span><span><i class="legend-dot amber"></i>Pending <b>${projects.filter((p) => p.status === "Pending").length}</b></span></div></section>
        <section class="panel chart-panel"><div class="panel-heading"><div><h2>Village coverage</h2><p>Active works by village</p></div><span class="panel-icon">${U.icon("chart-no-axes-column", 18)}</span></div><div class="bar-chart-wrap"><canvas id="village-chart" aria-label="Projects by village"></canvas></div><div class="chart-note">${U.icon("map-pin", 14)} Project distribution across local communities</div></section>
      </div>
      <section class="panel table-panel"><div class="panel-heading"><div><h2>Recent projects</h2><p>Latest registered and updated development works</p></div><a class="text-link" href="projects.html">All projects ${U.icon("arrow-up-right", 15)}</a></div>
        ${recent.length ? `<div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>VILLAGE / BLOCK</th><th>SANCTIONED BUDGET</th><th>STATUS</th><th>UPDATED</th><th></th></tr></thead><tbody>${recent.map((project) => `<tr><td><a class="project-name-link" href="project-details.html?id=${encodeURIComponent(project.id)}">${U.esc(project.name)}</a><small class="table-id">${U.esc(project.id)} ${project.sample ? '<span class="demo-mini">DEMO</span>' : ""}</small></td><td>${U.esc(project.village)}<small class="table-id">${U.esc(project.block)} block</small></td><td>${U.money(project.budget)}</td><td>${U.badge(project.status)}</td><td>${U.shortDate(project.updatedAt)}</td><td><a class="row-arrow" href="project-details.html?id=${encodeURIComponent(project.id)}" aria-label="View project">${U.icon("arrow-up-right", 16)}</a></td></tr>`).join("")}</tbody></table></div>` : empty("No projects yet", "Create a project to see it here.", "projects.html", "Add a project")}
      </section>
      <div class="dashboard-bottom">
        <section class="panel compact-panel"><div class="panel-heading"><div><h2>Latest audit findings</h2><p>Recent field observations</p></div><a class="text-link" href="findings.html">View all ${U.icon("arrow-up-right", 15)}</a></div>
          ${recentFindings.length ? `<div class="finding-list">${recentFindings.map((finding) => { const project = S.projects.get(finding.projectId); return `<a class="finding-row" href="findings.html"><span class="finding-icon ${U.esc(finding.severity.toLowerCase())}">${U.icon("file-search", 18)}</span><span class="finding-copy"><strong>${U.esc(project ? project.village : "Unknown project")} <span class="finding-id">· ${U.esc(finding.id)}</span></strong><small>${U.esc(finding.description)}</small></span><span>${U.badge(finding.severity)}<small class="finding-date">${U.shortDate(finding.date)}</small></span></a>`; }).join("")}</div>` : empty("No findings recorded", "Audit observations will appear here.", "findings.html", "View findings")}
        </section>
        <section class="panel compact-panel activity-panel"><div class="panel-heading"><div><h2>Recent activity</h2><p>A record of workspace updates</p></div><span class="panel-icon">${U.icon("activity", 18)}</span></div>
          ${recentActivity.length ? `<div class="activity-list">${recentActivity.map((item) => `<div class="activity-row"><span class="activity-dot"></span><div><strong>${U.esc(item.action)}</strong><p>${U.esc(item.detail)}</p><small>${U.esc(item.user)} · ${U.shortDate(item.at)}</small></div></div>`).join("")}</div>` : `<div class="activity-empty">${U.icon("sparkles", 19)}<span>Workspace activity will appear here as records are updated.</span></div>`}
        </section>
      </div>`;
  }
  function empty(title, detail, href, label) { return `<div class="empty-state"><span>${U.icon("inbox", 20)}</span><strong>${U.esc(title)}</strong><p>${U.esc(detail)}</p><a class="button button-outline button-small" href="${href}">${U.esc(label)}</a></div>`; }
  window.JanAuditDashboard = { render };
})();
