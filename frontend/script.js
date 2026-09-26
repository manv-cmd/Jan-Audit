let projects = [];
let findings = [];

async function loadDashboard() {
  if (!isLoggedIn()) {
    document.getElementById("projectList").innerHTML =
      "<p>Please login to access protected project data.</p>";
    return;
  }

  try {
    [projects, findings] = await Promise.all([
      apiRequest("/projects"),
      apiRequest("/findings")
    ]);

    document.getElementById("total").textContent = projects.length;
    document.getElementById("completed").textContent =
      projects.filter(p => p.status === "Completed").length;
    document.getElementById("pending").textContent =
      projects.filter(p => p.status === "Audit Pending").length;
    document.getElementById("findingCount").textContent = findings.length;

    renderProjects();
    renderFindings();
  } catch (error) {
    document.getElementById("projectList").innerHTML =
      `<p>${escapeHtml(error.message)}</p>`;
  }
}

function renderProjects() {
  const query = document.getElementById("search").value.toLowerCase();
  const selectedStatus = document.getElementById("statusFilter").value;

  const filtered = projects.filter(project => {
    const text = `${project.name} ${project.village}`.toLowerCase();
    return text.includes(query) &&
      (!selectedStatus || project.status === selectedStatus);
  });

  document.getElementById("projectList").innerHTML = filtered.map(project => `
    <article class="project">
      <h3>${escapeHtml(project.name)}</h3>
      <p>Village: ${escapeHtml(project.village)}</p>
      <p>Budget: ₹${Number(project.budget).toLocaleString("en-IN")}</p>
      <span class="badge ${statusClass(project.status)}">
        ${escapeHtml(project.status)}
      </span>
      <div class="actions">
        <button onclick="viewProject(${project.id})">Details</button>
        <button class="edit" onclick="editProject(${project.id})">Edit</button>
        <button class="delete" onclick="deleteProject(${project.id})">Delete</button>
      </div>
    </article>
  `).join("") || "<p>No projects found.</p>";
}

function statusClass(status) {
  if (status === "Completed") return "completed";
  if (status === "In Progress") return "progress";
  return "pending";
}

async function addProject(event) {
  event.preventDefault();
  try {
    await apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value.trim(),
        village: document.getElementById("village").value.trim(),
        budget: Number(document.getElementById("budget").value),
        status: document.getElementById("status").value
      })
    });

    event.target.reset();
    document.getElementById("message").textContent = "Project added successfully.";
    await loadDashboard();
  } catch (error) {
    document.getElementById("message").textContent = error.message;
  }
}

async function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  try {
    await apiRequest(`/projects/${id}`, {method: "DELETE"});
    await loadDashboard();
  } catch (error) {
    alert(error.message);
  }
}

async function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const name = prompt("Project name:", project.name);
  const village = prompt("Village:", project.village);
  const budget = prompt("Budget:", project.budget);
  const status = prompt("Status:", project.status);

  if ([name, village, budget, status].some(value => value === null)) return;

  try {
    await apiRequest(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        village,
        budget: Number(budget),
        status
      })
    });
    await loadDashboard();
  } catch (error) {
    alert(error.message);
  }
}

async function viewProject(id) {
  try {
    const project = await apiRequest(`/projects/${id}`);
    alert(
      `Project: ${project.name}\n` +
      `Village: ${project.village}\n` +
      `Budget: ₹${project.budget}\n` +
      `Status: ${project.status}`
    );
  } catch (error) {
    alert(error.message);
  }
}

async function addFinding(event) {
  event.preventDefault();
  try {
    await apiRequest("/findings", {
      method: "POST",
      body: JSON.stringify({
        description: document.getElementById("findingText").value.trim(),
        project_name: document.getElementById("findingProject").value.trim()
      })
    });
    event.target.reset();
    await loadDashboard();
  } catch (error) {
    alert(error.message);
  }
}

function renderFindings() {
  document.getElementById("findingList").innerHTML = findings.map(finding => `
    <div class="finding">
      <b>${escapeHtml(finding.description)}</b>
      <span>${escapeHtml(finding.project_name)}</span>
      <small>${new Date(finding.created_at).toLocaleString()}</small>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

document.getElementById("projectForm").addEventListener("submit", addProject);
document.getElementById("findingForm").addEventListener("submit", addFinding);

if (isLoggedIn()) {
  loadDashboard();
} else {
  document.getElementById("projectList").innerHTML =
    "<p>Please login to access protected project data.</p>";
}
