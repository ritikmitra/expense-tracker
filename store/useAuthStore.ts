import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/util/lib";
import { auth } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

type AuthStore = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialized: false,

      signUp: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
      },

      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },

      initAuth: () => {
        onAuthStateChanged(auth, (user) => {
          set({ user, loading: false, initialized: true });
        });
      },
    }),
    {
      name: "secure-auth-store",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export default useAuthStore;
