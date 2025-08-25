import { auth, db } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  profile: { firstName: string; lastName: string; email: string } | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
  fetchProfile: () => Promise<void>;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  signUp: async (email, password, firstName, lastName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Save profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email: user.email,
      createdAt: new Date().toISOString(),
    });

    set({ user });
    await get().fetchProfile();
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      // Check if user profile exists in Firestore
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        // Create new user profile if it doesn't exist
        const displayName = user.displayName || "";
        const nameParts = displayName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        await setDoc(userDoc, {
          firstName,
          lastName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      set({ user });
      await get().fetchProfile();
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false, initialized: true });
      if (user) {
        await get().fetchProfile();
      } else {
        set({ profile: null });
      }
    });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      set({ profile: snap.data() as any });
    }
  },
}));

export default useAuthStore;
