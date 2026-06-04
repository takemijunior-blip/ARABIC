import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile } from "../types";
import { BADGES_LIST } from "../data";

// Type definitions for context value
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  loginWithGoogle: (pendingOnboarding?: UserProfile["onboarding"]) => Promise<void>;
  continueAsGuest: (customName?: string, pendingOnboarding?: UserProfile["onboarding"]) => void;
  logout: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  completeLesson: (lessonId: string, moduleId: string, badgeIdToAward?: string) => Promise<void>;
  claimPremium: () => void;
  updateLocalProfileName: (newName: string) => void;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_GUEST_PROFILE = (name = "Estudante"): UserProfile => ({
  uid: "guest_uid",
  email: "visitante@arabicmaster.com",
  name: name,
  level: 1,
  xp: 0,
  coins: 50,
  streak: 1,
  completedLessons: [],
  badges: ["badge_passos"], // Start with Desert Scout!
  isAdmin: false,
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Parse local storage for guest
  useEffect(() => {
    const storedGuest = localStorage.getItem("arabic_master_guest_active");
    if (storedGuest === "true") {
      setIsGuest(true);
      const guestProf = localStorage.getItem("arabic_master_guest_profile");
      if (guestProf) {
        setProfile(JSON.parse(guestProf));
      } else {
        const d = DEFAULT_GUEST_PROFILE();
        localStorage.setItem("arabic_master_guest_profile", JSON.stringify(d));
        setProfile(d);
      }
      setIsLoading(false);
    }
  }, []);

  // Monitor Firebase Auth State Changes
  useEffect(() => {
    // If not in guest mode, listen to firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const storedGuest = localStorage.getItem("arabic_master_guest_active") === "true";
      if (storedGuest) {
        // Keep guest active
        setIsLoading(false);
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(false);
        await syncUserProfile(firebaseUser);
      } else {
        setUser(null);
        if (!storedGuest) {
          setProfile(null);
        }
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper helper to fetch/create Firestore Profile
  const syncUserProfile = async (firebaseUser: User, pendingOnboarding?: UserProfile["onboarding"]) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const profileData = {
          uid: firebaseUser.uid,
          email: data.email || firebaseUser.email || "",
          name: data.name || firebaseUser.displayName || "Aluno Árabe",
          level: data.level || 1,
          xp: data.xp || 0,
          coins: data.coins !== undefined ? data.coins : 50,
          streak: data.streak || 1,
          lastActiveDate: data.lastActiveDate || "",
          completedLessons: data.completedLessons || [],
          badges: data.badges || ["badge_passos"],
          isAdmin: data.isAdmin || (firebaseUser.email === "takemijunior@gmail.com" || firebaseUser.email === "test@example.com"),
          isPremium: data.isPremium || false,
          onboarding: data.onboarding || pendingOnboarding,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as UserProfile;
        
        setProfile(profileData);

        // If we have local onboarding results from a guest/new session but the database profile didn't hold one, sync it!
        if (pendingOnboarding && !data.onboarding) {
          await updateDoc(userRef, {
            onboarding: pendingOnboarding,
            updatedAt: serverTimestamp()
          }).catch(e => console.error("Could not write onboarding to Firestore:", e));
        }
      } else {
        // Create initial default profile on Firestore
        const isUserAdmin = firebaseUser.email === "takemijunior@gmail.com" || firebaseUser.email === "test@example.com";
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "Aluno Árabe",
          level: 1,
          xp: 0,
          coins: 50,
          streak: 1,
          completedLessons: [],
          badges: ["badge_passos"],
          isAdmin: isUserAdmin,
          isPremium: false,
          onboarding: pendingOnboarding,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(userRef, {
          email: newProfile.email,
          name: newProfile.name,
          level: newProfile.level,
          xp: newProfile.xp,
          coins: newProfile.coins,
          streak: newProfile.streak,
          completedLessons: newProfile.completedLessons,
          badges: newProfile.badges,
          isAdmin: newProfile.isAdmin,
          isPremium: newProfile.isPremium,
          onboarding: pendingOnboarding || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Error synchronizing profile with Firestore:", err);
    }
  };

  // Google Login popup
  const loginWithGoogle = async (pendingOnboarding?: UserProfile["onboarding"]) => {
    setIsLoading(true);
    try {
      localStorage.removeItem("arabic_master_guest_active");
      setIsGuest(false);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(result.user, pendingOnboarding);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setIsLoading(false);
      throw err;
    }
  };

  // Continue as Guest setup
  const continueAsGuest = (customName?: string, pendingOnboarding?: UserProfile["onboarding"]) => {
    setIsLoading(true);
    setIsGuest(true);
    setUser(null);
    localStorage.setItem("arabic_master_guest_active", "true");
    
    // Check if previous guest profile exists
    const existing = localStorage.getItem("arabic_master_guest_profile");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (customName) parsed.name = customName;
      if (pendingOnboarding) parsed.onboarding = pendingOnboarding;
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(parsed));
      setProfile(parsed);
    } else {
      const d = DEFAULT_GUEST_PROFILE(customName);
      if (pendingOnboarding) d.onboarding = pendingOnboarding;
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(d));
      setProfile(d);
    }
    setIsLoading(false);
  };

  // Sign out user
  const logout = async () => {
    setIsLoading(true);
    localStorage.removeItem("arabic_master_guest_active");
    setIsGuest(false);
    setUser(null);
    setProfile(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    }
    setIsLoading(false);
  };

  // Claim Premium (In Area Premium togglers)
  const claimPremium = () => {
    if (!profile) return;
    const nowStr = new Date().toISOString();
    const updated: UserProfile = { ...profile, isPremium: true, badges: Array.from(new Set([...profile.badges, "badge_premium"])), updatedAt: nowStr };
    
    setProfile(updated);
    if (isGuest) {
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(updated));
    } else if (user) {
      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, {
        isPremium: true,
        badges: updated.badges,
        updatedAt: serverTimestamp()
      }).catch(err => console.error("Could not write premium credentials on cloud context:", err));
    }
  };

  // Local/Guest Name updating
  const updateLocalProfileName = (newName: string) => {
    if (!profile) return;
    const updated = { ...profile, name: newName, updatedAt: new Date().toISOString() };
    setProfile(updated);
    if (isGuest) {
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(updated));
    } else if (user) {
      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, {
        name: newName,
        updatedAt: serverTimestamp()
      }).catch(err => console.error("Could not write username to cloud context:", err));
    }
  };

  const refreshProgress = async () => {
    if (user && !isGuest) {
      await syncUserProfile(user);
    }
  };

  // Handle XP increments and level ups (Every 100 XP is a Level Up!)
  const addXp = async (amount: number) => {
    if (!profile) return;
    
    const newXp = profile.xp + amount;
    // Level up calculation: every 100 XP is 1 level!
    const newLevel = Math.max(profile.level, Math.floor(newXp / 100) + 1);
    
    const nowStr = new Date().toISOString();
    const updated: UserProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      updatedAt: nowStr
    };

    setProfile(updated);

    if (isGuest) {
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(updated));
    } else if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          xp: newXp,
          level: newLevel,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore update error client-side fallback:", err);
      }
    }
  };

  // Handle coins modification directly
  const addCoins = async (amount: number) => {
    if (!profile) return;
    const newCoins = Math.max(0, (profile.coins || 0) + amount);
    const nowStr = new Date().toISOString();
    const updated: UserProfile = {
      ...profile,
      coins: newCoins,
      updatedAt: nowStr
    };

    setProfile(updated);

    if (isGuest) {
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(updated));
    } else if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          coins: newCoins,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore coins update error:", err);
      }
    }
  };

  // Complete a lesson safely (adds CompletedLessonId, awards XP, awards badges if required)
  const completeLesson = async (lessonId: string, moduleId: string, badgeIdToAward?: string) => {
    if (!profile) return;

    // Avoid double counting same lesson
    const isCompleted = profile.completedLessons.includes(lessonId);
    let completedLessons = [...profile.completedLessons];
    if (!isCompleted) {
      completedLessons.push(lessonId);
    }

    const xpToAward = isCompleted ? 15 : 40; // 15 XP if already study, 40 XP for new!
    const newXp = profile.xp + xpToAward;
    const newLevel = Math.max(profile.level, Math.floor(newXp / 100) + 1);
    
    const coinsToAward = isCompleted ? 5 : 15; // 5 Coelhos/Coins if repeating, 15 if first time!
    const newCoins = (profile.coins || 0) + coinsToAward;

    // Merge badges
    const badges = [...profile.badges];
    if (badgeIdToAward && !badges.includes(badgeIdToAward)) {
      badges.push(badgeIdToAward);
    }

    // Determine streak (simple day difference)
    const todayStr = new Date().toISOString().slice(0, 10);
    let currentStreak = profile.streak;
    
    if (profile.lastActiveDate) {
      if (profile.lastActiveDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        
        if (profile.lastActiveDate === yesterdayStr) {
          currentStreak += 1; // streak continues!
        } else {
          currentStreak = 1; // broke streak, reset
        }
      }
    } else {
      currentStreak = 1; // start first streak
    }

    const nowStr = new Date().toISOString();
    const updated: UserProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      coins: newCoins,
      completedLessons,
      badges,
      streak: currentStreak,
      lastActiveDate: todayStr,
      updatedAt: nowStr
    };

    setProfile(updated);

    if (isGuest) {
      localStorage.setItem("arabic_master_guest_profile", JSON.stringify(updated));
    } else if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          xp: newXp,
          level: newLevel,
          coins: newCoins,
          completedLessons,
          badges,
          streak: currentStreak,
          lastActiveDate: todayStr,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore user write error:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isGuest,
      loginWithGoogle,
      continueAsGuest,
      logout,
      addXp,
      addCoins,
      completeLesson,
      claimPremium,
      updateLocalProfileName,
      refreshProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be defined inside AuthProvider");
  }
  return context;
};
