const api = {
  // Filaments
  async getFilaments() {
    const res = await fetch("/api/filaments");
    return res.json();
  },

  async createFilament(data) {
    const res = await fetch("/api/filaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateFilament(id, data) {
    const res = await fetch(`/api/filaments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteFilament(id) {
    const res = await fetch(`/api/filaments/${id}`, { method: "DELETE" });
    return res.json();
  },

  // Print Logs
  async getLogs() {
    const res = await fetch("/api/logs");
    return res.json();
  },

  async createLog(data) {
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteLog(id) {
    const res = await fetch(`/api/logs/${id}`, { method: "DELETE" });
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch("/api/stats");
    return res.json();
  },
};

export default api;
