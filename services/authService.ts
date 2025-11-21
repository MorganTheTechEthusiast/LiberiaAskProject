
import { User } from "../types";

const KEYS = {
  USERS: 'askliberia_users',
  CURRENT_USER: 'askliberia_current_user'
};

class AuthService {
  // Simulate delay for realistic feel for local auth, but fast for Google
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

  isAuthenticated(): boolean {
    return !!localStorage.getItem(KEYS.CURRENT_USER);
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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=002868&color=fff`
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  // Handle login from external provider (Google)
  async loginWithProvider(userData: { name: string; email: string; avatar?: string; id?: string }): Promise<User> {
    // No delay for provider login to make it feel snappy
    const users = this.getUsers();
    let user = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (!user) {
        // Create new user if they don't exist
        user = {
            id: userData.id || 'google_' + Date.now(),
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=002868&color=fff`,
            joinedAt: Date.now()
        };
        users.push(user);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } else {
        // FORCE update profile if data differs (Name or Picture changed on Google)
        let updated = false;
        
        if (userData.avatar && user.avatar !== userData.avatar) {
             user.avatar = userData.avatar;
             updated = true;
        }
        if (userData.name && user.name !== userData.name) {
             user.name = userData.name;
             updated = true;
        }

        if (updated) {
            const otherUsers = users.filter(u => u.id !== user!.id);
            localStorage.setItem(KEYS.USERS, JSON.stringify([...otherUsers, user]));
        }
    }

    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  // Fallback simulation for demo purposes (when API key is missing)
  async loginWithGoogleSimulation(): Promise<User> {
    await this.delay(1000);
    
    const randomNum = Math.floor(Math.random() * 1000);
    const googleUser: User = {
        id: 'google_sim_' + Date.now(),
        name: 'Liberian Visitor',
        email: `visitor${randomNum}@gmail.com`,
        joinedAt: Date.now(),
        // Use a generic placeholder image that looks like a Google profile
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };

    return this.loginWithProvider(googleUser);
  }

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export const authService = new AuthService();
