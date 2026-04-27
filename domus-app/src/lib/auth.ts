export type Plan = "Basic" | "Pro";

import type { CurrencyCode } from "./currency";
import type { Locale } from "./i18n";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  time: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: Plan;
  verified: boolean;
  currency?: CurrencyCode;
  language?: Locale;
  notifications: AppNotification[];
  notifPrefs: {
    expenseReminders: boolean;
    monthlySummary: boolean;
    propertyAlerts: boolean;
  };
};

const USER_KEY = "domusai_users_session";
const USERS_KEY = "domusai_users";

export type StoredAccount = {
  user: User;
  password: string;
};

const DEMO_ACCOUNT: StoredAccount = {
  password: "password",
  user: {
    id: "demo_nicola",
    name: "Nicola Biasissi",
    email: "nicola.biasissi05@gmail.com",
    initials: "NB",
    plan: "Pro",
    verified: true,
    notifications: [],
    notifPrefs: {
      expenseReminders: true,
      monthlySummary: true,
      propertyAlerts: false,
    },
  },
};

export function getUsersRegistry(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];
    if (accounts.length === 0) {
      const seeded = [DEMO_ACCOUNT];
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const hasDemo = accounts.some((a) => a.user.email === DEMO_ACCOUNT.user.email);
    if (!hasDemo) {
      accounts.push(DEMO_ACCOUNT);
      localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
    }
    return accounts;
  } catch {
    return [];
  }
}

export function findAccountByEmail(email: string): StoredAccount | null {
  const accounts = getUsersRegistry();
  return accounts.find((a) => a.user.email === email.trim().toLowerCase()) ?? null;
}

export function saveAccountToRegistry(account: StoredAccount): void {
  if (typeof window === "undefined") return;
  const accounts = getUsersRegistry();
  const idx = accounts.findIndex((a) => a.user.email === account.user.email);
  if (idx >= 0) {
    accounts[idx] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Property Tax Due",
    body: "Green Valley Villa — Q2 tax due in 3 days.",
    read: false,
    time: "2h ago",
  },
  {
    id: "n2",
    title: "Maintenance Logged",
    body: "HVAC maintenance ($280) added to Skyline Apartment.",
    read: false,
    time: "1d ago",
  },
  {
    id: "n3",
    title: "Rent Received",
    body: "Monthly rent collected from Skyline Apartment.",
    read: true,
    time: "3d ago",
  },
];

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function createNewUser(name: string, email: string): User {
  return {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    initials: makeInitials(name),
    plan: "Basic",
    verified: false,
    notifications: DEFAULT_NOTIFICATIONS,
    notifPrefs: {
      expenseReminders: true,
      monthlySummary: true,
      propertyAlerts: false,
    },
  };
}
