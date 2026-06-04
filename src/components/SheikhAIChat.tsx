import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { ChatMessage } from "../types";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from "firebase/firestore";
import { 
  Send, 
  Sparkles, 
  ArrowLeft, 
  HelpCircle, 
  Volume2, 
  CheckCircle2, 
  BookOpen, 
  Bookmark,
  Languages,
  BadgeCheck,
  MessageSquare,
  Globe,
  Compass,
  CornerDownRight,
  ShieldAlert,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SheikhAIChatProps {
  onBack: () => void;
}

interface GlobalChatMessage {
  id: string;
  senderName: string;
  senderUid: string;
  text: string;
  timestamp: number;
  isPremium?: boolean;
  level?: number;
}

// Custom component to render basic markdown elements securely in React 19
const CustomMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parseParagraphs = text.split("\n\n");
  
  return (
    <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
      {parseParagraphs.map((para, pIdx) => {
        if (!para.trim()) return null;
        
        // Check if paragraph is list items
        if (para.startsWith("- ") || para.startsWith("* ")) {
          const listItems = para.split(/\n[\-\*]\s/);
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-slate-300">
              {listItems.map((item, iIdx) => {
                const cleanedItem = item.replace(/^[\-\*]\s/, "");
                return (
                  <li key={iIdx}>
                    {renderBoldItems(cleanedItem)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if starting with header ## 
        if (para.startsWith("##")) {
          return (
            <h4 key={pIdx} className="font-display font-bold text-[#d4b574] text-sm/relaxed sm:text-base border-b border-slate-800 pb-1 mt-4">
              {renderBoldItems(para.replace(/^##\s*/, ""))}
            </h4>
          );
        }
        
        return (
          <p key={pIdx}>
            {renderBoldItems(para)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to replace **text** with corresponding React bold components
function renderBoldItems(line: string) {
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) {
    return line;
  }
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <strong key={idx} className="text-white font-extrabold">{part}</strong>;
    }
    return part;
  });
}

// Pre-packaged high fidelity background seed conversations to make each room feel real and supportive
const SEED_ROOM_MESSAGES: { [key: string]: GlobalChatMessage[] } = {
  iniciantes: [
    { id: "im_1", senderName: "Aline Ramos", senderUid: "s_1", text: "Salam! Como é que vocês decoraram a ordem das primeiras três letras? Tenho dificuldades no Alif, Ba, Ta.", timestamp: Date.now() - 3600000 * 2, level: 1, isPremium: false },
    { id: "im_2", senderName: "Marcos Pinheiro", senderUid: "s_2", text: "Oi Aline! Eu criei um cartão mnemônico: o 'Ba' tem um ponto embaixo (como um barco), o 'Ta' tem dois pontos em cima (dois olhos). Ajuda muito!", timestamp: Date.now() - 3600000 * 1.8, level: 3, isPremium: true },
    { id: "im_3", senderName: "Carla Souza", senderUid: "s_3", text: "Excelente dica Marcos! Eu estava travada no Ta marbuta também.", timestamp: Date.now() - 3600000 * 0.5, level: 2, isPremium: false }
  ],
  intermediario: [
    { id: "int_1", senderName: "Julío Cézar", senderUid: "s_4", text: "Gente, os exercícios de cores e as vestes masculinas no Módulo 6 exigem muita atenção às formas femininas das cores. Fiquem atentos!", timestamp: Date.now() - 3600000 * 4, level: 6, isPremium: true },
    { id: "int_2", senderName: "Sandro Moçambique", senderUid: "s_5", text: "Verdade Julío! Por exemplo, vermelho é 'Ahmar' para masculino e 'Hamra' para feminino. Fascinante a fonética!", timestamp: Date.now() - 3600000 * 2, level: 5, isPremium: false }
  ],
  avancado: [
    { id: "av_1", senderName: "Dr. Khaled", senderUid: "s_6", text: "أهلاً ومرحباً بكم في الصالون الأدبي! (Olá e bem-vindos ao salão literário!) Alguém aqui já consegue ler crônicas de jornais de Dubai?", timestamp: Date.now() - 3600000 * 5, level: 14, isPremium: true },
    { id: "av_2", senderName: "Sofia Santos", senderUid: "s_7", text: "Estou a tentar formular parágrafos completos sobre as minhas viagens ao Líbano, mas a sintaxe das orações relativas ainda me desafia um bocado.", timestamp: Date.now() - 3600000 * 1, level: 11, isPremium: true }
  ],
  brasil: [
    { id: "br_1", senderName: "Thiago Silva", senderUid: "s_8", text: "Fala galera do Brasil! Aprendendo árabe para fazer negócios em Abu Dhabi. Esse app é diferenciado!", timestamp: Date.now() - 3600000 * 12, level: 4, isPremium: false },
    { id: "br_2", senderName: "Yasmin Alencar", senderUid: "s_9", text: "Oi Tiago! Estou a aprender por causa da minha família de ascendência síria, todos falam árabe em casa e eu me sentia de fora. Agora estou a acompanhar!", timestamp: Date.now() - 3600000 * 6, level: 5, isPremium: true }
  ],
  portugal: [
    { id: "pt_1", senderName: "António Meireles", senderUid: "s_10", text: "Boas Alunos! Estou a preparar uma viagem de férias em Marrocos em Setembro, o Sheikh ensinou-me frases de aeroporto fantásticas.", timestamp: Date.now() - 3600000 * 24, level: 3, isPremium: false },
    { id: "pt_2", senderName: "Joana Moreira", senderUid: "s_11", text: "António, recomendo muito o módulo 12 'Conversas Reais: Hotel e Táxi'. Vais precisar imenso para negociar na Medina!", timestamp: Date.now() - 3600000 * 18, level: 7, isPremium: true }
  ],
  mocambique: [
    { id: "mz_1", senderName: "Zacarias Maputo", senderUid: "s_12", text: "Saudações colegas de Moçambique! Há alguém aqui de Nampula? O Sheikh AI ajudou-me a escrever um e-mail profissional em árabe hoje.", timestamp: Date.now() - 3600000 * 8, level: 8, isPremium: true },
    { id: "mz_2", senderName: "Amara Chimoio", senderUid: "s_13", text: "Que espetáculo Zacarias! Eu sou da Beira, estou a focar no vocabulário de comércio e alimentação.", timestamp: Date.now() - 3600000 * 4, level: 4, isPremium: false }
  ],
  mundo_arabe: [
    { id: "ma_1", senderName: "Youssef Cairo", senderUid: "s_14", text: "مرحبا بكم يا شباب! (Bem-vindos, jovens!) Se quiserem gírias egípcias, basta pedirem ao Sheikh 'Ensina-me dialeto amiya egípcio!'", timestamp: Date.now() - 3600000 * 10, level: 15, isPremium: true },
    { id: "ma_2", senderName: "Fatima Beirute", senderUid: "s_15", text: "Ahlan Youssef! A culinária árabe também é uma ótima forma de treinar. O módulo de alimentos está super completo.", timestamp: Date.now() - 3600000 * 5, level: 12, isPremium: false }
  ]
};

export const SheikhAIChat: React.FC<SheikhAIChatProps> = ({ onBack }) => {
  const { profile, isGuest, addXp, addCoins } = useAuth();
  
  // Tabs: "sheikh" (AI Chat) or "global" (Community Chats)
  const [chatTab, setChatTab] = useState<"sheikh" | "global">("sheikh");
  
  // AI Sheikh state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeAction, setActiveAction] = useState<"chat" | "pronunciation" | "writing" | "grammar" | "custom_exercises">("chat");

  // Global community chat state
  const [selectedRoom, setSelectedRoom] = useState<string>("iniciantes");
  const [globalMessages, setGlobalMessages] = useState<GlobalChatMessage[]>([]);
  const [globalInput, setGlobalInput] = useState("");

  const messageEndRef = useRef<HTMLDivElement>(null);
  const globalEndRef = useRef<HTMLDivElement>(null);

  // Load air chat cache on mount
  useEffect(() => {
    if (chatTab === "sheikh") {
      const key = isGuest ? "arabic_master_guest_chat" : `arabic_master_user_chat_${profile?.uid}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const defaultMsg: ChatMessage = {
          id: "sheikh_starter",
          sender: "ai",
          text: `أهلاً وسهلاً! Seja muito bem-vindo ao meu escritório de estudos literários! Eu sou o seu **Sheikh AI**, professor virtual de árabe clássico.

Estou aqui para ajudá-lo a dominar esta bela língua. Você pode usar meus recursos automáticos na barra superior ou me enviar qualquer pergunta! 

Experimente um dos comandos sugeridos:
- **Explicar Gramática**: "Explique como funciona o pronome demonstrativo 'Hadha'!"
- **Corrigir Escrita**: Envie uma frase árabe e avaliarei a sintaxe.
- **Criar Exercícios**: "Gere exercícios sobre saudações!"`,
          timestamp: Date.now()
        };
        setMessages([defaultMsg]);
      }
    }
  }, [profile, isGuest, chatTab]);

  // Real-time listener for current Selected Room in Firebase Firestore 
  useEffect(() => {
    if (chatTab !== "global") return;
    
    setGlobalMessages(SEED_ROOM_MESSAGES[selectedRoom] || []); // Set default mock seed immediately!
    
    let unsubscribe: () => void = () => {};
    
    try {
      const q = query(
        collection(db, "global_chats"),
        where("room", "==", selectedRoom),
        orderBy("timestamp", "asc"),
        limit(50)
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              senderName: data.senderName || "Estudante",
              senderUid: data.senderUid || "",
              text: data.text || "",
              timestamp: data.timestamp || Date.now(),
              isPremium: data.isPremium || false,
              level: data.level || 1
            } as GlobalChatMessage;
          });
          
          // Merge static seeds with firestore messages avoiding duplicates
          const seeds = SEED_ROOM_MESSAGES[selectedRoom] || [];
          const combined = [...seeds];
          
          fetched.forEach(msg => {
            if (!combined.some(c => c.text === msg.text && Math.abs(c.timestamp - msg.timestamp) < 5000)) {
              combined.push(msg);
            }
          });
          
          setGlobalMessages(combined);
        }
      }, (error) => {
        console.warn("Firestore listener restricted or offline. Displaying local cache seeds.", error);
      });
    } catch (err) {
      console.warn("Could not initiate onSnapshot listener, continuing with seed fallbacks.", err);
    }
    
    return () => {
      unsubscribe();
    };
  }, [chatTab, selectedRoom]);

  // Sync cache on modification
  const saveMessagesToCache = (newMsgs: ChatMessage[]) => {
    const key = isGuest ? "arabic_master_guest_chat" : `arabic_master_user_chat_${profile?.uid}`;
    localStorage.setItem(key, JSON.stringify(newMsgs));
  };

  // Scroll to bottoms safely
  useEffect(() => {
    if (chatTab === "sheikh") {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      globalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, globalMessages, isTyping, chatTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isTyping) return;

    setInputText("");
    
    const userMsg: ChatMessage = {
      id: `m_${Date.now()}_u`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: Date.now()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessagesToCache(updated);
    setIsTyping(true);

    try {
      const response = await fetch("/api/sheikh-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: activeAction,
          message: textToSend.trim(),
          history: updated
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao receber conselho do Sheikh.");
      }

      const data = await response.json();
      
      const teacherMsg: ChatMessage = {
        id: `m_${Date.now()}_ai`,
        sender: "ai",
        text: data.text,
        timestamp: Date.now()
      };

      const finalMsgs = [...updated, teacherMsg];
      setMessages(finalMsgs);
      saveMessagesToCache(finalMsgs);
      
      await addXp(5);
      if (profile && profile.coins !== undefined) {
        await addCoins(3);
      }
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `m_${Date.now()}_err`,
        sender: "ai",
        text: "Desculpe, meu nobre aluno. Ocorreu um contratempo de conexão ao consultar meus pergaminhos de sabedoria. Verifique se sua chave GEMINI_API_KEY está configurada no painel de segredos.",
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Post community message
  const handleSendGlobalMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalInput.trim() || !profile) return;
    
    const textToSend = globalInput.trim();
    setGlobalInput("");

    const newMsgItem = {
      senderName: profile.name,
      senderUid: profile.uid,
      text: textToSend,
      room: selectedRoom,
      timestamp: Date.now(),
      isPremium: !!profile.isPremium,
      level: profile.level || 1
    };

    // Optimistically add to local UI list
    setGlobalMessages(prev => [...prev, {
      id: `local_${Date.now()}`,
      ...newMsgItem
    }]);

    // Send to cloud database asynchronously
    try {
      await addDoc(collection(db, "global_chats"), newMsgItem);
    } catch (err) {
      console.warn("Could not post global chat message to Firebase Firestore. Continuing with local sync.", err);
    }

    // Award XP and coin rewards for contribution!
    await addXp(5);
    await addCoins(1); // Give 1 Coin per social interaction!
  };

  const handleClearHistory = () => {
    if (window.confirm("Deseja apagar o histórico de mentoria com o Sheikh AI?")) {
      const key = isGuest ? "arabic_master_guest_chat" : `arabic_master_user_chat_${profile?.uid}`;
      localStorage.removeItem(key);
      const resetMsg: ChatMessage = {
        id: "sheikh_reset",
        sender: "ai",
        text: "Histórico limpo! Como posso guiar seus estudos de árabe clássico a partir de agora?",
        timestamp: Date.now()
      };
      setMessages([resetMsg]);
    }
  };

  const handleTemplateClick = (text: string, actionKey: typeof activeAction) => {
    setActiveAction(actionKey);
    handleSendMessage(text);
  };

  const ROOMS = [
    { id: "iniciantes", title: "Iniciantes 🔰", section: "Níveis de Ensino" },
    { id: "intermediario", title: "Intermediário 📈", section: "Níveis de Ensino" },
    { id: "avancado", title: "Avançado 🏆", section: "Níveis de Ensino" },
    { id: "brasil", title: "Brasil 🇧🇷", section: "Salas de Países" },
    { id: "portugal", title: "Portugal 🇵🇹", section: "Salas de Países" },
    { id: "mocambique", title: "Moçambique 🇲🇿", section: "Salas de Países" },
    { id: "mundo_arabe", title: "Mundo Árabe 🐪", section: "Geográfico" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] min-h-[550px]">
      
      {/* Top Navigation banner with segmented tabs toggle */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-t-2xl shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title details */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              MÓDULO 21 <span className="text-slate-500">•</span> Área de Bate-Papo
            </h3>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Social e Mentoria Especialista</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex gap-1 w-full sm:w-auto self-stretch sm:self-auto shrink-0">
          <button
            onClick={() => setChatTab("sheikh")}
            className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
              chatTab === "sheikh" 
                ? "bg-gold-600 text-slate-950" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>👳🏽‍♂️</span>
            <span>Sheikh AI</span>
          </button>

          <button
            onClick={() => setChatTab("global")}
            className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
              chatTab === "global" 
                ? "bg-gold-600 text-slate-950" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>👥</span>
            <span>Chat Global</span>
          </button>
        </div>
      </div>

      {/* VIEW: 👳🏽‍♂️ SHEIKH PROMPT CHAT */}
      {chatTab === "sheikh" && (
        <>
          {/* Mode selectors bar */}
          <div className="bg-slate-950 border-x border-slate-800 p-2 shrink-0 flex gap-1 overflow-x-auto scrollbar-none border-b border-slate-850">
            {[
              { key: "chat", title: "Chat Livre", icon: "💬" },
              { key: "grammar", title: "Gramática", icon: "📖" },
              { key: "pronunciation", title: "Pronúncia", icon: "🔊" },
              { key: "writing", title: "Escrita", icon: "✍️" },
              { key: "custom_exercises", title: "Pedir Teste", icon: "🧩" }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveAction(item.key as any)}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeAction === item.key 
                  ? "bg-[#c5a85c] text-slate-950 shadow font-extrabold" 
                  : "text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-slate-850"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* Chat scroll space */}
          <div className="flex-1 bg-slate-950 border-x border-slate-800 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 border text-sm ${
                    isUser 
                    ? "bg-slate-850 border-slate-750 text-gold-500 font-bold" 
                    : "bg-slate-900 border-gold-500/20 text-lg"
                  }`}>
                    {isUser ? profile?.name?.slice(0, 1).toUpperCase() || "E" : "👳🏽‍♂️"}
                  </div>

                  <div className={`p-4 rounded-2xl shadow ${
                    isUser 
                      ? "bg-gold-600 text-slate-950 rounded-tr-none font-medium text-xs sm:text-sm" 
                      : "bg-slate-900 text-slate-100 rounded-tl-none border border-slate-850"
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <CustomMarkdownRenderer text={msg.text} />
                    )}
                    
                    <span className={`block text-[8px] text-right mt-1.5 ${isUser ? "text-slate-950/50" : "text-slate-500"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3.5 mr-auto max-w-[80%] animate-pulse">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-900 border border-gold-500/10 flex items-center justify-center shrink-0">
                  👳🏽‍♂️
                </div>
                <div className="bg-slate-900 text-slate-450 p-4 rounded-2xl rounded-tl-none border border-slate-850 flex items-center gap-2 text-xs">
                  <span>Sábio Sheikh está consultando as escrituras acadêmicas...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Guided quick actions templates suggestion block */}
          {messages.length <= 2 && (
            <div className="bg-slate-950 border-x border-slate-800 p-3 shrink-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Tópicos Sugeridos
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onClick={() => handleTemplateClick("Como pronunciar as vogais curtas (Damma, Fatha e Kasra)?", "pronunciation")}
                  className="text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-850 text-xs text-slate-300 hover:border-gold-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-slate-500" /> Sons das vogais curtas árabes
                </button>
                <button 
                  onClick={() => handleTemplateClick("Me fale sobre as regras gramaticais do Gênero Masculino e Feminino", "grammar")}
                  className="text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-850 text-xs text-slate-300 hover:border-gold-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" /> Regras de Masculino e Feminino
                </button>
              </div>
            </div>
          )}

          {/* Bottom input section */}
          <div className="bg-slate-905 border border-slate-800 p-4 rounded-b-2xl shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder={
                  activeAction === "pronunciation" ? "Insira transliteração para o Sheikh avaliar sua pronúncia..." :
                  activeAction === "writing" ? "Escreva sua frase em árabe para a avaliação sintática..." :
                  activeAction === "grammar" ? "Qual regra gramatical deseja detalhar?" :
                  activeAction === "custom_exercises" ? "Sobre qual tema de vocabulário quer exercícios?" :
                  "Pergunte em português ou árabe para o Sábio Sheikh..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:border-gold-500/60 font-sans transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-gold-600 hover:bg-gold-500 disabled:bg-slate-900 disabled:text-slate-600 border-none text-slate-950 px-4 sm:px-5 rounded-xl transition cursor-pointer shadow flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2.5 px-1">
              <span className="text-[9px] text-slate-550 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5 text-[#d4b574] inline" /> conversa +3 moedas • +5 XP
              </span>

              <button 
                onClick={handleClearHistory}
                className="text-[9px] font-bold uppercase tracking-wide text-slate-500 hover:text-rose-400 bg-slate-950 px-3.5 py-1 rounded-md border border-slate-850 hover:border-rose-900/20 cursor-pointer transition"
              >
                Limpar histórico
              </button>
            </div>
          </div>
        </>
      )}

      {/* VIEW: 👥 COMMUNITY GLOBAL CHATS */}
      {chatTab === "global" && (
        <div className="flex-1 flex flex-col md:flex-row bg-slate-950 border-x border-slate-800 overflow-hidden h-full">
          
          {/* Left panel / Drawer: Room selector */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-850 p-3 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2.5 scrollbar-none">
            <div className="hidden md:block pb-2">
              <span className="text-[10px] font-bold text-slate-505 uppercase tracking-widest block font-display">Salas de Interação</span>
              <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Conecte-se com alunos para tirar dúvidas literárias.</p>
            </div>

            {/* Render grouped rooms */}
            {["Níveis de Ensino", "Salas de Países", "Geográfico"].map((sec) => (
              <div key={sec} className="flex md:flex-col items-center md:items-stretch gap-1.5 shrink-0">
                <span className="hidden md:block text-[8px] font-extrabold uppercase text-gold-500/65 tracking-wider mt-2.5 px-2">
                  {sec}
                </span>

                {ROOMS.filter(r => r.section === sec).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`py-2 px-3 text-left rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                      selectedRoom === room.id 
                        ? "bg-slate-900 text-[#d4b574] border border-gold-550/15 font-extrabold" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                    }`}
                  >
                    <span>{room.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Right chat panel */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/20">
            {/* Header info of active room */}
            <div className="p-3 bg-slate-900/40 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Conversação em {ROOMS.find(r => r.id === selectedRoom)?.title}
                  </h4>
                  <p className="text-[9px] text-slate-500">Membros de Moçambique, Brasil, Portugal e outros cantos ativos.</p>
                </div>
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30 animate-pulse">
                • ONLINE
              </span>
            </div>

            {/* Messages scrolling stack */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {globalMessages.map((msg) => {
                const isMe = msg.senderUid === profile?.uid;
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-3 max-w-[85%] ${
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* User profile avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border ${
                      isMe 
                        ? "bg-gold-500/15 border-gold-500/30 text-gold-400" 
                        : "bg-slate-90% border-slate-800 text-slate-300"
                    }`}>
                      {msg.senderName.slice(0, 1).toUpperCase()}
                    </div>

                    {/* Speech card */}
                    <div className={`p-3.5 rounded-2xl ${
                      isMe 
                        ? "bg-gold-600 text-slate-950 rounded-tr-none font-medium text-xs sm:text-sm" 
                        : "bg-slate-900/80 text-slate-150 rounded-tl-none border border-slate-850 text-xs sm:text-sm"
                    }`}>
                      {/* Name of sender */}
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-extrabold text-[10px] text-white select-none">{msg.senderName}</span>
                          {msg.isPremium && (
                            <span className="text-[7px] font-extrabold uppercase px-1 py-0.2 bg-gold-450/15 text-[#d4b574] rounded select-none">
                              🏅 Premium
                            </span>
                          )}
                          <span className="text-[8px] text-slate-500">Nível {msg.level}</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      <span className={`block text-[7px] text-right mt-1 font-bold ${
                        isMe ? "text-slate-950/40" : "text-slate-550"
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={globalEndRef} />
            </div>

            {/* Input keyboard bottom controller */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-850">
              <form onSubmit={handleSendGlobalMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Envie sua mensagem e treine com os colegas..."
                  value={globalInput}
                  onChange={(e) => setGlobalInput(e.target.value)}
                  className="flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold-500/50 font-sans transition"
                />

                <button
                  type="submit"
                  disabled={!globalInput.trim()}
                  className="bg-gold-600 hover:bg-gold-500 disabled:bg-slate-900 disabled:text-slate-650 text-slate-950 px-4.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[8px] text-slate-500 text-center mt-1.5">
                Participar de fóruns sociais e bate-papo global te concede <span className="text-gold-500 font-extrabold">+5 XP</span> e <span className="text-amber-500 font-extrabold">+1 Moeda</span>!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
