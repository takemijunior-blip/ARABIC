import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { CURRICULUM_MODULES } from "../data";
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
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  onBack: () => void;
}

// Pre-packaged simulated user lists for administrative demonstration
const INITIAL_USERS = [
  { uid: "usr_1", name: "Gabriel Al-Cury", email: "alcurygabriel@gmail.com", level: 12, xp: 1100, isPremium: true, date: "2026-06-01" },
  { uid: "usr_2", name: "Youssef Mansour", email: "youssef@egito.com", level: 15, xp: 1450, isPremium: true, date: "2026-05-28" },
  { uid: "usr_3", name: "Fatima Santos", email: "fatimaria@uol.com.br", level: 9, xp: 820, isPremium: false, date: "2025-06-03" },
  { uid: "usr_4", name: "Mariana Al-Hassan", email: "marihassan@bol.com.br", level: 6, xp: 550, isPremium: false, date: "2026-06-03" },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { profile } = useAuth();
  
  const [adminTab, setAdminTab] = useState<"users" | "syllabus" | "stats" | "notif">("users");
  
  // Lesson creator form states
  const [newLessonModule, setNewLessonModule] = useState("modulo_1");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonPort, setNewLessonPort] = useState("");
  const [newLessonArab, setNewLessonArab] = useState("");
  const [newLessonPron, setNewLessonPron] = useState("");

  // Notification form states
  const [notifHeader, setNotifHeader] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  // Dynamic Syllabus addition handler
  const [lessonsList, setLessonsList] = useState<Lesson[]>(
    CURRICULUM_MODULES.flatMap((m) => m.lessons)
  );

  const [simulatedUsers, setSimulatedUsers] = useState(INITIAL_USERS);

  if (!profile?.isAdmin) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-950">
        <p className="text-rose-400 font-bold text-lg">Acesso Restrito</p>
        <p className="text-xs text-slate-500 mt-2">Apenas o email definido pelo proprietário possui privilégios de sistema.</p>
        <button onClick={onBack} className="mt-4 bg-slate-900 border border-slate-800 text-slate-300 py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer">
          Voltar
        </button>
      </div>
    );
  }

  // Handle addition of customize lesson
  const handleAddCustomLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonArab.trim() || !newLessonPort.trim()) {
      alert("Preencha todos os campos fundamentais!");
      return;
    }

    const created: Lesson = {
      id: `l_custom_${Date.now()}`,
      moduleId: newLessonModule,
      title: newLessonTitle.trim(),
      description: "Nova lição adicionada do Painel do Administrador",
      order: lessonsList.filter((l) => l.moduleId === newLessonModule).length + 1,
      portuguese: newLessonPort.trim(),
      arabic: newLessonArab.trim(),
      pronunciation: newLessonPron.trim() || "Transcrição pendente"
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
    
    alert("Nova lição acoplada ao currículo com sucesso!");
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

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifHeader.trim() || !notifBody.trim()) return;

    setNotifStatus("Emitindo notificação instantânea para toda a base...");
    setTimeout(() => {
      setNotifStatus(`Sucesso! Notificação "${notifHeader}" enviada com êxito!`);
      setNotifHeader("");
      setNotifBody("");
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider cursor-pointer bg-slate-900 border border-slate-800 py-2 px-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Painel de Aluno
        </button>

        <span className="text-xs font-bold text-rose-400 bg-rose-950/20 px-3.5 py-1.5 rounded-xl border border-rose-900/40 tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> Proprietário Administrativo
        </span>
      </div>

      {/* Main Container Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation columns */}
        <div className="md:col-span-3 space-y-2">
          {[
            { key: "users", title: "Usuários", icon: <Users className="w-4.5 h-4.5" /> },
            { key: "syllabus", title: "Grade Curricular", icon: <BookOpen className="w-4.5 h-4.5" /> },
            { key: "stats", title: "Métricas Globais", icon: <TrendingUp className="w-4.5 h-4.5" /> },
            { key: "notif", title: "Notificações", icon: <BellRing className="w-4.5 h-4.5" /> }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setAdminTab(item.key as any); setNotifStatus(null); }}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                adminTab === item.key 
                ? "bg-rose-950/40 text-rose-400 border border-rose-950" 
                : "text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-850"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic content view */}
        <div className="md:col-span-9 bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[400px]">
          
          {/* TAB: USERS LIST */}
          {adminTab === "users" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Cadastro de Estudantes</h3>
                <p className="text-xs text-slate-500">Acompanhe as inscrições, XP e streaks dos alunos de árabe do Brasil.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-2">Nome</th>
                      <th className="py-3 px-2">E-mail</th>
                      <th className="py-3 px-2 text-center">Nível</th>
                      <th className="py-3 px-2 text-center">XP Total</th>
                      <th className="py-3 px-2 text-center">Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulatedUsers.map((user) => (
                      <tr key={user.uid} className="border-b border-slate-850 hover:bg-slate-950/25 transition">
                        <td className="py-3 px-2 font-semibold text-slate-200">{user.name}</td>
                        <td className="py-3 px-2 text-slate-400">{user.email}</td>
                        <td className="py-3 px-2 text-center font-bold text-slate-300">{user.level}</td>
                        <td className="py-3 px-2 text-center text-slate-300">{user.xp} XP</td>
                        <td className="py-3 px-2 text-center">
                          <button 
                            onClick={() => handleToggleUserPremium(user.uid)}
                            className={`p-1.5 px-3 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer ${
                              user.isPremium 
                              ? "bg-gold-500/10 text-gold-500 border border-gold-500/25" 
                              : "bg-slate-950 text-slate-500 border border-slate-850"
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
                <p className="text-xs text-slate-500">Adicione novos vocabulários e estruturas gramaticais nos módulos.</p>
              </div>

              {/* Form custom addition */}
              <form onSubmit={handleAddCustomLesson} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4">
                <p className="text-[10px] font-bold uppercase text-gold-500 tracking-wider">Criar Nova Lição Prática</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Módulo de Encaixe</label>
                    <select 
                      value={newLessonModule}
                      onChange={(e) => setNewLessonModule(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none"
                    >
                      {CURRICULUM_MODULES.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Título Temático</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Lição 5: Gírias de Mercado"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Escrita Árabe</label>
                    <input 
                      type="text" 
                      placeholder="Ex: الحليب"
                      value={newLessonArab}
                      onChange={(e) => setNewLessonArab(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none font-arabic font-semibold"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Significado Literário</label>
                    <input 
                      type="text" 
                      placeholder="Ex: O Leite"
                      value={newLessonPort}
                      onChange={(e) => setNewLessonPort(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Pronúncia / Fonologia</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Al-halib"
                      value={newLessonPron}
                      onChange={(e) => setNewLessonPron(e.target.value)}
                      className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2.5 outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-rose-950/30 text-rose-400 font-extrabold text-xs px-4 py-2.5 border border-rose-900/50 rounded-lg flex items-center gap-1 hover:bg-rose-950/50 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Adicionar ao Currículo
                </button>
              </form>

              {/* View active list */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Lista de Lições Existentes ({lessonsList.length})</span>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {lessonsList.map((les) => (
                    <div key={les.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200">{les.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Árabe: {les.arabic} • Tradução: {les.portuguese}</p>
                      </div>

                      <button 
                        onClick={() => handleDeleteLesson(les.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL STATS & COMPLETED PLATES */}
          {adminTab === "stats" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Métricas de Rendimento de Alunos</h3>
                <p className="text-xs text-slate-500">Avalie as horas de engajamento, metas de XP e crescimento de conexões.</p>
              </div>

              {/* Simple illustrative high fidelity dynamic bar analytics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Inscrições Junho", val: "145", change: "+12% mês" },
                  { title: "Sessões Ativas D3", val: "54", change: "+4% hoje" },
                  { title: "Total XP Distribuído", val: "4.3k XP", change: "+450 XP sem" },
                  { title: "Medianas Ativas", val: "4.2 Dias", change: "Estável" }
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
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-display">Meta de XP Semanal de Estudantes</span>
                  <span className="text-xs text-slate-400 font-medium">Médias de engajamento</span>
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
                        className="w-full bg-gradient-to-t from-rose-950/50 to-rose-900 border border-rose-900/40 rounded-t-md hover:from-gold-600 hover:to-gold-500 transition duration-300 cursor-pointer"
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
                <p className="text-xs text-slate-500">Publique lembretes cordiais de manutenção de streaks para motivar os usuários no celular.</p>
              </div>

              {notifStatus && (
                <div className="p-3.5 rounded-lg text-xs font-semibold bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {notifStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Assunto / Heading</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Hora de estudar o Alfabeto Árabe!"
                      value={notifHeader}
                      onChange={(e) => setNotifHeader(e.target.value)}
                      className="w-full text-xs text-slate-200 bg-slate-950 border border-slate-850 rounded-xl p-3.5 outline-none focus:border-rose-900/60 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Conteúdo Curto / Body</label>
                    <textarea 
                      placeholder="Ex: Não perca seu streak de 5 dias ativos hoje ya habibi! Estude cores e substantivos agora!"
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
                    Disparar Notificação Instantânea
                  </button>
                </form>

                {/* Simulated cellular mockup for high fidelity feel */}
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-inner relative max-w-xs mx-auto">
                  <div className="flex justify-center mb-1">
                    <div className="w-16 h-4 bg-slate-900 rounded-full border border-slate-805"></div>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2 relative shadow-md">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gold-500" />
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Arabic Master • Agora</span>
                    </div>

                    <h5 className="text-xs font-bold text-white truncate">{notifHeader || "Título da Notificação"}</h5>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{notifBody || "Mensagem simulada do professor para manutenção rápida de streaks e XP..."}</p>
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
