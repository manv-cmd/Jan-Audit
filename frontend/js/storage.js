(function () {
  const keys = { users: "users", projects: "projects", findings: "findings", activity: "activity" };
  const villages = ["Rampur", "Shivpur", "Anandpur", "Lakshmipur", "Devgaon", "Rajpur"];
  const sampleProjects = [
    { id: "JA-2025-001", name: "Construction of village internal roads", description: "Upgrading 2.4 km of internal roads with durable all-weather paving and improved access to essential services.", village: "Rampur", block: "Sadar", district: "Prayagraj", budget: 4850000, startDate: "2025-02-10", expectedDate: "2025-11-30", status: "In Progress", sample: true, createdAt: "2025-02-05T09:00:00.000Z", updatedAt: "2025-10-28T10:20:00.000Z" },
    { id: "JA-2025-002", name: "Installation of solar street lights", description: "Installation of 48 solar-powered street lights at village roads, public spaces and key junctions.", village: "Shivpur", block: "Koraon", district: "Prayagraj", budget: 1280000, startDate: "2025-01-15", expectedDate: "2025-08-31", status: "Completed", sample: true, createdAt: "2025-01-10T09:00:00.000Z", updatedAt: "2025-09-04T11:00:00.000Z" },
    { id: "JA-2025-003", name: "Drinking water pipeline project", description: "Household water connections and a 3.2 km distribution pipeline to improve access to safe drinking water.", village: "Anandpur", block: "Phulpur", district: "Prayagraj", budget: 6720000, startDate: "2025-04-01", expectedDate: "2026-03-31", status: "In Progress", sample: true, createdAt: "2025-03-25T09:00:00.000Z", updatedAt: "2025-10-22T13:15:00.000Z" },
    { id: "JA-2025-004", name: "Renovation of primary health centre", description: "Repair of the outpatient wing, accessible washrooms, roofing and electrical systems at the local PHC.", village: "Lakshmipur", block: "Handia", district: "Prayagraj", budget: 3540000, startDate: "2025-06-01", expectedDate: "2026-01-31", status: "Pending", sample: true, createdAt: "2025-05-22T09:00:00.000Z", updatedAt: "2025-10-17T08:30:00.000Z" },
    { id: "JA-2025-005", name: "Construction of community sanitation facilities", description: "Construction of a community sanitation complex with separate facilities, water supply and accessible design.", village: "Devgaon", block: "Soraon", district: "Prayagraj", budget: 2190000, startDate: "2024-11-15", expectedDate: "2025-07-31", status: "Completed", sample: true, createdAt: "2024-11-04T09:00:00.000Z", updatedAt: "2025-08-12T10:00:00.000Z" },
    { id: "JA-2025-006", name: "Village drainage improvement", description: "Rehabilitation of 1.8 km of stormwater drains and construction of covered sections near the school.", village: "Rajpur", block: "Bahadurpur", district: "Prayagraj", budget: 2960000, startDate: "2025-03-01", expectedDate: "2025-12-15", status: "In Progress", sample: true, createdAt: "2025-02-20T09:00:00.000Z", updatedAt: "2025-10-30T09:45:00.000Z" }
  ];
  const sampleFindings = [
    { id: "AF-2025-001", projectId: "JA-2025-001", description: "Two stretches show uneven compaction compared with the approved specification. Recheck before final measurement.", auditor: "Ravi Kumar", date: "2025-10-28", severity: "Medium", sample: true, createdAt: "2025-10-28T10:30:00.000Z" },
    { id: "AF-2025-002", projectId: "JA-2025-003", description: "Three sampled household connections were not reflected in the site measurement register.", auditor: "Ravi Kumar", date: "2025-10-25", severity: "High", sample: true, createdAt: "2025-10-25T12:15:00.000Z" },
    { id: "AF-2025-003", projectId: "JA-2025-002", description: "One installed light is intermittently offline. Verify battery performance during the warranty inspection.", auditor: "Ananya Sharma", date: "2025-10-19", severity: "Low", sample: true, createdAt: "2025-10-19T09:45:00.000Z" },
    { id: "AF-2025-004", projectId: "JA-2025-006", description: "Provide updated site photographs and confirm the drain cover quantities against the bill of quantities.", auditor: "Ravi Kumar", date: "2025-10-15", severity: "Medium", sample: true, createdAt: "2025-10-15T11:25:00.000Z" }
  ];
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(JanAuditConfig.STORAGE_PREFIX + key);
      if (value === null) return fallback;
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("Stored data is not a list.");
      return parsed;
    } catch (error) {
      console.error("Could not read " + key + " from local storage.", error);
      throw new Error("Saved " + key + " data could not be loaded. Clear this site's demo data to reset it.");
    }
  }
  function write(key, value) {
    try { localStorage.setItem(JanAuditConfig.STORAGE_PREFIX + key, JSON.stringify(value)); }
    catch (error) { console.error("Could not save " + key + " to local storage.", error); throw new Error("Could not save changes. Check browser storage availability."); }
  }
  function id(prefix, collection) {
    const year = new Date().getFullYear();
    const used = collection.map((record) => Number((record.id.match(/(\d+)$/) || [])[1]) || 0);
    return prefix + "-" + year + "-" + String(Math.max(0, ...used) + 1).padStart(3, "0");
  }
  const repos = {
    users: {
      list: () => read(keys.users, window.JanAuditAuth.users),
      save(user) { const all = this.list(); const i = all.findIndex((entry) => entry.id === user.id); if (i < 0) all.push(user); else all[i] = user; write(keys.users, all); return user; }
    },
    projects: {
      list: () => read(keys.projects, null) || (write(keys.projects, sampleProjects), sampleProjects.slice()),
      get: (projectId) => repos.projects.list().find((project) => project.id === projectId) || null,
      create(data) { const all = this.list(); const project = { ...data, id: id("JA", all), sample: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; all.unshift(project); write(keys.projects, all); addActivity("Project created", project.name); return project; },
      update(projectId, data) { const all = this.list(); const index = all.findIndex((project) => project.id === projectId); if (index < 0) throw new Error("Project not found."); all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() }; write(keys.projects, all); addActivity("Project updated", all[index].name); return all[index]; },
      delete(projectId) { const all = this.list(); const project = all.find((entry) => entry.id === projectId); if (!project) throw new Error("Project not found."); if (repos.findings.list().some((finding) => finding.projectId === projectId)) throw new Error("This project has audit findings. Resolve or remove those findings before deleting the project."); write(keys.projects, all.filter((entry) => entry.id !== projectId)); addActivity("Project deleted", project.name); }
    },
    findings: {
      list: () => read(keys.findings, null) || (write(keys.findings, sampleFindings), sampleFindings.slice()),
      get: (findingId) => repos.findings.list().find((finding) => finding.id === findingId) || null,
      create(data) { if (!repos.projects.get(data.projectId)) throw new Error("Select an existing project for this finding."); const all = this.list(); const finding = { ...data, id: id("AF", all), sample: false, createdAt: new Date().toISOString() }; all.unshift(finding); write(keys.findings, all); addActivity("Audit finding recorded", finding.id); return finding; },
      delete(findingId) { const all = this.list(); const finding = all.find((entry) => entry.id === findingId); if (!finding) throw new Error("Finding not found."); write(keys.findings, all.filter((entry) => entry.id !== findingId)); addActivity("Audit finding removed", finding.id); }
    },
    activity: {
      list: () => read(keys.activity, []),
      clear() { write(keys.activity, []); }
    }
  };
  function addActivity(action, detail) {
    const user = window.JanAuditAuth.currentUser();
    const all = repos.activity.list();
    all.unshift({ id: "ACT-" + Date.now(), action, detail, user: user ? user.name : "Demo user", at: new Date().toISOString() });
    write(keys.activity, all.slice(0, 40));
  }
  window.JanAuditStorage = { ...repos, addActivity, villages, resetDemoData() { Object.values(keys).forEach((key) => localStorage.removeItem(JanAuditConfig.STORAGE_PREFIX + key)); location.reload(); } };
})();
