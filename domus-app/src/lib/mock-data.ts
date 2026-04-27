export type Property = {
  id: string;
  name: string;
  address: string;
  type: string;
  icon: string;
  color: string;
};

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING";
  propertyId: string;
  source?: "AI_INBOX";
  sourceEmailId?: string;
  invoicePdf?: string;
};

export const MOCK_PROPERTIES: Property[] = [
  { id: "1", name: "Skyline Apartment", address: "123 Main St, New York, NY",    type: "Apartment", icon: "building2", color: "blue" },
  { id: "2", name: "Green Valley Villa", address: "456 Oak Rd, Los Angeles, CA", type: "Villa",     icon: "home",      color: "emerald" },
  { id: "3", name: "Downtown Loft",      address: "789 Pine Ave, Austin, TX",    type: "Loft",      icon: "landmark",  color: "violet" },
];

export type MonthlySpend = {
  month: string;
  amount: number;
};

export const MONTHLY_SPENDING: MonthlySpend[] = [
  { month: "May", amount: 2850 },
  { month: "Jun", amount: 3120 },
  { month: "Jul", amount: 2240 },
  { month: "Aug", amount: 4180 },
  { month: "Sep", amount: 2960 },
  { month: "Oct", amount: 3640 },
  { month: "Nov", amount: 2100 },
  { month: "Dec", amount: 3450 },
  { month: "Jan", amount: 1820 },
  { month: "Feb", amount: 2640 },
  { month: "Mar", amount: 1980 },
  { month: "Apr", amount: 3395 },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: "1",  title: "Monthly Rent",       category: "Rent",        amount: 1200, dueDate: "2024-04-01", status: "PAID",    propertyId: "1" },
  { id: "2",  title: "Monthly Rent",       category: "Rent",        amount: 1800, dueDate: "2024-04-01", status: "PAID",    propertyId: "2" },
  { id: "3",  title: "Electricity Bill",   category: "Utility",     amount: 148,  dueDate: "2024-04-10", status: "PAID",    propertyId: "1" },
  { id: "4",  title: "Water & Sewage",     category: "Utility",     amount: 62,   dueDate: "2024-04-05", status: "PAID",    propertyId: "3" },
  { id: "5",  title: "Internet Service",   category: "Utility",     amount: 89,   dueDate: "2024-04-15", status: "PAID",    propertyId: "3" },
  { id: "6",  title: "HVAC Maintenance",   category: "Maintenance", amount: 280,  dueDate: "2024-04-22", status: "PAID",    propertyId: "1" },
  { id: "7",  title: "Property Tax Q2",    category: "Tax",         amount: 2000, dueDate: "2024-05-15", status: "PENDING", propertyId: "2" },
  { id: "8",  title: "Building Insurance", category: "Insurance",   amount: 420,  dueDate: "2024-05-01", status: "PENDING", propertyId: "2" },
  { id: "9",  title: "Landscaping",        category: "Maintenance", amount: 150,  dueDate: "2024-05-08", status: "PENDING", propertyId: "2" },
  { id: "10", title: "Pest Control",       category: "Maintenance", amount: 95,   dueDate: "2024-05-20", status: "PENDING", propertyId: "3" },
];
