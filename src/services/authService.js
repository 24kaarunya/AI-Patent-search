const API_BASE = window.location.origin.includes("localhost:5173") ? "http://localhost:5000/api/auth" : "/api/auth";
const SESSION_KEY = "patent_assistant_session";

export const authService = {
  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed.");
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("auth-change"));
    return data.user;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed.");
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("auth-change"));
    return data.user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("auth-change"));
  },

  getCurrentUser() {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      return session.user || null;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr).token || null;
    } catch (e) {
      return null;
    }
  },

  async updateProfile(name, bio) {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized.");
    
    const res = await fetch(`${API_BASE}/profile/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, bio })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile.");
    
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      session.user = { ...session.user, name: data.user.name, bio: data.user.bio };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("auth-change"));
    }
    return data.user;
  },

  async getAllUsers() {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized.");
    
    const res = await fetch(`${API_BASE}/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users.");
    return data;
  },

  async updateUserRole(email, newRole) {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized.");
    
    const res = await fetch(`${API_BASE}/users/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email, role: newRole })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update role.");
    return true;
  },

  async updateUserStatus(email, newStatus) {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized.");
    
    const res = await fetch(`${API_BASE}/users/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email, status: newStatus })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update status.");
    return true;
  },

  async deleteUser(email) {
    const token = this.getToken();
    if (!token) throw new Error("Unauthorized.");
    
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete user.");
    return true;
  },

  async resetPassword(email, newPassword) {
    // Static mock reset helper
    return true;
  }
};
export default authService;
