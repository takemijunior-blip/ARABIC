import React, { useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { InitialScreen } from "./components/InitialScreen";
import { Dashboard } from "./components/Dashboard";
import { LessonView } from "./components/LessonView";
import { SheikhAIChat } from "./components/SheikhAIChat";
import { PremiumView } from "./components/PremiumView";
import { AdminPanel } from "./components/AdminPanel";
import { Lesson } from "./types";
import { 
  Crown, 
  MessageSquare,
  BookOpen, 
  Award, 
  Settings, 
  LogOut, 
  Flame, 
  Trophy,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { profile, isLoading, logout } = useAuth();
  const [view, setView] = useState<"dashboard" | "lesson" | "sheikh_chat" | "premium" | "admin">("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeBadgeId, setActiveBadgeId] = useState<string>("badge_passos");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#c5a85c] border-t-transparent animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Carregando seus pergaminhos...</p>
      </div>
    );
  }

  // If no user profile loaded, direct to Initial Authentication Page
  if (!profile) {
    return <InitialScreen />;
  }

  const handleSelectLesson = (lesson: Lesson, badgeIdToAward: string) => {
    setSelectedLesson(lesson);
    setActiveBadgeId(badgeIdToAward);
    setView("lesson");
  };

  const handleExitLesson = () => {
    setSelectedLesson(null);
    setView("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Dynamic Top Navigation Bar (Hidden in Lesson study card for immersive focus) */}
      {view !== "lesson" && (
        <header className="sticky top-0 bg-slate-900/85 backdrop-blur-md border-b border-slate-850 z-30 px-4 py-3 sm:py-4 transition-all duration-300">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* Left Brand Identity */}
            <div 
              onClick={() => setView("dashboard")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-gold-600 to-gold-500 border border-slate-800 flex items-center justify-center text-slate-950 font-extrabold text-xs shadow-inner">
                ع
              </div>
              <h1 className="font-display font-bold text-sm sm:text-base text-white tracking-tight">
                Arabic <span className="text-gold-500 font-extrabold pb-0.5 group-hover:text-gold-400 transition">Master</span>
              </h1>
            </div>

            {/* Middle Quick Navigation shortcuts */}
            <nav className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => setView("dashboard")}
                className={`py-1.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  view === "dashboard" ? "bg-slate-800 text-gold-500" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Módulos</span>
              </button>

              <button
                onClick={() => setView("sheikh_chat")}
                className={`py-1.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  view === "sheikh_chat" ? "bg-slate-800 text-gold-500" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Sheikh AI</span>
              </button>

              <button
                onClick={() => setView("premium")}
                className={`py-1.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  view === "premium" ? "bg-slate-0 text-gold-500 border border-gold-500/20" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Crown className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="hidden md:inline">Premium</span>
              </button>
            </nav>

            {/* Right User statistics badge drawer */}
            <div className="flex items-center gap-3">
              {/* Streak Pill */}
              <div className="flex items-center gap-1 bg-orange-950/30 border border-orange-900/30 px-2 sm:px-2.5 py-1 rounded-full text-orange-500 font-display font-medium text-[10px] sm:text-xs">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{profile.streak}d</span>
              </div>

              {/* Levels / Profile circular view */}
              <div 
                onClick={() => setView("premium")}
                className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-2 sm:px-3 py-1.5 rounded-xl cursor-pointer hover:border-gold-500/20 transition shrink-0"
              >
                <div className="w-5 h-5 rounded-md bg-gold-600 flex items-center justify-center font-display text-[9px] text-slate-950 font-bold">
                  {profile.level}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] font-bold text-slate-300 leading-none">{profile.name}</p>
                  <p className="text-[8px] text-gold-500 font-semibold uppercase tracking-wider mt-0.5">{profile.xp} XP total</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main viewport Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {view === "dashboard" && (
              <Dashboard 
                onSelectLesson={handleSelectLesson}
                onOpenSheikhChat={() => setView("sheikh_chat")}
                onOpenPremium={() => setView("premium")}
                onOpenAdmin={() => setView("admin")}
              />
            )}

            {view === "lesson" && selectedLesson && (
              <LessonView 
                lesson={selectedLesson}
                badgeIdToAward={activeBadgeId}
                onBack={handleExitLesson}
              />
            )}

            {view === "sheikh_chat" && (
              <SheikhAIChat 
                onBack={() => setView("dashboard")}
              />
            )}

            {view === "premium" && (
              <PremiumView 
                onBack={() => setView("dashboard")}
              />
            )}

            {view === "admin" && (
              <AdminPanel 
                onBack={() => setView("dashboard")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent global mini branding footer */}
      {view !== "lesson" && (
        <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-650 shrink-0">
          <p>© 2026 ARABIC MASTER • APRENDIZADO ACADÊMICO DE ÁRABE PARA LUSÓFONOS</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <span>Servidor seguro online</span> <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          </p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
