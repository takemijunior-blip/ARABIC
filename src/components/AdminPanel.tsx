import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { CURRICULUM_MODULES, CUSTOM_ADMIN_EXERCISES, GET_LESSON_EXERCISES } from "../data";
import { Lesson, Exercise } from "../types";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  BellRing, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Smartphone,
  CheckSquare,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  onBack: () => void;
}

// Pre-packaged simulated user lists for administrative demonstration
const INITIAL_USERS = [
  { uid: "usr_1", name: "Gabriel Al-Cury", email: "alcurygabriel@gmail.com", level: 12, xp: 1100, coins: 340, isPremium: true, date: "2026-06-01" },
  { uid: "usr_2", name: "Youssef Mansour", email: "youssef@egito.com", level: 15, xp: 1450, coins: 490, isPremium: true, date: "2026-05-28" },
  { uid: "usr_3", name: "Fatima Santos", email: "fatimaria@uol.com.br", level: 9, xp: 820, coins: 150, isPremium: false, date: "2025-06-03" },
  { uid: "usr_4", name: "Mariana Al-Hassan", email: "marihassan@bol.com.br", level: 6, xp: 550, coins: 80, isPremium: false, date: "2026-06-03" },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { profile } = useAuth();
  
  const [adminTab, setAdminTab] = useState<"users" | "syllabus" | "exercises" | "chats" | "stats" | "notif">("users");
  
  // Lesson creator form states
  const [newLessonModule, setNewLessonModule] = useState("modulo_1");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonPort, setNewLessonPort] = useState("");
  const [newLessonArab, setNewLessonArab] = useState("");
  const [newLessonPron, setNewLessonPron] = useState("");

  // Exercises panel states
  const [exModuleFilter, setExModuleFilter] = useState("modulo_1");
  const [exLessonFilter, setExLessonFilter] = useState("l_1_1");
  
  // New Exercise Form State
  const [newExType, setNewExType] = useState<Exercise["type"]>("choice");
  const [newExQuestion, setNewExQuestion] = useState("");
  const [newExArabic, setNewExArabic] = useState("");
  const [newExOptions, setNewExOptions] = useState("");
  const [newExAnswer, setNewExAnswer] = useState("");

  // Notification form states
  const [notifHeader, setNotifHeader] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  // Dynamic lists in session state
  const [lessonsList, setLessonsList] = useState<Lesson[]>(
    CURRICULUM_MODULES.flatMap((m) => m.lessons)
  );
  
  const [customExercises, setCustomExercises] = useState<Exercise[]>([...CUSTOM_ADMIN_EXERCISES]);
  const [simulatedUsers, setSimulatedUsers] = useState(INITIAL_USERS);

  // Simulated Global chat list for moderation
  const [simulatedChats, setSimulatedChats] = useState([
    { id: "msg_1", sender: "Gabriel Al-Cury", room: "Sala Moçambique", text: "Moçambique na área! O módulo de saudações salvou minha semana.", timestamp: Date.now() - 3000000 },
    { id: "msg_2", sender: "Youssef Mansour", room: "Sala Brasil", text: "Alguém estudando o alfabeto agora? É bem complicado no começo haha", timestamp: Date.now() - 1500000 },
    { id: "msg_3", sender: "Fatima Santos", room: "Sala Mundo Árabe", text: "Eu amo os ditos populares do Sheikh AI! شكراً جزيلاً!", timestamp: Date.now() - 500000 },
    { id: "msg_4", sender: "Mariana Al-Hassan", room: "Sala Iniciantes", text: "Qual a diferença entre Hadha e Hadhihi de novo? Esqueci", timestamp: Date.now() - 200000 },
  ]);

  if (!profile?.isAdmin) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-950">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <p className="text-rose-400 font-bold text-lg font-display">Acesso Restrito</p>
        <p className="text-xs text-slate-500 mt-2 max-w-md">
          Apenas administradores credenciados e o e-mail oficial podem interagir com estas configurações críticas de servidor.
        </p>
        <button onClick={onBack} className="mt-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2.5 px-5 rounded-xl text-xs font-semibold cursor-pointer transition">
          Voltar para Home
        </button>
      </div>
    );
  }

  // Handle addition of customized lesson
  const handleAddCustomLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonArab.trim() || !newLessonPort.trim()) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const created: Lesson = {
      id: `l_custom_${Date.now()}`,
      moduleId: newLessonModule,
      title: newLessonTitle.trim(),
      description: "Nova lição acoplada remotamente via Painel Admin",
      order: lessonsList.filter((l) => l.moduleId === newLessonModule).length + 1,
      portuguese: newLessonPort.trim(),
      arabic: newLessonArab.trim(),
      pronunciation: newLessonPron.trim() || "Transcrição pendente",
      phraseArabic: "أحب تعلم اللغة العربية",
      phrasePronunciation: "Uhibbu ta'allum al-lughah al-'Arabiyyah",
      phrasePortuguese: "Eu gosto de aprender a língua árabe."
    };

    // Append to static array in session
    setLessonsList((prev) => [...prev, created]);
    const targetModObj = CURRICULUM_MODULES.find((m) => m.id === newLessonModule);
    if (targetModObj) {
      targetModObj.lessons.push(created);
    }

    // Reset fields
    setNewLessonTitle("");
    setNewLessonArab("");
    setNewLessonPort("");
    setNewLessonPron("");
    
    alert("Nova lição acoplada com sucesso!");
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm("Deseja deletar esta lição do syllabus atual?")) {
      setLessonsList((prev) => prev.filter((l) => l.id !== lessonId));
      CURRICULUM_MODULES.forEach((m) => {
        m.lessons = m.lessons.filter((l) => l.id !== lessonId);
      });
    }
  };

  const handleToggleUserPremium = (uid: string) => {
    setSimulatedUsers((prev) => 
      prev.map((u) => u.uid === uid ? { ...u, isPremium: !u.isPremium } : u)
    );
  };

  // Add customized exercise
  const handleAddCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExQuestion.trim() || !newExAnswer.trim()) {
      alert("Enunciado e Resposta Correta são obrigatórios!");
      return;
    }

    const created: Exercise = {
      id: `ex_custom_${Date.now()}`,
      lessonId: exLessonFilter,
      type: newExType,
      question: newExQuestion.trim(),
      arabicContext: newExArabic.trim() || undefined,
      options: newExType === "choice" || newExType === "complete" 
        ? newExOptions.split(",").map(o => o.trim()).filter(o => o.length > 0)
        : undefined,
      correctAnswer: newExAnswer.trim()
    };

    // Push directly to static exported variable in data.ts!
    CUSTOM_ADMIN_EXERCISES.push(created);
    
    // Sync state
    setCustomExercises([...CUSTOM_ADMIN_EXERCISES]);

    // Reset fields
    setNewExQuestion("");
    setNewExArabic("");
    setNewExOptions("");
    setNewExAnswer("");

    alert("Exercício inserido na lição com sucesso!");
  };

  const handleDeleteCustomExercise = (exId: string) => {
    if (window.confirm("Deseja deletar este exercício personalizado?")) {
      const idx = CUSTOM_ADMIN_EXERCISES.findIndex(e => e.id === exId);
      if (idx > -1) {
        CUSTOM_ADMIN_EXERCISES.splice(idx, 1);
        setCustomExercises([...CUSTOM_ADMIN_EXERCISES]);
      }
    }
  };

  const handleDeleteChatMessage = (msgId: string) => {
    if (window.confirm("Deseja remover esta mensagem do Chat Global por violação ou moderação?")) {
      setSimulatedChats(prev => prev.filter(c => c.id !== msgId));
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifHeader.trim() || !notifBody.trim()) return;

    setNotifStatus("Sincronizando push notifications no FCM...");
    setTimeout(() => {
      setNotifStatus(`Sucesso! Notificação disparada para ${simulatedUsers.length} alunos inscritos.`);
      setNotifHeader("");
      setNotifBody("");
    }, 1500);
  };

  // Lessons for current selected module in exercises filter
  const filteredLessonsOfMod = lessonsList.filter(l => l.moduleId === exModuleFilter);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider cursor-pointer bg-slate-900 border border-slate-800 py-2.5 px-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Painel de Aluno
        </button>

        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3.5 py-2 rounded-xl border border-rose-900/40 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5" /> Administrador Master
        </span>
      </div>

      {/* Main Container Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Navigation columns */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { key: "users", title: "Estudantes", icon: <Users className="w-4 h-4" /> },
            { key: "syllabus", title: "Grade Curricular", icon: <BookOpen className="w-4 h-4" /> },
            { key: "exercises", title: "Exercícios Práticos", icon: <CheckSquare className="w-4 h-4" /> },
            { key: "chats", title: "Moderador de Chat", icon: <MessageSquare className="w-4 h-4" /> },
            { key: "stats", title: "Métricas Globais", icon: <TrendingUp className="w-4 h-4" /> },
            { key: "notif", title: "Notificações", icon: <BellRing className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setAdminTab(item.key as any); setNotifStatus(null); }}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                adminTab === item.key 
                ? "bg-rose-950/40 text-rose-400 border border-rose-900/30" 
                : "text-slate-450 hover:text-slate-200 bg-slate-950 hover:bg-slate-900/50 border border-slate-900"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Right Side Dynamic content view */}
        <div className="lg:col-span-9 bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[480px]">
          
          {/* TAB: USERS LIST */}
          {adminTab === "users" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Cadastro de Alunos</h3>
                <p className="text-xs text-slate-500">Acompanhe as inscrições, XP, moedas e níveis dos estudantes matriculados.</p>
              </div>

              <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-450 uppercase tracking-wider text-[10px] bg-slate-950/40">
                      <th className="py-3 px-3">Nome</th>
                      <th className="py-3 px-3">E-mail</th>
                      <th className="py-3 px-3 text-center">Nível</th>
                      <th className="py-3 px-3 text-center">Progresso</th>
                      <th className="py-3 px-3 text-center">Moedas</th>
                      <th className="py-3 px-3 text-center">Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulatedUsers.map((user) => (
                      <tr key={user.uid} className="border-b border-slate-850 hover:bg-slate-950/25 transition">
                        <td className="py-3.5 px-3 font-semibold text-slate-200">{user.name}</td>
                        <td className="py-3.5 px-3 text-slate-400">{user.email}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-gold-500">Nível {user.level}</td>
                        <td className="py-3.5 px-3 text-center text-slate-350">{user.xp} XP</td>
                        <td className="py-3.5 px-3 text-center font-mono text-amber-500 font-bold">🪙 {user.coins}</td>
                        <td className="py-3.5 px-3 text-center">
                          <button 
                            onClick={() => handleToggleUserPremium(user.uid)}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wide transition cursor-pointer ${
                              user.isPremium 
                              ? "bg-gold-500/15 text-gold-400 border border-gold-500/35" 
                              : "bg-slate-900 text-slate-500 border border-slate-800"
                            }`}
                          >
                            {user.isPremium ? "Premium" : "Básico"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SYLLABUS LESSON CREATOR */}
          {adminTab === "syllabus" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Gerenciar Lições do Curso</h3>
                <p className="text-xs text-slate-500">Adicione novos vocabulários e estruturas linguísticas nos módulos.</p>
              </div>

              {/* Form custom addition */}
              <form onSubmit={handleAddCustomLesson} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <p className="text-[10px] font-bold uppercase text-gold-500 tracking-wider">Criar Nova Lição Teórica</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Módulo de Destino</label>
                    <select 
                      value={newLessonModule}
                      onChange={(e) => setNewLessonModule(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/50"
                    >
                      {CURRICULUM_MODULES.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Título Temático</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Lição 3: Cumprimento do Meio Dia"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Escrita Árabe</label>
                    <input 
                      type="text" 
                      placeholder="Ex: صباح الخير"
                      value={newLessonArab}
                      onChange={(e) => setNewLessonArab(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none font-arabic font-semibold focus:border-rose-900/50"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Tradução Oficial</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Bom dia"
                      value={newLessonPort}
                      onChange={(e) => setNewLessonPort(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Pronúncia / Fonética</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Sabaah al-khair"
                      value={newLessonPron}
                      onChange={(e) => setNewLessonPron(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-rose-950/40 text-rose-400 font-extrabold text-xs px-4 py-2.5 border border-rose-900/30 rounded-lg flex items-center gap-1.5 hover:bg-rose-950/60 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Inserir Lição do Módulo
                </button>
              </form>

              {/* View active list */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Lições Existentes na Base ({lessonsList.length})</span>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                  {lessonsList.map((les) => (
                    <div key={les.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">{les.moduleId}</span>
                        <p className="text-xs font-bold text-slate-200">{les.title}</p>
                        <p className="text-[10px] text-slate-450 mt-0.5">Árabe: <span className="font-arabic">{les.arabic}</span> • Fonética: {les.pronunciation}</p>
                      </div>

                      <button 
                        onClick={() => handleDeleteLesson(les.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 transition cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXERCISES PANEL */}
          {adminTab === "exercises" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Banco de Exercícios Práticos</h3>
                <p className="text-xs text-slate-500">Consulte, exclua ou fabrique novas questões de avaliação com escrita e áudio.</p>
              </div>

              {/* Filtering Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">1. Filtrar por Módulo</label>
                  <select
                    value={exModuleFilter}
                    onChange={(e) => {
                      setExModuleFilter(e.target.value);
                      // Update lesson filter to first lesson of this module automatically
                      const firstLes = lessonsList.find(l => l.moduleId === e.target.value);
                      if (firstLes) setExLessonFilter(firstLes.id);
                    }}
                    className="w-full text-xs text-slate-350 bg-slate-900 border border-slate-800 rounded-lg p-2 outline-none"
                  >
                    {CURRICULUM_MODULES.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">2. Selecionar Lição</label>
                  <select
                    value={exLessonFilter}
                    onChange={(e) => setExLessonFilter(e.target.value)}
                    className="w-full text-xs text-slate-350 bg-slate-900 border border-slate-800 rounded-lg p-2 outline-none"
                  >
                    {filteredLessonsOfMod.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                    {filteredLessonsOfMod.length === 0 && (
                      <option value="">Sem lições criadas</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Form creation */}
              <form onSubmit={handleAddCustomExercise} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <p className="text-[10px] font-bold uppercase text-gold-500 tracking-wider">Acoplar Exercício Customizado</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Tipo de Atividade</label>
                    <select
                      value={newExType}
                      onChange={(e) => setNewExType(e.target.value as any)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none"
                    >
                      <option value="choice">Múltipla Escolha (Opções)</option>
                      <option value="complete">Preencher Lacuna (Complete)</option>
                      <option value="translate">Tradução Livre (Escrever tradução)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Lousa / Enunciado PT-BR</label>
                    <input
                      type="text"
                      placeholder="Ex: Como se traduz 'Shukran' em português?"
                      value={newExQuestion}
                      onChange={(e) => setNewExQuestion(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Contexto em Árabe (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: شكراً"
                      value={newExArabic}
                      onChange={(e) => setNewExArabic(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none font-arabic focus:border-rose-900/40"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Resposta Correta</label>
                    <input
                      type="text"
                      placeholder="Ex: Obrigado"
                      value={newExAnswer}
                      onChange={(e) => setNewExAnswer(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/40"
                    />
                  </div>
                </div>

                {(newExType === "choice" || newExType === "complete") && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">
                      Alternativas Erradas / Opções de Preenchimento <span className="text-slate-500 font-sans">(Separadas por vírgulas)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: De nada, Olá, Água, Por favor (Nota: inclua também a resposta correta no meio)"
                      value={newExOptions}
                      onChange={(e) => setNewExOptions(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-rose-900/40"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-rose-950/40 text-rose-400 font-extrabold text-xs px-4 py-2.5 border border-rose-900/30 rounded-lg flex items-center gap-1.5 hover:bg-rose-950/60 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar Exercício Prático
                </button>
              </form>

              {/* List Exercises inside currently selected filters */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Exercícios Vinculados a esta Lição</span>
                
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {/* Load exercises dynamically */}
                  {exLessonFilter ? (
                    GET_LESSON_EXERCISES(exLessonFilter).map((ex, idx) => {
                      const isCustom = ex.id.startsWith("ex_custom_");
                      return (
                        <div key={ex.id} className="p-3.5 bg-slate-950/50 border border-slate-850 rounded-xl flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-slate-500">QUESTÃO #{idx + 1}</span>
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                isCustom 
                                  ? "bg-rose-950/50 text-rose-400 border border-rose-900/30" 
                                  : "bg-slate-900 text-slate-500 border border-slate-800"
                              }`}>
                                {isCustom ? "Customizada / Admin" : "Padrão / Estática"}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200">{ex.question}</p>
                            <p className="text-[10px] text-slate-450 mt-1">Resposta Correta: <span className="font-bold text-emerald-400 font-sans">{ex.correctAnswer}</span></p>
                          </div>

                          {isCustom && (
                            <button
                              onClick={() => handleDeleteCustomExercise(ex.id)}
                              className="text-slate-500 hover:text-rose-400 p-2 transition cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500">Escolha uma lição para visualizar os exercícios.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MODERATION OF GLOBAL CHATS */}
          {adminTab === "chats" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Mural & Moderador de Bate-Papo</h3>
                <p className="text-xs text-slate-500">Acompanhe as interações dos alunos nas salas globais e remova mensagens fora de conduta.</p>
              </div>

              <div className="space-y-3.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mensagens Recentes nas Salas ({simulatedChats.length})</span>
                
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {simulatedChats.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-slate-200">{c.sender}</span>
                          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {c.room}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">"{c.text}"</p>
                        <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> há {Math.floor((Date.now() - c.timestamp) / 60000)} minutos
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteChatMessage(c.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 bg-slate-950 border border-slate-900 rounded-lg hover:border-rose-900/25 transition cursor-pointer shrink-0"
                        title="Banir/Remover mensagem"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}

                  {simulatedChats.length === 0 && (
                    <div className="text-center py-12 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                      <p className="text-xs text-slate-500">Nenhuma mensagem registrada no mural de bate-papo de estudantes.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL STATS & COMPLETED PLATES */}
          {adminTab === "stats" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Métricas de Engajamento</h3>
                <p className="text-xs text-slate-500">Monitore dados de retenção, emissão de medalhas e volume diário do Sheikh AI.</p>
              </div>

              {/* Simple illustrative high fidelity dynamic bar analytics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Matrículas Ativas", val: "145", change: "+12% mês" },
                  { title: "Tokens Sheikh AI", val: "38.5k", change: "Faturamento OK" },
                  { title: "XP Distribuído", val: "4.3k XP", change: "+450 XP sem" },
                  { title: "Faturamento Premium", val: "R$ 1.950", change: "Mediana R$39" }
                ].map((s) => (
                  <div key={s.title} className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.title}</p>
                    <p className="text-xl font-extrabold text-white mt-1">{s.val}</p>
                    <p className="text-[9px] text-emerald-400 mt-1 font-sans">{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Simulated Chart visual using basic responsive SVG design */}
              <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-display">XP Diário Médio Distribuído</span>
                  <span className="text-xs text-slate-405 font-medium">Médias de engajamento</span>
                </div>

                <div className="h-44 w-full flex items-end gap-3 px-2">
                  {[
                    { day: "Seg", h: "40%", xp: "210 XP" },
                    { day: "Ter", h: "65%", xp: "340 XP" },
                    { day: "Qua", h: "50%", xp: "280 XP" },
                    { day: "Qui", h: "90%", xp: "480 XP" },
                    { day: "Sex", h: "75%", xp: "390 XP" },
                    { day: "Sáb", h: "35%", xp: "180 XP" },
                    { day: "Dom", h: "60%", xp: "310 XP" }
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <span className="text-[9px] text-gold-500 font-semibold opacity-0 group-hover:opacity-100 transition duration-300">{bar.xp}</span>
                      <div 
                        style={{ height: bar.h }}
                        className="w-full bg-gradient-to-t from-rose-950/50 to-rose-900 border border-rose-900/40 rounded-t-lg hover:from-gold-650 hover:to-gold-500 transition duration-300 cursor-pointer"
                      ></div>
                      <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS SENDER */}
          {adminTab === "notif" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Serviço de Push Notifications</h3>
                <p className="text-xs text-slate-500">Dispare alertas de incentivo e avisos acadêmicos para a tela bloqueada dos estudantes.</p>
              </div>

              {notifStatus && (
                <div className="p-3.5 rounded-lg text-xs font-semibold bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {notifStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Assunto da Mensagem (FCM Heading)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Não quebre seu streak de árabe hoje!"
                      value={notifHeader}
                      onChange={(e) => setNotifHeader(e.target.value)}
                      className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-850 rounded-xl p-3.5 outline-none focus:border-rose-900/60 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Corpo do Push (Max 150 car.)</label>
                    <textarea 
                      placeholder="Ex: Seu amigo de estudos Leandro está progredindo rápido! Faça a lição do Módulo 3 em menos de 1 minuto."
                      value={notifBody}
                      rows={4}
                      onChange={(e) => setNotifBody(e.target.value)}
                      className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-850 rounded-xl p-3.5 outline-none focus:border-rose-900/60 transition font-sans"
                      maxLength={150}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#d4b574] hover:bg-gold-500 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-xl transition duration-200 cursor-pointer shadow"
                  >
                    Emitir Alerta Acadêmico Instantâneo
                  </button>
                </form>

                {/* Simulated cellular mockup for high fidelity feel */}
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-inner relative max-w-sm mx-auto">
                  <div className="flex justify-center mb-1">
                    <div className="w-16 h-4 bg-slate-900 rounded-full border border-slate-805"></div>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2 relative shadow-md">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gold-500" />
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Arabic Master • Agora</span>
                    </div>

                    <h5 className="text-xs font-bold text-white truncate">{notifHeader || "Hora de treinar!"}</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{notifBody || "Corpo simulado da notificação que lembrará seus estudantes sobre a lição atual..."}</p>
                  </div>

                  <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-semibold mt-4">Simulação de Tela Celular</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
