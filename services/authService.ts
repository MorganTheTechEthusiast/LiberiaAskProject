
import { User } from "../types";

const KEYS = {
  USERS: 'askliberia_users',
  CURRENT_USER: 'askliberia_current_user'
};

class AuthService {
  // Simulate delay for realistic feel
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
    await this.delay(800); // Fake network delay

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // For this mock, we aren't actually hashing passwords, just checking if user exists.
    // In a real app, we would use bcrypt and proper backend validation.
    if (user) {
        // Simulate password check (accept any password for demo if user exists, 
        // or you could store passwords in localstorage but that is insecure even for demo)
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
        // Generate a simple avatar based on initials
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=002868&color=fff`
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  async loginWithGoogle(): Promise<User> {
    await this.delay(1500);
    // Simulate a Google User
    const googleUser: User = {
        id: 'google_' + Date.now(),
        name: 'Liberian Visitor',
        email: `visitor${Math.floor(Math.random() * 1000)}@gmail.com`,
        joinedAt: Date.now(),
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };

    const users = this.getUsers();
    // Check if this fake google user exists (based on email logic, simplified here)
    users.push(googleUser); 
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(googleUser));
    
    return googleUser;
  }

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export const authService = new AuthService();
