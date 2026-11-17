(function () {
  const activeCharts = {};
  function draw(canvasId, config) {
    const node = document.getElementById(canvasId);
    if (!node || !window.Chart) return;
    if (activeCharts[canvasId]) activeCharts[canvasId].destroy();
    activeCharts[canvasId] = new Chart(node, { ...config, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, ...config.options?.plugins }, ...config.options } });
  }
  function status(canvasId, projects) {
    const counts = ["Completed", "In Progress", "Pending"].map((status) => projects.filter((project) => project.status === status).length);
    draw(canvasId, { type: "doughnut", data: { labels: ["Completed", "In progress", "Pending"], datasets: [{ data: counts, backgroundColor: ["#16a34a", "#2563eb", "#e7a008"], borderWidth: 0, hoverOffset: 6 }] }, options: { cutout: "76%", plugins: { tooltip: { callbacks: { label: (ctx) => " " + ctx.label + ": " + ctx.raw } } } } });
  }
  function village(canvasId, projects) {
    const villages = [...new Set(projects.map((project) => project.village))];
    draw(canvasId, { type: "bar", data: { labels: villages, datasets: [{ label: "Projects", data: villages.map((village) => projects.filter((project) => project.village === village).length), backgroundColor: "#4c7df0", borderRadius: 5, maxBarThickness: 26 }] }, options: { scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#718096", font: { family: "Inter, sans-serif", size: 11 } } }, y: { beginAtZero: true, ticks: { stepSize: 1, color: "#718096", precision: 0 }, grid: { color: "#edf0f5" }, border: { display: false } } }, plugins: { tooltip: { displayColors: false } } } });
  }
  window.JanAuditCharts = { status, village };
})();
