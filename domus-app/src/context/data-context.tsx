"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MOCK_PROPERTIES, MOCK_EXPENSES, Property, Expense } from "@/lib/mock-data";

type DataContextType = {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);

  return (
    <DataContext.Provider value={{ properties, setProperties, expenses, setExpenses }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
