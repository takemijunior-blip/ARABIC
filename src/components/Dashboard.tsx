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
  Clock
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onSelectLesson: (lesson: Lesson, badgeIdToAward: string) => void;
  onOpenSheikhChat: () => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
}

// Generate static fake ranking table and merge with active profile
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
  const { profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"modules" | "leaderboard" | "achievements">("modules");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>("modulo_1");
  const [greeting, setGreeting] = useState("Olá");
  const [arabicGreeting, setArabicGreeting] = useState("أهلاً وسهلاً");

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
  }, []);

  if (!profile) return null;

  // Level Up Progress Bar calculations (0 - 100 XP is L1, 100 - 200 XP is L2, etc)
  const currentLevelXp = profile.xp % 100;
  const currentLvlLimit = 100;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / currentLvlLimit) * 100));

  // Determine which modules are unlocked
  // For safety, Module 1 is always unlocked. Module N unlocks if the user has completed at least 1 lesson of Module N-1
  const isModuleUnlocked = (mod: Module, index: number) => {
    if (index === 0) return true;
    const prevMod = CURRICULUM_MODULES[index - 1];
    // Check if user has completed at least one lesson of the previous module
    const completedPrev = prevMod.lessons.some(les => profile.completedLessons.includes(les.id));
    return completedPrev || profile.completedLessons.length >= index || profile.isPremium;
  };

  // Merge client user progress inside Leaderboard list
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Top Welcome Card with Arabesque Accents */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        {/* Sparkles background effect */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-radial-gradient from-gold-500/10 to-transparent pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-500 font-display">
              {arabicGreeting}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
            {greeting}, <span className="text-gold-100 font-bold">{profile.name}</span>!
          </h2>
          {profile.onboarding ? (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 bg-gold-950/40 border border-gold-900/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs text-gold-400 font-semibold font-display">
                <Compass className="w-3.5 h-3.5 text-gold-500" />
                Perfil: {profile.onboarding.profileName}
              </span>
              <span className="inline-flex items-center gap-1 bg-teal-950/40 border border-teal-900/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs text-teal-400 font-semibold font-display">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Meta: {profile.onboarding.dailyGoal}
              </span>
            </div>
          ) : (
            <p className="text-slate-400 text-sm mt-1 max-w-lg">
              Sua jornada no árabe clássico está brilhando hoje. Continue o bom trabalho!
            </p>
          )}

          {/* Mini Stats Grid for desktop */}
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-950/50 border border-orange-850 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium font-sans uppercase">Dias Ativos</p>
                <p className="text-sm font-bold text-slate-100 font-display">{profile.streak} {profile.streak === 1 ? "Dia" : "Dias"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-900/50 flex items-center justify-center">
                <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium font-sans uppercase">Total XP</p>
                <p className="text-sm font-bold text-slate-100 font-display">{profile.xp} XP</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium font-sans uppercase">Nível atual</p>
                <p className="text-sm font-bold text-slate-100 font-display">Lvl {profile.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Level Progress Circle/Bar */}
        <div className="w-full md:w-64 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-400">Progresso do Nível</span>
            <span className="text-xs font-bold text-gold-500">{currentLevelXp} / 100 XP</span>
          </div>
          <div className="w-full bg-slate-850 rounded-full h-3.5 overflow-hidden border border-slate-805">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-gold-600 to-amber-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] uppercase font-semibold text-slate-500 leading-none">Nível {profile.level}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 leading-none">Próximo: {profile.level + 1}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Features of the learning app */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column Left (Tabs Selector, Module Curriculum) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Custom Aesthetic Tabs */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl flex">
            <button
              onClick={() => setActiveTab("modules")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "modules" 
                ? "bg-slate-800 text-gold-500 border border-slate-700/50 shadow-md" 
                : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cursos & Lições
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "leaderboard" 
                ? "bg-slate-800 text-gold-500 border border-slate-700/50 shadow-md" 
                : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Ranking Geral
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === "achievements" 
                ? "bg-slate-800 text-gold-500 border border-slate-700/50 shadow-md" 
                : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Medalhas ({profile.badges.length})
            </button>
          </div>

          {/* TAB CONTENT: MODULES CURRICULUM */}
          {activeTab === "modules" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-display font-semibold text-lg text-white">Sua Rota de Aprendizado</h3>
                <span className="text-xs text-slate-500">
                  {profile.completedLessons.length} de {CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0)} lições feitas
                </span>
              </div>

              {CURRICULUM_MODULES.map((mod, index) => {
                const unlocked = isModuleUnlocked(mod, index);
                const isExpanded = expandedModuleId === mod.id;
                const completedCount = mod.lessons.filter(l => profile.completedLessons.includes(l.id)).length;
                const percent = Math.floor((completedCount / mod.lessons.length) * 100);

                return (
                  <div 
                    key={mod.id}
                    className={`bg-slate-900 border transition rounded-xl overflow-hidden ${
                      isExpanded 
                        ? "border-gold-500/40 shadow-lg" 
                        : "border-slate-800 hover:border-slate-700 hover:shadow"
                    }`}
                  >
                    {/* Header trigger for accordion */}
                    <div 
                      onClick={() => unlocked && setExpandedModuleId(isExpanded ? null : mod.id)}
                      className={`p-4 flex items-center justify-between transition ${
                        unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-60 bg-slate-950/20"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 pr-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                          unlocked 
                          ? "bg-slate-800 text-gold-500 border-gold-500/30" 
                          : "bg-slate-950 text-slate-600 border-slate-900"
                        }`}>
                          {unlocked ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-100 tracking-tight leading-snug truncate">
                            {mod.title}
                          </h4>
                          <p className="text-slate-400 text-xs truncate max-w-md mt-0.5">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      {/* Right elements: Progress index or Lock status */}
                      <div className="flex items-center gap-3">
                        {unlocked ? (
                          <>
                            <div className="text-right hidden sm:block">
                              <span className="text-[10px] uppercase font-bold text-slate-500">Concluído</span>
                              <p className="text-xs font-semibold text-slate-200">{completedCount}/{mod.lessons.length} ({percent}%)</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-90 text-gold-500" : ""}`} />
                          </>
                        ) : (
                          <span className="text-[10px] uppercase font-bold bg-slate-950 border border-slate-805 px-2 py-1 rounded text-slate-500 flex items-center gap-1.5">
                            <Lock className="w-3 h-3" /> Bloqueado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lesson dropdown under active expanded module */}
                    {unlocked && isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/50 p-4 space-y-2.5">
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest px-2 pb-1.5 border-b border-slate-900">
                          Lições Disponíveis
                        </p>
                        {mod.lessons.map((lesson) => {
                          const done = profile.completedLessons.includes(lesson.id);
                          return (
                            <div 
                              key={lesson.id}
                              onClick={() => onSelectLesson(lesson, mod.badgeId)}
                              className="group p-3 rounded-lg bg-slate-900/60 border border-slate-850 hover:border-gold-500-40 hover:bg-slate-900 hover:shadow flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
                            >
                              <div className="flex items-center gap-3 pr-2 overflow-hidden">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold ${
                                  done 
                                  ? "bg-emerald-950 border-emerald-800 text-emerald-400" 
                                  : "bg-slate-950 border-slate-800 text-slate-400 group-hover:border-gold-500/30 group-hover:text-gold-500"
                                }`}>
                                  {done ? "✓" : lesson.order}
                                </div>
                                <div className="truncate">
                                  <h5 className="text-sm font-semibold text-slate-200 group-hover:text-white transition leading-snug truncate">
                                    {lesson.title}
                                  </h5>
                                  <p className="text-xs text-slate-400 truncate mt-0.5">
                                    {lesson.description || "Pratique o vocabulário e exercícios interativos"}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-gold-500 font-bold shrink-0 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-850 group-hover:border-gold-500/20">
                                +40 XP
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB CONTENT: LEADERBOARD RANKING */}
          {activeTab === "leaderboard" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
              <div className="text-center">
                <Crown className="w-10 h-10 text-gold-500 mx-auto mb-2" />
                <h3 className="font-display font-semibold text-lg text-white">Grande Arena Árabe</h3>
                <p className="text-xs text-slate-500">Compita com estudantes lusófonos de todo o mundo. Consiga XP completando lições!</p>
              </div>

              <div className="space-y-2.5">
                {getLeaderboardList().map((player, idx) => {
                  const place = idx + 1;
                  return (
                    <div 
                      key={player.name}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                        player.isMe 
                        ? "bg-slate-950/80 border-gold-500/50 shadow-md" 
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Podium Numbers layout */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-sm ${
                          place === 1 ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-950" :
                          place === 2 ? "bg-slate-300 text-slate-900" :
                          place === 3 ? "bg-amber-600 text-white" : "bg-slate-950 text-slate-400"
                        }`}>
                          {place}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${player.isMe ? "text-gold-500 font-bold" : "text-slate-200"}`}>
                            {player.name}
                          </p>
                          <p className="text-[10px] text-slate-400">Nível {player.level} • {player.streak} dias ativos</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-100">{player.xp}</span>
                        <span className="text-[10px] text-slate-500 ml-1">XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: BADGES / ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BADGES_LIST.map((badge) => {
                const acquired = profile.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 border rounded-xl flex items-start gap-4 transition ${
                      acquired 
                      ? "bg-slate-900 border-gold-500/30" 
                      : "bg-slate-950/40 border-slate-900 grayscale opacity-40"
                    }`}
                  >
                    <div className="text-3xl shrink-0 p-2 rounded-lg bg-slate-950 border border-slate-850">
                      {badge.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-200 leading-snug">{badge.title}</h4>
                        {acquired && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{badge.description}</p>
                      <p className="text-[10px] text-gold-500 mt-2 font-medium bg-slate-950 px-2 py-1 rounded inline-block border border-slate-850">
                        Requisito: {badge.requirements}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column Right (Sheikh AI Virtuel Mentoring, Premium CTA, and Custom Operations) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Personalized study Plan widget if onboarding is completed */}
          {profile.onboarding && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-500/5 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-gold-500/30 flex items-center justify-center bg-slate-950 text-gold-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Plano de Estudos</h3>
                  <p className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">Metas em {profile.onboarding.duration}</p>
                </div>
              </div>

              <div className="space-y-2 text-slate-400 text-xs mt-1">
                <p className="text-slate-300 font-medium">Meta diária recomendada: <span className="text-gold-400 font-bold">{profile.onboarding.dailyGoal}</span> de estudo para conversação básica acelerada.</p>
                
                <div className="space-y-2 mt-3 pt-2 border-t border-slate-850">
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] uppercase font-bold text-gold-400 tracking-widest">Semana 1: Fundamentos</p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-sans">
                      Sons iniciais fonéticos, treinamento do Alfabeto Árabe essencial e saudações básicas.
                    </p>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Semana 2: Imersão Vocabular</p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-sans">
                      Diálogos cotidianos práticos e palavras contextualizadas focadas na sua real curiosidade.
                    </p>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Semana 3: Diálogos de Fluência</p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-sans">
                      Imersão interativa de conversação simulando situações práticas com nosso Sheikh AI de prontidão.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sheikh AI Mentoring widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center bg-slate-950 text-2xl">
                👳🏽‍♂️
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Sheikh AI</h3>
                <p className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Professor Virtual Ativo</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Tire dúvidas de gramática e estrutura diretamente com nosso mentor inteligente. Ele corrigirá sua pronúncia e escrita!
            </p>

            <button 
              onClick={onOpenSheikhChat}
              className="w-full bg-slate-800 hover:bg-slate-750 text-gold-500 hover:text-gold-400 border border-gold-500/20 hover:border-gold-500/30 font-bold px-4 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-inner cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Conversar com o Sheikh AI
            </button>
          </div>

          {/* Premium CTA Subscription Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-gold-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold-500/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-2 text-gold-500">
              <Award className="w-5 h-5 fill-gold-500/20" />
              <span className="text-xs uppercase font-extrabold tracking-widest font-display">Arabic Premium</span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">Conquiste o Ilimitado</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              {profile.isPremium 
                ? "Você possui acesso completo ilimitado!" 
                : "Acesso total ao Sheikh AI, download de certificados oficiais e lições exclusivas sem propagandas."}
            </p>

            <button 
              onClick={onOpenPremium}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-extrabold px-4 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
            >
              {profile.isPremium ? <ShieldCheck className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
              {profile.isPremium ? "Visualizar Benefícios" : "Subir de Plano Premium"}
            </button>
          </div>

          {/* Administrator panel bypass check */}
          {(profile.isAdmin) && (
            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-3">
              <p className="text-xs text-rose-400 uppercase font-bold tracking-widest leading-none">Controle de Proprietário</p>
              <p className="text-[11px] text-slate-500">Como administrador reconhecido, você possui acesso especial aos painéis.</p>
              <button 
                onClick={onOpenAdmin}
                className="w-full bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border border-rose-900/50 text-xs py-2 px-3 rounded-lg transition font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Painel Administrativo
              </button>
            </div>
          )}

          {/* Logout controls */}
          <button 
            onClick={logout}
            className="w-full text-slate-500 hover:text-slate-300 text-xs text-center border border-dashed border-slate-800/60 py-2 py-2.5 rounded-xl hover:border-slate-700/60 transition cursor-pointer"
          >
            Sair da minha conta
          </button>
        </div>
      </div>
    </div>
  );
};
