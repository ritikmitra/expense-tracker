import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/util/lib'; 
import { nanoid } from 'nanoid/non-secure';


export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; 
};

type Store = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
};


const useExpenseStore = create<Store>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        const newExpense = { id: nanoid(), ...expense };
        set({ expenses: [newExpense, ...get().expenses] });
      },
      deleteExpense: (id) =>
        set({ expenses: get().expenses.filter((e) => e.id !== id) }),
    }),
    {
      name: 'secure-expense-store',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export default useExpenseStore;

