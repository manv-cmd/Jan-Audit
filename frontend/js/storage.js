(function () {
  const keys = { users: "users", projects: "projects", findings: "findings", activity: "activity" };
  const villages = ["Rampur", "Shivpur", "Anandpur", "Lakshmipur", "Devgaon", "Rajpur"];
  const sampleProjects = [
    { id: "JA-2025-001", name: "Construction of village internal roads", description: "Upgrading 2.4 km of internal roads with durable all-weather paving and improved access to essential services.", village: "Rampur", block: "Sadar", district: "Prayagraj", budget: 4850000, startDate: "2025-02-10", expectedDate: "2025-11-30", status: "In Progress", sample: true, createdAt: "2025-02-05T09:00:00.000Z", updatedAt: "2025-10-28T10:20:00.000Z" },
    { id: "JA-2025-002", name: "Installation of solar street lights", description: "Installation of 48 solar-powered street lights at village roads, public spaces and key junctions.", village: "Shivpur", block: "Koraon", district: "Prayagraj", budget: 1280000, startDate: "2025-01-15", expectedDate: "2025-08-31", status: "Completed", sample: true, createdAt: "2025-01-10T09:00:00.000Z", updatedAt: "2025-09-04T11:00:00.000Z" },
    { id: "JA-2025-003", name: "Drinking water pipeline project", description: "Household water connections and a 3.2 km distribution pipeline to improve access to safe drinking water.", village: "Anandpur", block: "Phulpur", district: "Prayagraj", budget: 6720000, startDate: "2025-04-01", expectedDate: "2026-03-31", status: "In Progress", sample: true, createdAt: "2025-03-25T09:00:00.000Z", updatedAt: "2025-10-22T13:15:00.000Z" },
    { id: "JA-2025-004", name: "Renovation of primary health centre", description: "Repair of the outpatient wing, accessible washrooms, roofing and electrical systems at the local PHC.", village: "Lakshmipur", block: "Handia", district: "Prayagraj", budget: 3540000, startDate: "2025-06-01", expectedDate: "2026-01-31", status: "Pending", sample: true, createdAt: "2025-05-22T09:00:00.000Z", updatedAt: "2025-10-17T08:30:00.000Z" },
    { id: "JA-2025-005", name: "Construction of community sanitation facilities", description: "Construction of a community sanitation complex with separate facilities, water supply and accessible design.", village: "Devgaon", block: "Soraon", district: "Prayagraj", budget: 2190000, startDate: "2024-11-15", expectedDate: "2025-07-31", status: "Completed", sample: true, createdAt: "2024-11-04T09:00:00.000Z", updatedAt: "2025-08-12T10:00:00.000Z" },
    { id: "JA-2025-006", name: "Village drainage improvement", description: "Rehabilitation of 1.8 km of stormwater drains and construction of covered sections near the school.", village: "Rajpur", block: "Bahadurpur", district: "Prayagraj", budget: 2960000, startDate: "2025-03-01", expectedDate: "2025-12-15", status: "In Progress", sample: true, createdAt: "2025-02-20T09:00:00.000Z", updatedAt: "2025-10-30T09:45:00.000Z" },
    { id: "JA-2025-007", name: "Rainwater harvesting pond and groundwater recharge unit", description: "Excavation and revetment lining of a 0.8-hectare percolation pond with silt traps to recharge local aquifers and prevent seasonal waterlogging.", village: "Shivpur", block: "Koraon", district: "Prayagraj", budget: 1840000, startDate: "2025-05-10", expectedDate: "2025-12-20", status: "Completed", sample: true, createdAt: "2025-05-02T08:30:00.000Z", updatedAt: "2025-12-18T14:10:00.000Z" },
    { id: "JA-2025-008", name: "Upgradation of Anganwadi centre with child-friendly amenities", description: "Construction of a dedicated nutrition kitchen shed, child-friendly learning walls, clean drinking water filtration, and solar rooftop electrification.", village: "Rampur", block: "Sadar", district: "Prayagraj", budget: 1420000, startDate: "2025-07-01", expectedDate: "2026-02-28", status: "In Progress", sample: true, createdAt: "2025-06-25T09:15:00.000Z", updatedAt: "2025-11-04T11:20:00.000Z" },
    { id: "JA-2025-009", name: "Multi-purpose community flood & cyclone shelter", description: "Reinforced two-storey public shelter equipped with raised plinth, solar micro-grid backup, rainwater cisterns, and separate sanitation blocks for disaster resilience.", village: "Rajpur", block: "Bahadurpur", district: "Prayagraj", budget: 8250000, startDate: "2025-08-15", expectedDate: "2026-06-30", status: "Pending", sample: true, createdAt: "2025-08-01T10:00:00.000Z", updatedAt: "2025-08-15T09:00:00.000Z" },
    { id: "JA-2025-010", name: "Panchayat digital service kiosk and library", description: "Setting up a high-speed fiber-connected citizen service centre with 8 public computer terminals, biometric authentication desks, and a community reading hall.", village: "Anandpur", block: "Phulpur", district: "Prayagraj", budget: 2480000, startDate: "2025-06-12", expectedDate: "2026-01-15", status: "In Progress", sample: true, createdAt: "2025-06-05T11:30:00.000Z", updatedAt: "2025-11-08T15:40:00.000Z" },
    { id: "JA-2025-011", name: "Solid waste segregation shed and vermicomposting pits", description: "Establishment of a village-level resource recovery centre with dry/wet waste segregation bays and 6 active vermicomposting beds for organic waste processing.", village: "Lakshmipur", block: "Handia", district: "Prayagraj", budget: 1690000, startDate: "2025-04-18", expectedDate: "2025-10-31", status: "Completed", sample: true, createdAt: "2025-04-10T09:00:00.000Z", updatedAt: "2025-11-12T10:20:00.000Z" },
    { id: "JA-2025-012", name: "Veterinary dispensary and livestock care facility", description: "Civil construction of a dedicated animal treatment bay, solar cold-chain storage for veterinary vaccines, and diagnostic facility for rural cattle breeders.", village: "Devgaon", block: "Soraon", district: "Prayagraj", budget: 3160000, startDate: "2025-09-01", expectedDate: "2026-05-15", status: "Pending", sample: true, createdAt: "2025-08-20T08:00:00.000Z", updatedAt: "2025-09-01T09:00:00.000Z" }
  ];
  const sampleFindings = [
    { id: "AF-2025-001", projectId: "JA-2025-001", description: "Two stretches show uneven compaction compared with the approved specification. Recheck before final measurement.", auditor: "Ravi Kumar", date: "2025-10-28", severity: "Medium", sample: true, createdAt: "2025-10-28T10:30:00.000Z" },
    { id: "AF-2025-002", projectId: "JA-2025-003", description: "Three sampled household connections were not reflected in the site measurement register.", auditor: "Ravi Kumar", date: "2025-10-25", severity: "High", sample: true, createdAt: "2025-10-25T12:15:00.000Z" },
    { id: "AF-2025-003", projectId: "JA-2025-002", description: "One installed light is intermittently offline. Verify battery performance during the warranty inspection.", auditor: "Ananya Sharma", date: "2025-10-19", severity: "Low", sample: true, createdAt: "2025-10-19T09:45:00.000Z" },
    { id: "AF-2025-004", projectId: "JA-2025-006", description: "Provide updated site photographs and confirm the drain cover quantities against the bill of quantities.", auditor: "Ravi Kumar", date: "2025-10-15", severity: "Medium", sample: true, createdAt: "2025-10-15T11:25:00.000Z" },
    { id: "AF-2025-005", projectId: "JA-2025-008", description: "Water filtration unit delivered to site does not match the BIS-certified model specified in the technical tender. Installation halted pending verification.", auditor: "Ananya Sharma", date: "2025-11-04", severity: "High", sample: true, createdAt: "2025-11-04T10:00:00.000Z" },
    { id: "AF-2025-006", projectId: "JA-2025-010", description: "Earthing pit resistance measured higher than permissible limit for electronic equipment. Re-grounding required before connecting UPS backup.", auditor: "Ravi Kumar", date: "2025-11-08", severity: "Medium", sample: true, createdAt: "2025-11-08T11:30:00.000Z" },
    { id: "AF-2025-007", projectId: "JA-2025-011", description: "Shed roof overhang requires additional wind bracing along the south-western face to conform with seasonal wind load guidelines.", auditor: "Ravi Kumar", date: "2025-11-12", severity: "Low", sample: true, createdAt: "2025-11-12T09:15:00.000Z" }
  ];

    function mergeDefaults(key, defaults) {
    const stored = read(key, null);
    if (!stored || !Array.isArray(stored)) {
      write(key, defaults);
      return defaults.slice();
    }
    const ids = new Set(stored.map((item) => item.id));
    const missing = defaults.filter((item) => !ids.has(item.id));
    if (missing.length > 0) {
      const merged = [...stored, ...missing];
      write(key, merged);
      return merged;
    }
    return stored;
  }
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(JanAuditConfig.STORAGE_PREFIX + key);
      if (value === null) return fallback;
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("Stored data is not a list.");
      return parsed;
    } catch (error) {
      console.error("Could not read " + key + " from local storage.", error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(JanAuditConfig.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save " + key + " to local storage.", error);
    }
  }

  function id(prefix, collection) {
    const year = new Date().getFullYear();
    const used = collection.map((record) => Number((record.id && (record.id.match(/(\d+)$/) || []))[1]) || 0);
    return prefix + "-" + year + "-" + String(Math.max(0, ...used) + 1).padStart(3, "0");
  }

  // Two-way sync with the Backend API (persists in SQLite jan_audit.db)
  async function syncFromApi() {
    if (!window.JanAuditApi || (window.JanAuditConfig && window.JanAuditConfig.DATA_MODE !== "api")) return false;
    const token = localStorage.getItem("jan-audit:access-token");
    if (!token) return false;

    let updated = false;
    try {
      const [apiProjects, apiFindings] = await Promise.all([
        window.JanAuditApi.get("/projects").catch(() => null),
        window.JanAuditApi.get("/findings").catch(() => null)
      ]);
      if (Array.isArray(apiProjects) && apiProjects.length) {
        write(keys.projects, apiProjects);
        updated = true;
      }
      if (Array.isArray(apiFindings) && apiFindings.length) {
        write(keys.findings, apiFindings);
        updated = true;
      }
    } catch (e) {
      console.warn("Backend API not reachable for sync; continuing with local storage cache:", e);
    }
    return updated;
  }

  const repos = {
    users: {
      list: () => read(keys.users, (window.JanAuditAuth && window.JanAuditAuth.users) || []),
      save(user) {
        const all = this.list();
        const i = all.findIndex((entry) => entry.id === user.id);
        if (i < 0) all.push(user); else all[i] = user;
        write(keys.users, all);
        return user;
      }
    },
    projects: {
      list: () => mergeDefaults(keys.projects, sampleProjects),
      get: (projectId) => repos.projects.list().find((project) => project.id === projectId) || null,
      async create(data) {
        let project = null;
        if (window.JanAuditApi && (!window.JanAuditConfig || window.JanAuditConfig.DATA_MODE === "api") && localStorage.getItem("jan-audit:access-token")) {
          try {
            project = await window.JanAuditApi.post("/projects", data);
          } catch (e) {
            console.warn("API create failed, falling back to local storage:", e);
          }
        }
        const all = this.list();
        if (!project) {
          project = { ...data, id: id("JA", all), sample: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        }
        const next = all.filter((p) => p.id !== project.id);
        next.unshift(project);
        write(keys.projects, next);
        addActivity("Project created", project.name);
        return project;
      },
      async update(projectId, data) {
        let updated = null;
        if (window.JanAuditApi && (!window.JanAuditConfig || window.JanAuditConfig.DATA_MODE === "api") && localStorage.getItem("jan-audit:access-token")) {
          try {
            updated = await window.JanAuditApi.put("/projects/" + encodeURIComponent(projectId), data);
          } catch (e) {
            console.warn("API update failed, falling back to local storage:", e);
          }
        }
        const all = this.list();
        const index = all.findIndex((project) => project.id === projectId);
        if (index < 0) throw new Error("Project not found.");
        all[index] = updated || { ...all[index], ...data, updatedAt: new Date().toISOString() };
        write(keys.projects, all);
        addActivity("Project updated", all[index].name);
        return all[index];
      },
      async delete(projectId) {
        const all = this.list();
        const project = all.find((entry) => entry.id === projectId);
        if (!project) throw new Error("Project not found.");
        if (repos.findings.list().some((finding) => finding.projectId === projectId)) {
          throw new Error("This project has audit findings. Resolve or remove those findings before deleting the project.");
        }
        if (window.JanAuditApi && (!window.JanAuditConfig || window.JanAuditConfig.DATA_MODE === "api") && localStorage.getItem("jan-audit:access-token")) {
          try {
            await window.JanAuditApi.delete("/projects/" + encodeURIComponent(projectId));
          } catch (e) {
            console.warn("API delete failed:", e);
          }
        }
        write(keys.projects, all.filter((entry) => entry.id !== projectId));
        addActivity("Project deleted", project.name);
      }
    },
    findings: {
      list: () => mergeDefaults(keys.findings, sampleFindings),
      get: (findingId) => repos.findings.list().find((finding) => finding.id === findingId) || null,
      async create(data) {
        if (!repos.projects.get(data.projectId)) throw new Error("Select an existing project for this finding.");
        let finding = null;
        if (window.JanAuditApi && (!window.JanAuditConfig || window.JanAuditConfig.DATA_MODE === "api") && localStorage.getItem("jan-audit:access-token")) {
          try {
            finding = await window.JanAuditApi.post("/findings", data);
          } catch (e) {
            console.warn("API create finding failed, falling back to local storage:", e);
          }
        }
        const all = this.list();
        if (!finding) {
          finding = { ...data, id: id("AF", all), sample: false, createdAt: new Date().toISOString() };
        }
        const next = all.filter((f) => f.id !== finding.id);
        next.unshift(finding);
        write(keys.findings, next);
        addActivity("Audit finding recorded", finding.id);
        return finding;
      },
      async delete(findingId) {
        const all = this.list();
        const finding = all.find((entry) => entry.id === findingId);
        if (!finding) throw new Error("Finding not found.");
        if (window.JanAuditApi && (!window.JanAuditConfig || window.JanAuditConfig.DATA_MODE === "api") && localStorage.getItem("jan-audit:access-token")) {
          try {
            await window.JanAuditApi.delete("/findings/" + encodeURIComponent(findingId));
          } catch (e) {
            console.warn("API delete finding failed:", e);
          }
        }
        write(keys.findings, all.filter((entry) => entry.id !== findingId));
        addActivity("Audit finding removed", finding.id);
      }
    },
    activity: {
      list: () => read(keys.activity, []),
      clear() { write(keys.activity, []); }
    }
  };

  function addActivity(action, detail) {
    const user = window.JanAuditAuth && window.JanAuditAuth.currentUser();
    const all = repos.activity.list();
    all.unshift({ id: "ACT-" + Date.now(), action, detail, user: user ? user.name : "Demo user", at: new Date().toISOString() });
    write(keys.activity, all.slice(0, 40));
  }

  window.JanAuditStorage = {
    ...repos,
    addActivity,
    villages,
    syncFromApi,
    resetDemoData() {
      Object.values(keys).forEach((key) => localStorage.removeItem(JanAuditConfig.STORAGE_PREFIX + key));
      location.reload();
    }
  };
})();
