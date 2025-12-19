
import { SearchLog, ApiRequest, DonationLog, SponsoredItem, Language, User, ApiPlan } from "../types";

const KEYS = {
  LOGS: 'askliberia_logs',
  API_REQUESTS: 'askliberia_api_requests',
  DONATIONS: 'askliberia_donations',
  SPONSORED: 'askliberia_sponsored',
  ADMIN_SESSION: 'askliberia_admin_session',
  USERS: 'askliberia_users',
  CURRENT_USER: 'askliberia_current_user'
};

const DEFAULT_SPONSORED: SponsoredItem[] = [
  {
    id: '1',
    title: 'Explore Kpatawee',
    description: 'The "Wonder of Bong" awaits. Official guide by the Ministry of Tourism.',
    imageUrl: 'https://images.unsplash.com/photo-1518182170546-0766bb6f5656?q=80&w=2070&auto=format&fit=crop',
    tag: 'TOURISM',
    buttonText: 'Plan Trip'
  },
  {
    id: '2',
    title: 'University of Liberia',
    description: '2025 Admissions Open. Join the Department of Digital Arts & Sciences.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    tag: 'EDUCATION',
    buttonText: 'Apply Now'
  }
];

class AdminService {
  login(password: string): boolean {
    if (password === 'admin123') {
      localStorage.setItem(KEYS.ADMIN_SESSION, 'true');
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(KEYS.ADMIN_SESSION) === 'true';
  }

  logout() {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
  }

  logSearch(query: string, location: string, language: Language) {
    const logs = this.getLogs();
    const newLog: SearchLog = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      location,
      language
    };
    localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 100)));
    
    // Simulate API Usage increment for the current user if they have a key
    const currentUserStr = localStorage.getItem(KEYS.CURRENT_USER);
    if (currentUserStr) {
      const user: User = JSON.parse(currentUserStr);
      if (user.apiKey) {
        user.apiUsage.used += 1;
        this.updateUserRecord(user);
      }
    }
  }

  private updateUserRecord(user: User) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    const users = this.getUsers();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
  }

  generateKey() {
    return `ask_lib_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`;
  }

  async rotateApiKey(userId: string): Promise<string> {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    
    const newKey = this.generateKey();
    user.apiKey = newKey;
    this.updateUserRecord(user);
    return newKey;
  }

  async upgradePlan(userId: string, plan: ApiPlan): Promise<void> {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    user.apiPlan = plan;
    user.apiUsage.limit = plan === 'pro' ? 50000 : plan === 'free' ? 1000 : 9999999;
    if (!user.apiKey) user.apiKey = this.generateKey();
    
    this.updateUserRecord(user);
  }

  getLogs(): SearchLog[] {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  getStats() {
    const logs = this.getLogs();
    const requests = this.getApiRequests();
    const donations = this.getDonations();
    const users = this.getUsers();
    return {
      totalSearches: logs.length,
      activeUsers: users.length, 
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      totalRevenue: donations.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
    };
  }

  submitApiRequest(data: Omit<ApiRequest, 'id' | 'status' | 'timestamp'>) {
    const requests = this.getApiRequests();
    const newReq: ApiRequest = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: Date.now()
    };
    localStorage.setItem(KEYS.API_REQUESTS, JSON.stringify([newReq, ...requests]));
    return newReq;
  }

  getApiRequests(): ApiRequest[] {
    const data = localStorage.getItem(KEYS.API_REQUESTS);
    return data ? JSON.parse(data) : [];
  }

  updateApiRequestStatus(id: string, status: 'approved' | 'rejected') {
    const requests = this.getApiRequests();
    const updated = requests.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          status, 
          apiKey: status === 'approved' ? this.generateKey() : undefined 
        };
      }
      return req;
    });
    localStorage.setItem(KEYS.API_REQUESTS, JSON.stringify(updated));
  }

  logDonation(amount: string, method: 'local' | 'international') {
    const donations = this.getDonations();
    const newDonation: DonationLog = {
      id: Date.now().toString(),
      amount,
      method,
      timestamp: Date.now(),
      status: 'completed'
    };
    localStorage.setItem(KEYS.DONATIONS, JSON.stringify([newDonation, ...donations]));
  }

  getDonations(): DonationLog[] {
    const data = localStorage.getItem(KEYS.DONATIONS);
    return data ? JSON.parse(data) : [];
  }

  getSponsoredContent(): SponsoredItem[] {
    const data = localStorage.getItem(KEYS.SPONSORED);
    if (!data) {
      localStorage.setItem(KEYS.SPONSORED, JSON.stringify(DEFAULT_SPONSORED));
      return DEFAULT_SPONSORED;
    }
    return JSON.parse(data);
  }

  addSponsoredItem(item: Omit<SponsoredItem, 'id'>) {
    const items = this.getSponsoredContent();
    const newItem = { ...item, id: Date.now().toString() };
    localStorage.setItem(KEYS.SPONSORED, JSON.stringify([newItem, ...items]));
  }

  deleteSponsoredItem(id: string) {
    const items = this.getSponsoredContent();
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(KEYS.SPONSORED, JSON.stringify(filtered));
  }
}

export const adminService = new AdminService();
