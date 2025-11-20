
import { SearchLog, ApiRequest, DonationLog, SponsoredItem, Language, User } from "../types";

// Keys for LocalStorage to simulate a database
const KEYS = {
  LOGS: 'askliberia_logs',
  API_REQUESTS: 'askliberia_api_requests',
  DONATIONS: 'askliberia_donations',
  SPONSORED: 'askliberia_sponsored',
  ADMIN_SESSION: 'askliberia_admin_session',
  USERS: 'askliberia_users' // Same key as AuthService
};

// Default Sponsored Data (Seed Data)
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
  },
  {
    id: '3',
    title: 'Boulevard Palace',
    description: 'Luxury stays in Sinkor. Book your business suite today.',
    imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070&auto=format&fit=crop',
    tag: 'SPONSORED',
    buttonText: 'View Rates'
  }
];

class AdminService {
  // --- Auth ---
  login(password: string): boolean {
    // In a real app, this would hit an API.
    // Demo Password: admin123
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

  // --- Analytics & Logs ---
  logSearch(query: string, location: string, language: Language) {
    const logs: SearchLog[] = this.getLogs();
    const newLog: SearchLog = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      location,
      language
    };
    // Keep only last 100 logs to prevent storage overflow in demo
    const updatedLogs = [newLog, ...logs].slice(0, 100); 
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updatedLogs));
  }

  getLogs(): SearchLog[] {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  // Get actual users from Auth storage
  getUsers(): User[] {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : [];
  }

  getStats() {
    const logs = this.getLogs();
    const requests = this.getApiRequests();
    const donations = this.getDonations();
    const users = this.getUsers();
    
    // Calculate total donation amount
    const totalDonations = donations.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return {
      totalSearches: logs.length,
      activeUsers: users.length, 
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      totalRevenue: totalDonations
    };
  }

  // --- API Requests ---
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
            apiKey: status === 'approved' ? `ask_lib_${Math.random().toString(36).substring(2, 12)}` : undefined 
        };
      }
      return req;
    });
    localStorage.setItem(KEYS.API_REQUESTS, JSON.stringify(updated));
  }

  // --- Donations ---
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

  // --- CMS (Sponsored Content) ---
  getSponsoredContent(): SponsoredItem[] {
    const data = localStorage.getItem(KEYS.SPONSORED);
    if (!data) {
      // Initialize with seed data if empty
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
