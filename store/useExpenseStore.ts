import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/util/lib';
import { nanoid } from 'nanoid/non-secure';
import { db } from '@/config/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import useAuthStore from './useAuthStore';

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

type Store = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchExpenses: () => Promise<void>;
};


const useExpenseStore = create<Store>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: async (expense) => {

        const user = useAuthStore.getState().user
        if (!user) return;

        const newExpense = { id: nanoid(), ...expense };

        //add to firestore
        await addDoc(collection(db, 'users', user.uid, 'expenses'), newExpense);

        //update local state
        set({ expenses: [newExpense, ...get().expenses] });
      },
      deleteExpense: async (id) => {
        const user = useAuthStore.getState().user
        if (!user) return;

        // Remove from Firestore
        const docRef = doc(db, "users", user.uid, "expenses", id);
        await deleteDoc(docRef);

        //update local state
        set({ expenses: get().expenses.filter((e) => e.id !== id) })
      },

      fetchExpenses: async () => {
        const user = useAuthStore.getState().user
        if (!user) return;

        const q = query(collection(db, "users", user.uid, "expenses"),
          orderBy("date", "desc"))

        const snapshot = await getDocs(q)

        const expenses = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Expense[];

        set({ expenses });
      },
    }),

    {
      name: 'secure-expense-store',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export default useExpenseStore;

