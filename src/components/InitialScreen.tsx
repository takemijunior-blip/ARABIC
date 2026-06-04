import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { Sparkles, Globe, LogIn, UserX, ArrowRight, BookOpen, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { Onboarding } from "./Onboarding";

export const InitialScreen: React.FC = () => {
  const { loginWithGoogle, continueAsGuest, isLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [visitorName, setVisitorName] = useState("");
  const [showVisitorInput, setShowVisitorInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage("");
      await loginWithGoogle(onboardingData);
    } catch (e: any) {
      setErrorMessage("Erro ao autenticar com o Google. Experimente a opção visitante!");
    }
  };

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      continueAsGuest("Visitante", onboardingData);
    } else {
      continueAsGuest(visitorName.trim(), onboardingData);
    }
  };

  // If onboarding hasn't been completed yet, display the questionnaire
  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
        {/* Decorative Traditional Geometric Background stars and circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full border border-gold-500 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full border border-dashed border-gold-400"></div>
          </div>
          <div className="absolute bottom-[-5%] left-[-10%] w-96 h-96 rounded-full border border-dashed border-gold-500 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full border border-gold-400"></div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto text-center mt-6 z-10">
          {/* Animated Brand Emblem */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-gold-500 shadow-xl mb-3 relative"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-gold-400/50"></div>
            <BookOpen className="w-6 h-6 text-gold-500" />
          </motion.div>

          <h1 className="font-display font-bold text-2xl text-white tracking-tight">
            ARABIC <span className="text-gold-500 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600">MASTER</span>
          </h1>
        </div>

        {/* Dynamic Onboarding steps window (Q1-Q7 with Welcome and Custom Result maps) */}
        <div className="w-full max-w-md z-10 my-4">
          <Onboarding onComplete={(data) => setOnboardingData(data)} />
        </div>

        {/* Subtle brand Footer content */}
        <div className="text-center text-[10px] text-slate-600 tracking-wider">
          <p>© 2026 ARABIC MASTER • TODOS OS DIREITOS RESERVADOS</p>
        </div>
      </div>
    );
  }

  // Once onboarding is completed, show authentication screens
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Traditional Geometric Background stars and circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full border border-gold-500 flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border border-dashed border-gold-400"></div>
        </div>
        <div className="absolute bottom-[-5%] left-[-10%] w-96 h-96 rounded-full border border-dashed border-gold-500 flex items-center justify-center">
          <div className="w-72 h-72 rounded-full border border-gold-400"></div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto text-center mt-12 z-10">
        {/* Animated Brand Emblem */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-gold-500 shadow-xl mb-4 relative"
        >
          <div className="absolute inset-1.5 rounded-full border border-dashed border-gold-400/50"></div>
          <BookOpen className="w-8 h-8 text-gold-500" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display font-bold text-3xl text-white tracking-tight"
        >
          ARABIC <span className="text-gold-500 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600">MASTER</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-sm mt-2 max-w-sm mx-auto font-sans"
        >
          Salvar perfil de <span className="text-gold-400 font-semibold">{onboardingData.profileName}</span> e começar sua jornada guiada!
        </motion.p>
      </div>

      {/* Auth panel */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl z-10 mb-8"
      >
        {errorMessage && (
          <div className="mb-4 text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800 px-3 py-2 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        {showVisitorInput ? (
          <form onSubmit={handleVisitorSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-gold-100 text-center uppercase tracking-wider">
              Como gostaria de ser chamado(a)?
            </h3>
            <p className="text-xs text-slate-400 text-center">
              Criaremos um perfil local exclusivo na memória do seu navegador!
            </p>
            <input
              type="text"
              placeholder="Digite seu nome (Ex: Gabriel)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full text-slate-100 bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-gold-500 transition text-center"
              maxLength={25}
              disabled={isLoading}
              autoFocus
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowVisitorInput(false)}
                className="w-1/3 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-3 rounded-xl transition text-sm cursor-pointer"
                disabled={isLoading}
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-bold px-4 py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                disabled={isLoading}
              >
                Criar Perfil <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition text-slate-100 hover:border-gold-500 shadow-sm cursor-pointer"
            >
              {/* Google G Logo in vector */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.03-1.18-.32-1.66-1.16l-.53-1.47z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Conectar com o Google
            </button>

            <button
              onClick={() => setShowVisitorInput(true)}
              disabled={isLoading}
              className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition text-slate-200 cursor-pointer"
            >
              <UserX className="w-5 h-5 text-slate-400" />
              Continuar como visitante
            </button>

            {/* Back to questions link */}
            <button
              onClick={() => setOnboardingData(null)}
              className="w-full text-center text-xs text-slate-500 hover:text-gold-400 transition underline cursor-pointer pt-2"
            >
              Refazer questionário de personalização
            </button>
          </div>
        )}
      </motion.div>

      {/* Subtle brand Footer content */}
      <div className="text-center text-xs text-slate-600 tracking-wider">
        <p>© 2026 ARABIC MASTER • TODOS OS DIREITOS RESERVADOS</p>
        <p className="mt-1 flex items-center justify-center gap-1">
          <span>Feito com amor por falantes de português</span> <Globe className="w-3 h-3 text-gold-500/50" />
        </p>
      </div>
    </div>
  );
};
