import { Injectable, signal } from '@angular/core';
import { api, getApiErrorMessage, TOKEN_STORAGE_KEY } from './api.service';

export type UserRole = 'admin' | 'operator';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  role: string;
}

const USERNAME_KEY = 'dunelect_username';
const ROLE_KEY = 'dunelect_role';

function readJwtExpMs(token: string): number | null {
  try {
    const part = token.split('.')[1];
    if (!part) {
      return null;
    }
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedIn = signal(false);
  private readonly roleWritable = signal<UserRole | null>(null);

  readonly role = this.roleWritable.asReadonly();

  constructor() {
    this.hydrateFromStorage();
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token || !this.isTokenValid(token)) {
      if (this.loggedIn()) {
        this.clearSessionLocal();
      }
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    return this.roleWritable() === 'admin';
  }

  getRole(): UserRole | null {
    return this.roleWritable();
  }

  getUsername(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  async signIn(role: UserRole, username: string, password: string): Promise<void> {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
        role,
      });
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      sessionStorage.setItem(USERNAME_KEY, data.username);
      sessionStorage.setItem(ROLE_KEY, data.role);
      this.roleWritable.set(data.role as UserRole);
      this.loggedIn.set(true);
    } catch (e) {
      throw new Error(getApiErrorMessage(e, 'Sign in failed. Try again.'));
    }
  }

  signOut(): void {
    this.clearSessionLocal();
  }

  private hydrateFromStorage(): void {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token || !this.isTokenValid(token)) {
      this.clearSessionLocal();
      return;
    }
    const storedRole = sessionStorage.getItem(ROLE_KEY);
    if (storedRole === 'admin' || storedRole === 'operator') {
      this.roleWritable.set(storedRole);
      this.loggedIn.set(true);
    } else {
      this.clearSessionLocal();
    }
  }

  private isTokenValid(token: string): boolean {
    const expMs = readJwtExpMs(token);
    return expMs != null && expMs > Date.now();
  }

  private clearSessionLocal(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    this.loggedIn.set(false);
    this.roleWritable.set(null);
  }
}
