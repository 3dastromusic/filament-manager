async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const api = {
  // Auth
  async signup(username, password, email, displayName) {
    return jsonFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password, email, display_name: displayName }),
    });
  },
  async login(username, password) {
    return jsonFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  async logout() {
    return jsonFetch("/api/auth/logout", { method: "POST" });
  },
  async me() {
    return jsonFetch("/api/auth/me");
  },

  // Filaments
  async getFilaments() { return jsonFetch("/api/filaments"); },
  async createFilament(data) {
    return jsonFetch("/api/filaments", { method: "POST", body: JSON.stringify(data) });
  },
  async updateFilament(id, data) {
    return jsonFetch(`/api/filaments/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  async deleteFilament(id) {
    return jsonFetch(`/api/filaments/${id}`, { method: "DELETE" });
  },

  // Print Logs
  async getLogs() { return jsonFetch("/api/logs"); },
  async createLog(data) {
    return jsonFetch("/api/logs", { method: "POST", body: JSON.stringify(data) });
  },
  async deleteLog(id) {
    return jsonFetch(`/api/logs/${id}`, { method: "DELETE" });
  },

  // Stats
  async getStats() { return jsonFetch("/api/stats"); },

  // Admin
  async getUsers() { return jsonFetch("/api/admin/users"); },
  async deleteUser(id) {
    return jsonFetch(`/api/admin/users/${id}`, { method: "DELETE" });
  },
  async setUserAdmin(id, isAdmin) {
    return jsonFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_admin: isAdmin }),
    });
  },
  async resetUserPassword(id, password) {
    return jsonFetch(`/api/admin/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
};

export default api;
