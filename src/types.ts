export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  level: number;
  xp: number;
  coins?: number; // Moedas do Arabic Master
  streak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  completedLessons: string[]; // List of completed lesson IDs
  badges: string[]; // Earned bages/medals IDs
  isAdmin: boolean;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
  onboarding?: {
    profileName: string;
    objective: string;
    plan: string[];
    dailyGoal: string;
    duration: string;
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
    q5?: string;
    q6?: string;
    q7?: string;
  };
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  portuguese: string;
  arabic: string;
  pronunciation: string;
  phraseArabic?: string;
  phrasePronunciation?: string;
  phrasePortuguese?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: "choice" | "complete" | "translate" | "write" | "organize";
  question: string;
  arabicContext?: string;
  options?: string[]; // Multiple choice options or words to organize
  correctAnswer: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  badgeId: string;
  xpValue: number;
  lessons: Lesson[];
}

export interface LeaderboardUser {
  uid: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
}
