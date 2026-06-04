import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { Module, Lesson, UserProfile } from "../types";
import { CURRICULUM_MODULES, BADGES_LIST } from "../data";
import { 
  Trophy, 
  Flame, 
  Star, 
  BadgeCheck, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Lock, 
  Award, 
  Crown,
  Heart,
  Compass,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Clock,
  Coins,
  Volume2,
  FileCheck,
  Download,
  Printer,
  Sparkle,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  onSelectLesson: (lesson: Lesson, badgeIdToAward: string) => void;
  onOpenSheikhChat: () => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
}

const STATIC_LEADERBOARD = [
  { name: "Youssef Mansour", xp: 1450, level: 15, streak: 12, isMe: false },
  { name: "Gabriel Al-Cury", xp: 1100, level: 12, streak: 8, isMe: false },
  { name: "Fatima Santos", xp: 820, level: 9, streak: 15, isMe: false },
  { name: "Mariana Al-Hassan", xp: 550, level: 6, streak: 4, isMe: false },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectLesson, 
  onOpenSheikhChat, 
  onOpenPremium,
  onOpenAdmin
}) => {
  const { profile, logout, addXp, addCoins } = useAuth();
  const [activeTab, setActiveTab] = useState<"modules" | "leaderboard" | "achievements">("modules");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>("modulo_1");
  const [greeting, setGreeting] = useState("Olá");
  const [arabicGreeting, setArabicGreeting] = useState("أهلاً وسهلاً");

  // Certificate Modal States
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);
  const [candidateNameInput, setCandidateNameInput] = useState("");
  
  // Daily Challenge Modal States
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [dailyClaimStatus, setDailyClaimStatus] = useState<string | null>(null);
  const [challengeStep, setChallengeStep] = useState<"study" | "quiz">("study");
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);

  // Store lists of dynamic claimed certificates (stored locally per profile uid)
  const [claimedCertificates, setClaimedCertificates] = useState<string[]>([]);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Bom dia");
      setArabicGreeting("Sabaah al-Khair (صباح الخير)");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Boa tarde");
      setArabicGreeting("Masaa al-Khair (مساء الخير)");
    } else {
      setGreeting("Boa noite");
      setArabicGreeting("Lailah Sa'idah (ليلة سعيدة)");
    }
    
    // Check if daily claimed is saved for today
    const todayStr = new Date().toISOString().slice(0, 10);
    const key = `daily_claimed_${profile?.uid}_${todayStr}`;
    if (localStorage.getItem(key) === "true") {
      setDailyClaimed(true);
    }

    // Load claimed certificates
    const certKey = `claimed_certs_${profile?.uid}`;
    const storedCerts = localStorage.getItem(certKey);
    if (storedCerts) {
      setClaimedCertificates(JSON.parse(storedCerts));
    }
  }, [profile]);

  if (!profile) return null;

  // Level Up calculations
  const currentLevelXp = profile.xp % 100;
  const currentLvlLimit = 100;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / currentLvlLimit) * 100));

  // Determine unlocked modules
  const isModuleUnlocked = (mod: Module, index: number) => {
    if (index === 0) return true;
    const prevMod = CURRICULUM_MODULES[index - 1];
    const completedPrev = prevMod ? prevMod.lessons.some(les => profile.completedLessons.includes(les.id)) : false;
    return completedPrev || profile.completedLessons.length >= index || profile.isPremium;
  };

  const getLeaderboardList = () => {
    const meRow = {
      name: `${profile.name} (Você)`,
      xp: profile.xp,
      level: profile.level,
      streak: profile.streak,
      isMe: true
    };
    const list = [...STATIC_LEADERBOARD, meRow];
    return list.sort((a, b) => b.xp - a.xp);
  };

  // Google Text To Speech for Daily Challenge with speechSynthesis alternate fallback
  const handlePlayVoice = (text: string) => {
    if (!text) return;
    setPlayingText(text);

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(ttsUrl);

    audio.onended = () => setPlayingText(null);
    audio.onerror = () => {
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ar-SA";
          utterance.rate = 0.75;
          utterance.onend = () => setPlayingText(null);
          utterance.onerror = () => setPlayingText(null);
          window.speechSynthesis.speak(utterance);
        } catch {
          setPlayingText(null);
        }
      } else {
        setPlayingText(null);
      }
    };
    audio.play().catch(() => {
      // Direct WebSpeech fallback
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = "ar-SA";
          u.rate = 0.75;
          u.onend = () => setPlayingText(null);
          window.speechSynthesis.speak(u);
        } catch {
          setPlayingText(null);
        }
      } else {
        setPlayingText(null);
      }
    });
  };

  // COMPLETE DAILY CHALLENGE FLOW
  const handleCheckDailyAnswer = () => {
    if (quizSelectedOption === "العلم نور") {
      setQuizCorrect(true);
      setQuizChecked(true);
    } else {
      setQuizCorrect(false);
      setQuizChecked(true);
    }
  };

  const handleClaimDailyReward = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const key = `daily_claimed_${profile?.uid}_${todayStr}`;
    
    setDailyClaimStatus("Armazenando recompensas no servidor...");
    localStorage.setItem(key, "true");
    setDailyClaimed(true);

    // Grant 15 XP & 10 Coins
    await addXp(15);
    await addCoins(10);

    setTimeout(() => {
      setDailyClaimStatus(null);
      setShowDailyModal(false);
    }, 1500);
  };

  // DEFINITION OF UNDERLYING ACADEMIC CERTIFICATES (CERTIFICADOS)
  const PREMIUM_CERTIFICATES = [
    { id: "cert_lvl1", title: "Certificado Nível 1 - Primeiros Passos", desc: "Chancela oficial certificada de introdução geral de sons, alfabeto e saudações básicas primárias.", reqText: "Requer Nível 3 acadêmico", code: "CERT-AM-LEVEL1", levelReq: 3, coinCost: 0 },
    { id: "cert_lvl2", title: "Certificado Nível 2 - Fluência Prática", desc: "Comprova autonomia cognitiva para conversar sobre vestuário, cores e números.", reqText: "Requer Nível 6 acadêmico", code: "CERT-AM-LEVEL2", levelReq: 6, coinCost: 0 },
    { id: "cert_lvl3", title: "Certificado Nível 3 - Especialista Gramatical", desc: "Atesta compreensão gramatical avançada, incluindo calendarização e expressões verbais do Sheikh.", reqText: "Requer Nível 9 acadêmico", code: "CERT-AM-LEVEL3", levelReq: 9, coinCost: 0 },
    { id: "cert_lvl4", title: "Certificado Nível 4 - Fluência Acadêmica", desc: "O auge dos estudos do Arabic Master: apto para transações comerciais internacionais de prestígio.", reqText: "Requer Nível 12 acadêmico", code: "CERT-AM-LEVEL4", levelReq: 12, coinCost: 0 },
    { id: "cert_flu_basica", title: "Certificado de Fluência Básica", desc: "Comprova finalização de 5 módulos teóricos completos.", reqText: "Requer 5 lições concluídas e 40 moedas (Grátis para Premium)", code: "CERT-AM-FBASICA", minLessons: 5, coinCost: 40 },
    { id: "cert_flu_inter", title: "Certificado de Fluência Intermediária", desc: "Comprova maestria em 15 lições práticas de vocabulário.", reqText: "Requer 15 lições concluídas e 80 moedas (Grátis para Premium)", code: "CERT-AM-FINTER", minLessons: 15, coinCost: 80 },
    { id: "cert_flu_avancada", title: "Diplomacia em Fluência Avançada", desc: "Garante maestria expressiva em mais de 30 lições e interações.", reqText: "Requer 30 lições concluídas e 150 moedas (Grátis para Premium)", code: "CERT-AM-FAVANC", minLessons: 30, coinCost: 150 },
  ];

  const handleClaimCertificate = (cert: any) => {
    // Check if meets requirements
    const levelMet = profile.level >= (cert.levelReq || 0);
    const lessonsMet = profile.completedLessons.length >= (cert.minLessons || 0);

    if (!levelMet || !lessonsMet) {
      alert("Você ainda não atendeu aos pré-requisitos educacionais deste certificado!");
      return;
    }

    const cost = profile.isPremium ? 0 : cert.coinCost;
    const currentCoins = profile.coins !== undefined ? profile.coins : 50;

    if (currentCoins < cost) {
      alert(`Moedas insuficientes! Você necessita de 🪙 ${cost} moedas, mas possui apenas 🪙 ${currentCoins}. complete lições e desafios diários!`);
      return;
    }

    // Spend coins if any
    if (cost > 0) {
      addCoins(-cost);
    }

    // Add to claimed certificates
    const newClaimed = [...claimedCertificates, cert.id];
    setClaimedCertificates(newClaimed);
    localStorage.setItem(`claimed_certs_${profile.uid}`, JSON.stringify(newClaimed));

    setSelectedCertificate(cert);
    setCandidateNameInput(profile.name);
  };

  const handleOpenCertificateViewer = (cert: any) => {
    setSelectedCertificate(cert);
    setCandidateNameInput(profile.name);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Top Welcome Card with Arabesque Accents */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-500/5 to-transparent pointer-events-none"></div>
        
        {/* User Stats and Greeting */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-gold-600 to-gold-500 flex items-center justify-center text-slate-950 font-display font-black text-xl sm:text-2xl shadow-inner relative border border-gold-500/20">
            {profile.name.slice(0, 1).toUpperCase()}
            {profile.isPremium && (
              <span className="absolute -top-1.5 -right-1.5 bg-slate-950 border border-gold-500/40 p-1 rounded-full text-[10px] leading-none" title="Premium">
                👑
              </span>
            )}
          </div>
          <div>
            <p className="text-slate-450 text-xs sm:text-sm font-semibold">{arabicGreeting}</p>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              {greeting}, {profile.name}! 
            </h2>
            <div className="flex flex-wrap gap-2.5 mt-2">
              <span className="text-[10px] font-bold text-slate-350 bg-slate-950 border border-slate-850 py-1 px-3 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" /> Nível {profile.level}
              </span>
              <span className="text-[10px] font-bold text-[#d4b574] bg-slate-950 border border-slate-850 py-1 px-3 rounded-full flex items-center gap-1 font-mono">
                🪙 {profile.coins !== undefined ? profile.coins : 50} Moedas
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-slate-950 border border-slate-850 py-1 px-3 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-emerald-500 text-emerald-400 animate-pulse" /> {profile.streak} dia{profile.streak > 1 ? "s" : ""} de sequência
              </span>
            </div>
          </div>
        </div>

        {/* Level Up progress indicators */}
        <div className="w-full md:w-64 space-y-2 bg-slate-950/60 border border-slate-850 p-4 rounded-xl shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-450">Progresso de Nível</span>
            <span className="font-mono text-slate-300 font-bold">{currentLevelXp} / {currentLvlLimit} XP</span>
          </div>
          <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full transition-all duration-550"
            ></div>
          </div>
          <p className="text-[9px] text-slate-500 font-sans tracking-wide">Complete lições para desbloquear medalhas e certificados.</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column Left (Tabs Selector, Module Curriculum) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Custom Aesthetic Tabs */}
          <div className="border border-slate-800 bg-slate-900/50 p-1.5 rounded-xl flex gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab("modules")}
              className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "modules" 
                ? "bg-slate-950 text-gold-500 border border-slate-850 font-black shadow-inner" 
                : "text-slate-450 hover:text-slate-250"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Módulos
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "leaderboard" 
                ? "bg-slate-950 text-gold-500 border border-slate-850 font-black shadow-inner" 
                : "text-slate-450 hover:text-slate-250"
              }`}
            >
              <Trophy className="w-4 h-4" /> Ranking
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "achievements" 
                ? "bg-slate-950 text-gold-500 border border-slate-850 font-black shadow-inner" 
                : "text-slate-450 hover:text-slate-250"
              }`}
            >
              <Award className="w-4 h-4" /> Medalhas & Diplomas
            </button>
          </div>

          {/* TAB CONTENT: MODULES CURRICULUM */}
          {activeTab === "modules" && (
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest pl-1 block">Grade de Aprendizagem ({CURRICULUM_MODULES.length} Módulos)</span>
              
              {CURRICULUM_MODULES.map((modulo, mIdx) => {
                const unlocked = isModuleUnlocked(modulo, mIdx);
                const isExpanded = expandedModuleId === modulo.id;
                
                // Count completed lessons in this module
                const countCompleted = modulo.lessons.filter(l => profile.completedLessons.includes(l.id)).length;
                const percentDone = modulo.lessons.length > 0 ? Math.floor((countCompleted / modulo.lessons.length) * 100) : 0;

                return (
                  <div 
                    key={modulo.id}
                    className={`border rounded-2xl overflow-hidden transition duration-300 ${
                      unlocked 
                      ? "bg-slate-900 border-slate-800" 
                      : "bg-slate-950/20 border-slate-920 opacity-60"
                    }`}
                  >
                    {/* Header bar layout */}
                    <div 
                      onClick={() => unlocked && setExpandedModuleId(isExpanded ? null : modulo.id)}
                      className={`p-4 sm:p-5 flex justify-between items-center gap-4 select-none ${unlocked ? "cursor-pointer hover:bg-slate-850/40" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-sm font-bold font-sans ${
                          unlocked 
                          ? "bg-slate-950 border-gold-550/10 text-[#d4b574]" 
                          : "bg-slate-900 border-slate-850 text-slate-500"
                        }`}>
                          {unlocked ? mIdx + 1 : <Lock className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-display">Módulo {mIdx + 1}</span>
                            {percentDone === 100 && (
                              <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-900/35 px-1.5 py-0.2 rounded uppercase">
                                Concluído!
                              </span>
                            )}
                          </div>
                          <h4 className="text-slate-200 font-bold text-sm sm:text-base mt-0.5 leading-snug">{modulo.title}</h4>
                          <p className="text-[11px] text-slate-450 mt-1">{modulo.description}</p>
                        </div>
                      </div>

                      {unlocked ? (
                        <div className="flex items-center gap-3 shrink-0">
                          {percentDone > 0 && percentDone < 100 && (
                            <div className="hidden sm:block text-right font-mono text-[10px] text-slate-500 font-bold">
                              {percentDone}% feito
                            </div>
                          )}
                          <ChevronRight className={`w-5 h-5 text-slate-500 transition duration-300 ${isExpanded ? "rotate-90 text-gold-500" : ""}`} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-extrabold text-[#d4b574] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850 shrink-0 uppercase tracking-widest leading-none">
                          {mIdx <= 15 ? "Bloqueado" : "Premium Only"}
                        </span>
                      )}
                    </div>

                    {/* Expandable lessons stack */}
                    <AnimatePresence>
                      {isExpanded && unlocked && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="border-t border-slate-850 bg-slate-950/40 overflow-hidden"
                        >
                          <div className="p-4 space-y-2.5">
                            {modulo.lessons.map((lesson) => {
                              const done = profile.completedLessons.includes(lesson.id);
                              return (
                                <div 
                                  key={lesson.id}
                                  onClick={() => onSelectLesson(lesson, modulo.badgeId)}
                                  className="p-3.5 bg-slate-900/40 hover:bg-slate-900 border border-slate-850 rounded-xl flex justify-between items-center gap-4 transition duration-200 cursor-pointer hover:border-gold-550/20 group"
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-bold text-slate-200 group-hover:text-gold-500 transition">{lesson.title}</p>
                                      {done && <BadgeCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-450 mt-0.5 max-w-xl truncate font-sans">
                                      Árabe: {lesson.arabic} • Fonologia: {lesson.pronunciation}
                                    </p>
                                  </div>

                                  <span className={`text-[9px] uppercase font-bold py-1 px-3.5 rounded-lg border tracking-wide group-hover:bg-[#d4b574] group-hover:border-none group-hover:text-slate-950 transition cursor-pointer shrink-0 ${
                                    done 
                                    ? "bg-slate-950 text-emerald-400 border-emerald-950/25" 
                                    : "bg-slate-950 text-[#d4b574] border-[#d4b574]/15"
                                  }`}>
                                    {done ? "Refazer (+15 XP)" : "Acessar (+40 XP)"}
                                  </span>
                                </div>
                              );
                            })}

                            {modulo.lessons.length === 0 && (
                              <p className="text-xs text-slate-500 text-center py-4">Nenhuma lição configurada para este módulo comercial ainda.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB CONTENT: LEADERBOARD RANKING */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-white">Ranking de Rendimento Semanal</h3>
                <p className="text-xs text-slate-450 leading-relaxed">Concorra amigavelmente com estudantes lusófonos. Alcance as cabeças obtendo medalhas!</p>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/10">
                <div className="grid grid-cols-12 gap-3 p-4 border-b border-slate-850 bg-slate-950/40 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-2 text-center">Posição</div>
                  <div className="col-span-5">Estudante</div>
                  <div className="col-span-2 text-center">Nível</div>
                  <div className="col-span-3 text-right">XP Acumulado</div>
                </div>

                <div className="divide-y divide-slate-850">
                  {getLeaderboardList().map((row, index) => {
                    const isCurrentUser = row.name.includes("Você");
                    return (
                      <div 
                        key={row.name}
                        className={`grid grid-cols-12 gap-3 p-4 items-center text-xs transition ${
                          isCurrentUser 
                          ? "bg-gold-500/10 border-y border-gold-500/20 font-bold" 
                          : "hover:bg-slate-950/25"
                        }`}
                      >
                        {/* Position */}
                        <div className="col-span-2 text-center font-display font-black text-sm text-slate-200">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`}
                        </div>

                        {/* Name and badge */}
                        <div className="col-span-5 flex items-center gap-2">
                          <span className={`truncate text-xs ${isCurrentUser ? "text-gold-400 font-bold" : "text-slate-350"}`}>
                            {row.name}
                          </span>
                        </div>

                        {/* Level */}
                        <div className="col-span-2 text-center font-bold text-slate-400 font-mono">
                          Lvl {row.level}
                        </div>

                        {/* XP */}
                        <div className="col-span-3 text-right text-slate-200 font-bold font-mono">
                          {row.xp} XP
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: BADGES & CERTIFICATES */}
          {activeTab === "achievements" && (
            <div className="space-y-8">
              
              {/* SUBSECTION 1: THE DIPLOMA CABINET */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-white">Seus Diplomas & Certificados Oficiais</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">Mostre suas conquistas linguísticas ao mundo! Baixe ou imprima seus certificados de aprovação.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PREMIUM_CERTIFICATES.map((cert) => {
                    const isClaimedList = claimedCertificates.includes(cert.id);
                    const levelMet = profile.level >= (cert.levelReq || 0);
                    const lessonsMet = profile.completedLessons.length >= (cert.minLessons || 0);
                    const activeUnlock = levelMet && lessonsMet;

                    return (
                      <div 
                        key={cert.id}
                        className={`p-5 border rounded-2xl flex flex-col justify-between gap-4 transition relative overflow-hidden bg-slate-900 ${
                          isClaimedList 
                            ? "border-gold-500/30" 
                            : activeUnlock 
                              ? "border-slate-800" 
                              : "border-slate-900 bg-slate-950/20 opacity-45"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[8px] font-mono font-bold text-slate-500 block">{cert.code}</span>
                            {isClaimedList && (
                              <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-gold-450/25 text-gold-400 border border-gold-500/30 rounded">
                                Emitido
                              </span>
                            )}
                          </div>

                          <h4 className="text-slate-250 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-gold-500 shrink-0" /> {cert.title}
                          </h4>
                          <p className="text-[11px] text-slate-450 font-sans leading-relaxed">{cert.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-3">
                          <span className="text-[10px] text-slate-500 italic truncate max-w-[150px]">
                            {cert.reqText}
                          </span>

                          {isClaimedList ? (
                            <button
                              onClick={() => handleOpenCertificateViewer(cert)}
                              className="bg-slate-950 hover:bg-slate-900 text-[#d4b574] text-[10px] uppercase font-extrabold px-3.5 py-1.5 border border-slate-800 rounded-lg cursor-pointer transition flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" /> Visualizar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleClaimCertificate(cert)}
                              className={`text-[9px] uppercase font-black px-3.5 py-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
                                activeUnlock 
                                  ? "bg-gold-600 text-slate-950 border-none" 
                                  : "bg-slate-950 text-slate-500 border-slate-900"
                              }`}
                            >
                              {profile.isPremium ? "Reivindicar Grátis" : cert.coinCost > 0 ? `🪙 ${cert.coinCost} Moedas` : "Reivindicar"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SUBSECTION 2: CONQUISTAS INDIVIDUAIS */}
              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-white">Insígnias de Reconhecimento</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">Estude os módulos, suba de nível e ganhe medalhas especiais de prestígio.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BADGES_LIST.map((badge) => {
                    const acquired = profile.badges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id}
                        className={`p-4 border rounded-xl flex items-start gap-4 transition ${
                          acquired 
                          ? "bg-slate-900 border-gold-500/30 font-bold" 
                          : "bg-slate-950/40 border-slate-900 grayscale opacity-45"
                        }`}
                      >
                        <div className="text-3xl shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-850">
                          {badge.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-200 leading-snug">{badge.title}</h4>
                            {acquired && <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans font-normal">{badge.description}</p>
                          <p className="text-[10px] text-slate-500 mt-2 font-semibold bg-slate-950 px-2 py-0.5 rounded inline-block border border-slate-900 font-sans">
                            Requisito: {badge.requirements}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column Right (Sheikh AI Virtuel Mentoring, Premium CTA, and Custom Operations) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* THE GOLDEN DAILY CHALLENGE WIDGET (DESAFIO DIÁRIO) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/15 border border-gold-550/20 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-500/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-amber-500/30 flex items-center justify-center bg-slate-950 text-[#d4b574]">
                  <Sparkle className="w-5 h-5 animate-spin-slow text-[#d4b574]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-tight">Desafio Diário</h3>
                  <p className="text-[9px] uppercase font-bold text-gold-400 tracking-wider">Ganha +10 moedas • +15 XP</p>
                </div>
              </div>

              {dailyClaimed && (
                <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded">
                  Feito!
                </span>
              )}
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Pratique a lição e diálogo do dia formulados pelo Sheikh AI hoje para manter sua rotina afiada!
            </p>

            <button
              onClick={() => {
                setChallengeStep("study");
                setQuizSelectedOption(null);
                setQuizChecked(false);
                setShowDailyModal(true);
              }}
              className="w-full bg-slate-955 hover:bg-slate-900/60 text-gold-500 border border-gold-500/15 hover:border-gold-500/30 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Gift className="w-4 h-4 text-gold-500" /> 
              {dailyClaimed ? "Visualizar Desafio de Hoje" : "Realizar Desafio Diário"}
            </button>
          </div>

          {/* Study Goal planner component if onboarding results exist */}
          {profile.onboarding && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-slate-800 flex items-center justify-center bg-slate-950 text-slate-400">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight">Plano Recomendado</h3>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Meta: {profile.onboarding.duration}</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-400 text-xs mt-1">
                <p className="text-slate-350 font-sans leading-relaxed">Sua meta é estudar <span className="text-gold-400 font-bold">{profile.onboarding.dailyGoal}</span> todos os dias para atingir a fluência.</p>
              </div>
            </div>
          )}

          {/* Sheikh AI Mentoring widget */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border border-slate-800 flex items-center justify-center bg-slate-950 text-xl shadow-inner select-none">
                👳🏽‍♂️
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-none">Sheikh AI</h3>
                <p className="text-[9px] uppercase font-bold text-slate-500 mt-1 tracking-wider">Professor de Árabe Clássico</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Pratique conversação livre clássica, aprenda regras gramaticais ou escreva tentativas de parágrafos.
            </p>

            <button 
              onClick={onOpenSheikhChat}
              className="w-full bg-slate-950 hover:bg-slate-900 text-[#d4b574] hover:text-gold-400 border border-slate-800 hover:border-slate-700 font-bold px-4 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <MessageSquare className="w-4 h-4" /> Entrar na Área de Bate-Papo
            </button>
          </div>

          {/* Premium CTA Subscription Card */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-900 to-amber-950/5 border border-gold-500/20 p-5 rounded-2xl shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#d4b574]">
              <Crown className="w-4.5 h-4.5 text-[#d4b574]" />
              <span className="text-[9px] uppercase font-extrabold tracking-widest font-display">Arabic Master Premium</span>
            </div>

            <h4 className="text-sm font-extrabold text-white mt-1.5 leading-tight">Garantia Acadêmica Ilimitada</h4>
            <p className="text-slate-450 text-xs mt-1 leading-relaxed font-sans">
              {profile.isPremium 
                ? "Sua assinatura premium Arabic Premium está 100% ativa!" 
                : "Libere o Módulo 16 a 20 de viagens e negócios, retire sem custos certificados e mentoria ilimitada."}
            </p>

            <button 
              onClick={onOpenPremium}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 mt-3 cursor-pointer shadow"
            >
              {profile.isPremium ? "Acessar Benefícios Premium" : "Subir de Plano Agora"}
            </button>
          </div>

          {/* Administrator panel bypass check */}
          {(profile.isAdmin) && (
            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-3">
              <p className="text-xs text-rose-450 uppercase font-bold tracking-widest leading-none">Controle de Proprietário</p>
              <p className="text-[11px] text-slate-500 leading-normal font-sans">Você possui credenciais reconhecidas de sistema escolar.</p>
              <button 
                onClick={onOpenAdmin}
                className="w-full bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border border-rose-900/40 text-xs py-2 px-3 rounded-lg transition font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Painel Administrativo
              </button>
            </div>
          )}

          {/* Logout controls */}
          <button 
            onClick={logout}
            className="w-full text-slate-500 hover:text-slate-450 text-[10px] uppercase font-bold text-center border border-slate-800/60 py-2.5 rounded-xl hover:bg-slate-950/10 cursor-pointer transition font-sans"
          >
            Sair da minha conta
          </button>
        </div>
      </div>

      {/* FULL SCREEN DYNAMIC DIPLOMA CERTIFICATE VIEWING MODAL */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-10 max-w-4xl w-full relative shadow-2xl relative select-none print:p-0 print:border-none print:bg-white"
            >
              {/* Golden Ribbon Seal graphic */}
              <div className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20 opacity-30 pointer-events-none select-none">
                <Star className="w-full h-full text-gold-500 fill-gold-500" />
              </div>

              {/* Printable Area Wrapper */}
              <div className="border-4 border-double border-gold-500/30 p-6 sm:p-10 bg-slate-950 rounded-2xl relative overflow-hidden print:bg-white print:border-black print:text-black">
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none select-none"></div>

                {/* Header Calligraphy Ornaments */}
                <div className="text-center space-y-2">
                  <div className="text-2xl sm:text-3xl font-serif text-[#d4b574] select-none tracking-widest text-[#d4b574]">
                    ✽ ❊ ✽
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-450 uppercase font-sans font-black tracking-widest block text-gold-500">
                    Arabic Master Academy • مدرستنا العربية
                  </span>
                  <h1 className="text-xl sm:text-3xl font-serif font-extrabold text-white mt-1 print:text-black tracking-tight uppercase">
                    Certificado de Conclusão Acadêmica
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-400 italic">
                    Chancela curricular outorgada por mérito e excelência educacional
                  </p>
                </div>

                {/* Body details */}
                <div className="text-center mt-8 sm:mt-12 space-y-6">
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-serif max-w-xl mx-auto">
                    Certificamos de forma solene e intransferível que
                  </p>

                  <div className="py-2.5 max-w-md mx-auto border-b-2 border-gold-500/30">
                    {/* Allow candidate to change name dynamically for printing! */}
                    <input
                      type="text"
                      value={candidateNameInput}
                      onChange={(e) => setCandidateNameInput(e.target.value)}
                      placeholder="Identificação do Estudante"
                      className="w-full text-center bg-transparent border-none text-[#d4b574] font-display font-extrabold text-xl sm:text-3xl focus:outline-none placeholder-slate-700 font-serif"
                      title="Clique para editar seu nome literário certificado"
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-350 font-normal font-serif max-w-xl mx-auto leading-relaxed">
                    demonstrou proficiência prática no programa de estudos com o Sábio Sheikh AI, obtendo aprovação nas avaliações temáticas estruturais de <span className="text-white font-bold font-sans">{selectedCertificate.title}</span>, provando discernimento para gesticular diálogos adequados à grade curricular proposta.
                  </p>
                </div>

                {/* Double signatures layout */}
                <div className="grid grid-cols-2 gap-8 mt-12 sm:mt-16 text-center text-xs text-slate-400 border-t border-slate-900 pt-6">
                  <div className="space-y-1">
                    <p className="font-serif italic text-white font-bold select-none text-[#d4b574]">Sheikh Al-Mualim AI</p>
                    <div className="w-24 h-0.5 bg-slate-800 mx-auto select-none mt-1"></div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Diretor e Mentor Sábio</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif italic text-white font-bold select-none text-[#d4b574]">Arabic Master Academy</p>
                    <div className="w-24 h-0.5 bg-slate-800 mx-auto select-none mt-1"></div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Conselho de Credenciamento</p>
                  </div>
                </div>

                {/* Verification code */}
                <p className="text-[8px] text-center text-slate-550 block font-mono mt-8 uppercase tracking-widest">
                  Validação acadêmica ID: {selectedCertificate.code}-{profile.uid.slice(0, 6).toUpperCase()}
                </p>
              </div>

              {/* Action Buttons to Print and Close */}
              <div className="flex gap-3 justify-end items-center mt-6">
                <span className="text-[10px] text-slate-500 hidden sm:inline leading-none mr-auto font-sans">
                  💡 Clique no nome do certificado para editá-lo antes de salvar.
                </span>

                <button
                  onClick={() => window.print()}
                  className="bg-gold-600 hover:bg-gold-500 border-none text-slate-950 font-extrabold text-xs py-2.5 px-5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
                </button>

                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition border border-slate-700"
                >
                  Fechar Painel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC DESAFIO DIÁRIO (DAILY CHALLENGE) COMPONENT MODAL */}
      <AnimatePresence>
        {showDailyModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5"
            >
              {/* Daily Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500">
                  <Star className="w-5 h-5 fill-gold-500 text-gold-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Desafio Diário do Sábio</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Acople sabedoria em sua rotina diária</p>
                </div>
              </div>

              {dailyClaimed ? (
                /* CLAIMED STATE SCREEN */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-950/50 border border-emerald-900 rounded-full flex items-center justify-center text-emerald-400 mx-auto font-bold text-2xl animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">Recompensa de Hoje já Reivindicada!</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
                    Você já concluiu este desafio de orações e palavras de hoje. Volte amanhã às 00:00 UTC para novos ensinamentos cotidianos!
                  </p>
                  
                  <button
                    onClick={() => setShowDailyModal(false)}
                    className="bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800 py-2.5 px-6 rounded-xl text-xs font-semibold cursor-pointer transition mt-2"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                /* INTERACTIVE STUDY AND TEST CHALLENGE FOR DAY */
                <div className="space-y-4 font-sans">
                  {challengeStep === "study" ? (
                    /* STEP 1: READ DAY LESSON */
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
                        {/* Word of Day */}
                        <div>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">1. Palavra do Dia</span>
                          <div className="flex items-center gap-2 mt-1 justify-between">
                            <p className="font-arabic font-extrabold text-[#d4b574] text-lg">الكتاب <span className="text-xs font-sans text-slate-500">(Al-Kitab)</span></p>
                            <span className="text-xs text-slate-350">Significado: <strong className="text-white">O Livro</strong></span>
                            <button 
                              onClick={() => handlePlayVoice("الكتاب")}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Phrase of Day */}
                        <div className="pt-3.5 border-t border-slate-900">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">2. Frase do Dia</span>
                          <div className="flex items-start gap-2 justify-between mt-1">
                            <div>
                              <p className="font-arabic font-extrabold text-white text-base">العلم نور</p>
                              <p className="text-[10px] text-slate-450 italic mt-0.5">Al-'ilmu noor</p>
                              <p className="text-xs text-slate-300 mt-1">Tradução: <strong className="text-white">O conhecimento é luz</strong></p>
                            </div>
                            <button 
                              onClick={() => handlePlayVoice("العلم نور")}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Dialog of Day */}
                        <div className="pt-3.5 border-t border-slate-900 space-y-1.5">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">3. Diálogo Curto de Hoje</span>
                          <div className="space-y-2 text-xs">
                            <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 flex justify-between items-center gap-2">
                              <div>
                                <span className="text-[8px] font-bold text-slate-500 block">ALUNO</span>
                                <p className="font-arabic font-bold text-white text-xs">صباح الخير <span className="font-sans text-[10px] font-normal text-slate-400 italic">(Sabaah al-khair)</span></p>
                                <p className="text-[10px] text-slate-400 mt-1">Mesa: Bom dia!</p>
                              </div>
                              <button onClick={() => handlePlayVoice("صباح الخير")} className="p-1 border border-slate-800 rounded bg-slate-950 text-slate-400 hover:text-white cursor-pointer"><Volume2 className="w-3 h-3" /></button>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 flex justify-between items-center gap-2">
                              <div>
                                <span className="text-[8px] font-bold text-slate-500 block font-display">SÁBIO SHEIKH</span>
                                <p className="font-arabic font-bold text-gold-400 text-xs">صباح النور <span className="font-sans text-[10px] font-normal text-slate-400 italic">(Sabaah an-noor)</span></p>
                                <p className="text-[10px] text-slate-400 mt-1">Mesa: Bom dia de luz!</p>
                              </div>
                              <button onClick={() => handlePlayVoice("صباح النور")} className="p-1 border border-slate-800 rounded bg-slate-950 text-slate-400 hover:text-white cursor-pointer"><Volume2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setChallengeStep("quiz");
                          setQuizSelectedOption(null);
                          setQuizChecked(false);
                        }}
                        className="w-full bg-[#d4b574] hover:bg-gold-500 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition duration-200 cursor-pointer shadow flex items-center justify-center gap-1.5"
                      >
                        Avançar para Teste Prático <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* STEP 2: ACTIVE QUIZ VALIDATION */
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5">
                        <span className="text-[9px] font-extrabold text-gold-500 uppercase tracking-widest block">AVALIAÇÃO DE HOJE</span>
                        <h4 className="text-xs sm:text-sm text-slate-200 font-bold leading-normal">
                          Como se escreve em alfabeto árabe a frase clássica estudada: <strong className="text-white font-sans">"O conhecimento é luz"</strong>?
                        </h4>

                        <div className="space-y-2 pt-2">
                          {[
                            { text: "العلم نور (Al-'ilmu noor)", val: "العلم نور" },
                            { text: "صباح الخير (Sabaah al-khair)", val: "صباح الخير" },
                            { text: "الكتاب (Al-Kitab)", val: "الكتاب" },
                            { text: "مع السلامة (Ma'a as-salama)", val: "مع السلامة" }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => !quizChecked && setQuizSelectedOption(opt.val)}
                              className={`w-full text-left p-3.5 rounded-xl text-xs transition cursor-pointer border flex items-center justify-between ${
                                quizSelectedOption === opt.val 
                                  ? "bg-gold-500/10 text-gold-400 border-gold-500/35 font-bold" 
                                  : "bg-slate-900 text-slate-400 border-slate-850 hover:bg-slate-850"
                              }`}
                              disabled={quizChecked}
                            >
                              <span className="font-arabic font-extrabold text-slate-200">{opt.text}</span>
                              <span className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                                {quizSelectedOption === opt.val && "✓"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {quizChecked ? (
                        /* RESULTS PANEL */
                        <div className="space-y-4">
                          {quizCorrect ? (
                            <div className="p-4 bg-emerald-950/50 border border-emerald-900 rounded-xl space-y-1">
                              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">✓ Resposta Correta!</p>
                              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                                Fantástico! Você consolidou com êxito a oração de que "O conhecimento é luz" em árabe.
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 bg-rose-950/50 border border-rose-900 rounded-xl space-y-1">
                              <p className="text-xs font-bold text-rose-400">✗ Resposta Incorreta</p>
                              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                                Sem problemas! A alternativa correta era <strong className="text-white font-arabic">"العلم نور"</strong>. Estude mais e repita.
                              </p>
                            </div>
                          )}

                          {dailyClaimStatus && (
                            <p className="text-[10px] text-center text-gold-500 animate-pulse font-semibold uppercase tracking-wider">{dailyClaimStatus}</p>
                          )}

                          <button
                            onClick={handleClaimDailyReward}
                            className="w-full bg-gold-600 hover:bg-gold-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            Resgatar Recompensas (+15 XP, +10 Moedas)
                          </button>
                        </div>
                      ) : (
                        /* CHOOSE SUBMISSION ACTION */
                        <button
                          onClick={handleCheckDailyAnswer}
                          disabled={!quizSelectedOption}
                          className="w-full bg-rose-900 hover:bg-rose-800 disabled:bg-slate-950 disabled:text-slate-600 text-white font-black py-3 rounded-xl text-xs transition shadow cursor-pointer flex items-center justify-center"
                        >
                          Confirmar Minha Resposta
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setShowDailyModal(false)}
                    className="w-full text-center text-slate-500 hover:text-slate-350 text-[10px] uppercase font-bold tracking-wider pt-2 block font-sans cursor-pointer"
                  >
                    Estudar depois / Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
