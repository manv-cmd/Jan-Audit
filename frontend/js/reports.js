(function () {
  const S = window.JanAuditStorage, U = new Proxy({}, { get: (_, property) => window.JanAuditUI[property] });
  let filters = { from: "", to: "", status: "" };
  function getData() {
    let projects = S.projects.list().filter((p) => (!filters.from || p.startDate >= filters.from) && (!filters.to || p.startDate <= filters.to) && (!filters.status || p.status === filters.status));
    const projectIds = new Set(projects.map((p) => p.id));
    const findings = S.findings.list().filter((f) => projectIds.has(f.projectId) && (!filters.from || f.date >= filters.from) && (!filters.to || f.date <= filters.to));
    return { projects, findings };
  }
  function render() {
    const { projects, findings } = getData();
    const budget = projects.reduce((total, project) => total + Number(project.budget || 0), 0);
    const complete = projects.filter((p) => p.status === "Completed").length;
    const villages = [...new Set(projects.map((p) => p.village))];
    setTimeout(() => JanAuditCharts.village("report-village-chart", projects), 0);
    const severity = ["High", "Medium", "Low"].map((level) => [level, findings.filter((f) => f.severity === level).length]);
    return `<section class="panel report-filter-panel"><div class="report-filter-copy">${U.icon("sliders-horizontal", 18)}<div><strong>Reporting period</strong><small>Filter projects by start date and findings by recorded date.</small></div></div><div class="report-filters"><label>From <input type="date" id="report-from" value="${U.esc(filters.from)}"></label><label>To <input type="date" id="report-to" value="${U.esc(filters.to)}"></label><label>Status <select id="report-status"><option value="">All statuses</option>${["Pending", "In Progress", "Completed"].map((s) => `<option ${filters.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><button class="button button-outline button-small" data-clear-reports>${U.icon("rotate-ccw", 15)} Reset</button></div></section><div class="report-print-area"><div class="report-heading"><div><p class="eyebrow">DISTRICT DEVELOPMENT WORKS · JAN AUDIT</p><h2>Project & audit summary</h2><p>Generated ${U.date(new Date().toISOString().slice(0, 10))} · ${projects.filter((p) => p.sample).length + findings.filter((f) => f.sample).length} sample records in this view</p></div><div class="report-actions"><button class="button button-outline" data-print>${U.icon("printer", 16)} Print report</button><button class="button button-primary" data-export>${U.icon("download", 16)} Export CSV</button></div></div><div class="report-kpi-grid"><article class="report-kpi"><span>${U.icon("indian-rupee", 17)} TOTAL SANCTIONED BUDGET</span><strong>${U.money(budget)}</strong><small>Across ${projects.length} filtered works</small></article><article class="report-kpi"><span>${U.icon("circle-check", 17)} COMPLETED WORKS</span><strong>${complete}</strong><small>${projects.length ? Math.round(complete / projects.length * 100) : 0}% completion rate</small></article><article class="report-kpi"><span>${U.icon("clock-3", 17)} IN-PROGRESS WORKS</span><strong>${projects.filter((p) => p.status === "In Progress").length}</strong><small>Currently underway</small></article><article class="report-kpi"><span>${U.icon("hourglass", 17)} PENDING WORKS</span><strong>${projects.filter((p) => p.status === "Pending").length}</strong><small>Awaiting commencement</small></article></div><div class="report-charts-grid"><section class="panel chart-panel report-chart-card"><div class="panel-heading"><div><h2>Village-wise distribution</h2><p>${villages.length} villages · ${projects.length} projects</p></div>${U.icon("map", 18)}</div><div class="bar-chart-wrap report-bar-chart"><canvas id="report-village-chart" aria-label="Filtered village-wise project distribution"></canvas></div></section><section class="panel report-breakdown"><div class="panel-heading"><div><h2>Audit findings summary</h2><p>Linked findings in the reporting period</p></div>${U.icon("clipboard-check", 18)}</div><div class="finding-total"><strong>${findings.length}</strong><span>total observations</span></div>${severity.map(([level, count]) => `<div class="severity-row"><span>${U.badge(level)}</span><div class="severity-track"><i class="${level.toLowerCase()}" style="width:${findings.length ? Math.round(count / findings.length * 100) : 0}%"></i></div><strong>${count}</strong></div>`).join("")}<div class="report-breakdown-foot">${U.icon("shield-check", 15)} Findings are linked to projects in the selected view.</div></section></div><section class="panel table-panel report-table-panel"><div class="panel-heading"><div><h2>Project completion statistics</h2><p>Filtered project register · ${projects.length} results</p></div><span class="demo-mini">SAMPLE RECORDS IDENTIFIED</span></div>${projects.length ? `<div class="table-wrap"><table><thead><tr><th>PROJECT</th><th>VILLAGE</th><th>BUDGET</th><th>START DATE</th><th>EXPECTED COMPLETION</th><th>STATUS</th></tr></thead><tbody>${projects.slice().sort((a, b) => a.village.localeCompare(b.village)).map((p) => `<tr><td><a class="project-name-link" href="project-details.html?id=${encodeURIComponent(p.id)}">${U.esc(p.name)}</a><small class="table-id">${U.esc(p.id)} ${p.sample ? '<span class="demo-mini">DEMO</span>' : ""}</small></td><td>${U.esc(p.village)}</td><td>${U.money(p.budget)}</td><td>${U.date(p.startDate)}</td><td>${U.date(p.expectedDate)}</td><td>${U.badge(p.status)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span>${U.icon("calendar-x", 20)}</span><strong>No projects in this reporting period</strong><p>Adjust your date or status filters.</p></div>`}</section></div>`;
  }
  function exportCsv() {
    const { projects, findings } = getData();
    const columns = ["Record type", "Record ID", "Project ID", "Project name", "Village", "Block", "District", "Sanctioned budget (INR)", "Start date", "Expected completion", "Status", "Finding description", "Auditor", "Finding date", "Severity", "Sample data"];
    const rows = projects.map((p) => ["Project", p.id, p.id, p.name, p.village, p.block, p.district, p.budget, p.startDate, p.expectedDate, p.status, "", "", "", "", p.sample ? "Yes" : "No"]);
    findings.forEach((f) => { const p = S.projects.get(f.projectId); if (p) rows.push(["Finding", f.id, p.id, p.name, p.village, p.block, p.district, p.budget, p.startDate, p.expectedDate, p.status, f.description, f.auditor, f.date, f.severity, f.sample ? "Yes" : "No"]); });
    const csv = [columns, ...rows].map((row) => row.map((field) => `"${String(field == null ? "" : field).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }), url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = "jan-audit-report-" + new Date().toISOString().slice(0, 10) + ".csv"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }
  function refresh() { document.getElementById("page-content").innerHTML = render(); if (window.lucide) lucide.createIcons(); }
  function bind() {
    const root = document.getElementById("app");
    root.addEventListener("change", (event) => {
      if (event.target.id === "report-from") filters.from = event.target.value;
      else if (event.target.id === "report-to") filters.to = event.target.value;
      else if (event.target.id === "report-status") filters.status = event.target.value;
      else return;
      if (filters.from && filters.to && filters.from > filters.to) { [filters.from, filters.to] = [filters.to, filters.from]; }
      refresh();
    });
    root.addEventListener("click", (event) => {
      if (event.target.closest("[data-export]")) exportCsv();
      if (event.target.closest("[data-print]")) window.print();
      if (event.target.closest("[data-clear-reports]")) { filters = { from: "", to: "", status: "" }; refresh(); }
    });
  }
  window.JanAuditReports = { render, bind, exportCsv, getData };
})();
