import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { ChatMessage } from "../types";
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
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SheikhAIChatProps {
  onBack: () => void;
}

// Simple custom component to render basic markdown elements securely in React 19
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

export const SheikhAIChat: React.FC<SheikhAIChatProps> = ({ onBack }) => {
  const { profile, isGuest, addXp } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeAction, setActiveAction] = useState<"chat" | "pronunciation" | "writing" | "grammar" | "custom_exercises">("chat");

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Load chat cache from client storage on mount
  useEffect(() => {
    const key = isGuest ? "arabic_master_guest_chat" : `arabic_master_user_chat_${profile?.uid}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // Welcome introductory message
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
  }, [profile, isGuest]);

  // Sync cache on modification
  const saveMessagesToCache = (newMsgs: ChatMessage[]) => {
    const key = isGuest ? "arabic_master_guest_chat" : `arabic_master_user_chat_${profile?.uid}`;
    localStorage.setItem(key, JSON.stringify(newMsgs));
  };

  // Scroll to bottom helper
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isTyping) return;

    setInputText("");
    
    // User message setup
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
      
      // Award XP for interacting with Sheikh AI!
      await addXp(5);
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] min-h-[500px]">
      {/* Top Banner controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👳🏽‍♂️</span>
            <div>
              <h3 className="font-display font-semibold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                Sheikh AI <BadgeCheck className="w-4.5 h-4.5 text-gold-500 fill-slate-950" />
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Professor Real-Time</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleClearHistory}
          className="text-[10px] uppercase font-bold text-slate-500 hover:text-rose-400 transition bg-slate-950 border border-slate-805 px-3 py-1.5 rounded-lg self-end sm:self-center cursor-pointer"
        >
          Limpar histórico
        </button>
      </div>

      {/* Mode selectors bar */}
      <div className="bg-slate-950 border-x border-b border-slate-850 p-2 shrink-0 flex gap-1 overflow-x-auto scrollbar-none">
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
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeAction === item.key 
              ? "bg-[#c5a85c] text-slate-950 shadow" 
              : "text-slate-400 hover:text-slate-200 bg-slate-900/50 border border-slate-850"
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
              className={`flex items-start gap-3.5 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border text-base ${
                isUser 
                ? "bg-slate-850 border-slate-700 text-gold-500 font-bold" 
                : "bg-slate-900 border-gold-500/20 text-xl"
              }`}>
                {isUser ? profile.name.slice(0, 1).toUpperCase() : "👳🏽‍♂️"}
              </div>

              <div className={`p-4 rounded-2xl shadow-md ${
                isUser 
                  ? "bg-gold-600 text-slate-950 rounded-tr-none font-medium text-sm" 
                  : "bg-slate-900 text-slate-100 rounded-tl-none border border-slate-850 font-sans"
              }`}>
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <CustomMarkdownRenderer text={msg.text} />
                )}
                
                <span className={`block text-[8px] text-right mt-2 ${isUser ? "text-slate-950/60" : "text-slate-500"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-4 mr-auto max-w-[80%]">
            <div className="w-9 h-9 rounded-full bg-slate-900 border border-gold-500/10 flex items-center justify-center shrink-0">
              👳🏽‍♂️
            </div>
            <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl rounded-tl-none border border-slate-850 flex items-center gap-2">
              <span className="text-xs">Sheikh está consultando as escritas antiquíssimas</span>
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
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Tópicos Recomendados
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button 
              onClick={() => handleTemplateClick("Como pronunciar as vogais curtas (Damma, Fatha e Kasra)?", "pronunciation")}
              className="text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-850 text-xs text-slate-300 hover:border-gold-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-slate-500" /> Sons das vogais curtas árabes
            </button>
            <button 
              onClick={() => handleTemplateClick("Me fale sobre as regras gramaticais do Gênero Masculino e Feminino", "grammar")}
              className="text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-850 text-xs text-slate-300 hover:border-gold-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-500" /> Regras de Masculino e Feminino
            </button>
          </div>
        </div>
      )}

      {/* Input controls form */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-b-2xl shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder={
              activeAction === "pronunciation" ? "Escreva transliteração para o Sheikh avaliar de pronúncia..." :
              activeAction === "writing" ? "Escreva uma frase árabe de tentativa para de escrita..." :
              activeAction === "grammar" ? "Qual regra gramatical deseja explicar?" :
              activeAction === "custom_exercises" ? "Qual assunto deseja para que eu crie exercícios?" :
              "Envie sua pergunta em português ou árabe para o Sheikh..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-500/60 font-sans transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-gold-600 hover:bg-gold-500 disabled:bg-slate-900 disabled:text-slate-650 border-none text-slate-950 p-3.5 rounded-xl transition cursor-pointer shadow flex items-center justify-center shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Interagir com o Sheikh AI consome +5 XP para seu crescimento diário.
        </p>
      </div>
    </div>
  );
};
