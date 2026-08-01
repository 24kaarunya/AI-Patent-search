// Simple key for storing user lists and active sessions
const USERS_KEY = "patent_assistant_users";
const SESSION_KEY = "patent_assistant_session";

// Base64 encoding mock for password hash
function mockHash(password) {
  return btoa(password.split("").reverse().join(""));
}

/**
 * Initialize default credentials in localStorage
 */
export function initAuthDatabase() {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers = [
      {
        email: "admin@patentai.com",
        passwordHash: mockHash("Admin@123"),
        name: "Director Alexander",
        role: "Admin",
        created: new Date("2026-01-10").toISOString(),
        bio: "Principal patent compliance administrator."
      },
      {
        email: "user@patentai.com",
        passwordHash: mockHash("User@1234"),
        name: "Dr. Jane Doe",
        role: "User",
        created: new Date("2026-02-15").toISOString(),
        bio: "Senior IoT & Embedded Systems researcher."
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

export const authService = {
  register(name, email, password) {
    initAuthDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("A user with this email address already exists.");
    }
    
    const newUser = {
      email: email.toLowerCase(),
      passwordHash: mockHash(password),
      name,
      role: "User", // default role
      created: new Date().toISOString(),
      bio: "R&D Inventor"
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return this.login(email, password);
  },

  login(email, password) {
    initAuthDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    
    if (user.passwordHash !== mockHash(password)) {
      throw new Error("Invalid email or password.");
    }
    
    // Simulate JWT Generation (mock token contains basic info signed in base64)
    const tokenPayload = {
      email: user.email,
      role: user.role,
      exp: Date.now() + 2 * 60 * 60 * 1000 // 2 hour expiration
    };
    const mockToken = btoa(JSON.stringify(tokenPayload));
    
    const session = {
      token: mockToken,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        created: user.created
      }
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Dispatch custom storage event for header status refreshes
    window.dispatchEvent(new Event("auth-change"));
    return session.user;
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
      // Validate mock JWT token expiration
      const payload = JSON.parse(atob(session.token));
      if (payload.exp < Date.now()) {
        this.logout();
        return null;
      }
      return session.user;
    } catch (e) {
      this.logout();
      return null;
    }
  },

  resetPassword(email, newPassword) {
    initAuthDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIdx === -1) {
      throw new Error("No account associated with this email address was found.");
    }
    
    users[userIdx].passwordHash = mockHash(newPassword);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  updateProfile(name, bio) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized access.");
    
    initAuthDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    
    if (userIdx !== -1) {
      users[userIdx].name = name;
      users[userIdx].bio = bio;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update session storage
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      session.user.name = name;
      session.user.bio = bio;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("auth-change"));
    }
    
    return this.getCurrentUser();
  },

  getAllUsers() {
    initAuthDatabase();
    return JSON.parse(localStorage.getItem(USERS_KEY)).map(u => ({
      email: u.email,
      name: u.name,
      role: u.role,
      created: u.created,
      bio: u.bio
    }));
  },

  updateUserRole(email, newRole) {
    initAuthDatabase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIdx === -1) throw new Error("User not found.");
    
    users[userIdx].role = newRole;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // If updating own role, sync session
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      session.user.role = newRole;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("auth-change"));
    }
    
    return true;
  }
};
