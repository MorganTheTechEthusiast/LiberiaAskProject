
import { User } from "../types";

const KEYS = {
  USERS: 'askliberia_users',
  CURRENT_USER: 'askliberia_current_user'
};

class AuthService {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getUsers(): User[] {
    const users = localStorage.getItem(KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    await this.delay(800); 
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: "Invalid email or password." };
  }

  async signup(name: string, email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    await this.delay(1000);
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "User with this email already exists." };
    }

    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        joinedAt: Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=002868&color=fff`,
        apiPlan: 'free',
        apiUsage: { used: 0, limit: 1000 }
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  async loginWithProvider(userData: { name: string; email: string; avatar?: string; id?: string }): Promise<User> {
    const users = this.getUsers();
    let user = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (!user) {
        user = {
            id: userData.id || 'google_' + Date.now(),
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=002868&color=fff`,
            joinedAt: Date.now(),
            apiPlan: 'free',
            apiUsage: { used: 0, limit: 1000 }
        };
        users.push(user);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  // Fix: Adding loginWithGoogleSimulation for development/demo mode to resolve AuthPage.tsx error
  async loginWithGoogleSimulation(): Promise<User> {
    await this.delay(1000);
    return this.loginWithProvider({
      name: "Demo User",
      email: "demo@example.com",
      avatar: "https://ui-avatars.com/api/?name=Demo+User&background=002868&color=fff",
      id: "sim_" + Date.now()
    });
  }

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export const authService = new AuthService();
