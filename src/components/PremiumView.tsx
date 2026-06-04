import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { 
  Trophy, 
  Crown, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  WifiOff, 
  MessageSquareShare, 
  BookOpen, 
  FileCheck2,
  ArrowLeft,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PremiumViewProps {
  onBack: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({ onBack }) => {
  const { profile, claimPremium } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);

  if (!profile) return null;

  const handleSubscribe = () => {
    claimPremium();
  };

  const hasEnoughLessonsForDiploma = profile.completedLessons.length >= 3;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Back controller */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider cursor-pointer bg-slate-900 border border-slate-800 py-2 px-4 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
      </button>

      {/* Main Premium Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1507] border border-gold-500/30 p-8 rounded-2xl shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        {/* Glowing Ambient light */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-radial-gradient from-gold-500/10 to-transparent pointer-events-none"></div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-gold-500 bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/25">
            <Crown className="w-4.5 h-4.5 fill-gold-500/10" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-display">Membro Vitalício Elite</span>
          </div>

          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight leading-none sm:text-4xl">
            Sua Jornada em <span className="text-[#c5a85c]">Alto Nível</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Elimine as barreiras do aprendizado do árabe clássico. Ganhe conversas ilimitadas com o Sheikh AI virtual e conquiste certificados para validar suas habilidades linguísticas universais.
          </p>

          <div className="flex gap-4 pt-2">
            {profile.isPremium ? (
              <span className="bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-extrabold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Arabic Premium Ativado
              </span>
            ) : (
              <button 
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-lg cursor-pointer transform hover:scale-[1.01]"
              >
                Ativar Acesso Premium (Gratuito)
              </button>
            )}
          </div>
        </div>

        {/* Big Trophy Emblem */}
        <div className="w-36 h-36 rounded-full bg-slate-950 border-2 border-gold-500/20 flex items-center justify-center relative shrink-0">
          <div className="absolute inset-2.5 rounded-full border border-dashed border-gold-500/30"></div>
          <Award className="w-16 h-16 text-gold-500" />
        </div>
      </div>

      {/* Grid of Elite Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: <MessageSquareShare className="w-6 h-6 text-gold-500" />,
            title: "Sheikh AI Ilimitado",
            desc: "Pense em perguntas complexas de tradução ou sotaque e pergunte quantas vezes quiser ao longo do dia."
          },
          {
            icon: <WifiOff className="w-6 h-6 text-[#10b981]" />,
            title: "Modo Ultra Offline",
            desc: "Acesso total a todas as 15 categorias de lições mesmo fora de conexões de internet ativas."
          },
          {
            icon: <FileCheck2 className="w-6 h-6 text-[#4285F4]" />,
            title: "Certificação Oficial",
            desc: "Conquiste um diploma chancelado pelo Arabic Master para exibir orgulhosamente como seu marco."
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-805 inline-block shrink-0">
              {item.icon}
            </div>
            <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Certificate Request and Rendering module */}
      {profile.isPremium && (
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl text-center space-y-4">
          <Award className="w-10 h-10 text-gold-500 mx-auto" />
          <h3 className="font-display font-semibold text-lg text-white">Central de Diplomas</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gere seu Diploma de Honra em Estudos Árabes Básicos para certificar seu curso formal. Mínimo de 3 lições concluídas para desbloquear.
          </p>

          <div className="pt-2">
            {hasEnoughLessonsForDiploma ? (
              <button 
                onClick={() => setShowCertificate(true)}
                className="bg-slate-950 hover:bg-slate-850 text-gold-500 border border-gold-500/20 py-2.5 px-6 rounded-xl text-xs font-semibold hover:border-gold-500/40 transition cursor-pointer"
              >
                Gerar & Visualizar Meu Diploma
              </button>
            ) : (
              <div className="bg-slate-950 border border-slate-805 p-3.5 rounded-xl inline-block">
                <p className="text-xs text-rose-450 font-bold">Diploma Bloqueado</p>
                <p className="text-[10px] text-slate-500 mt-1">Sua conta completou {profile.completedLessons.length}/3 lições necessárias.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diplome Modal display */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-slate-950 border-4 border-double border-gold-500/50 p-6 sm:p-10 rounded-2xl max-w-2xl w-full text-center relative shadow-2xl overflow-hidden font-sans my-8"
            >
              {/* Filigran background geometric shapes */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                <div className="absolute border border-dashed border-gold-500 top-[-2%] left-[-2%] w-full h-full rounded-2xl"></div>
              </div>

              <div className="border border-gold-500/20 p-6 sm:p-8 rounded-lg relative space-y-6">
                {/* Visual Ribbon sticker */}
                <div className="text-3xl sm:text-4xl">👑</div>
                
                <h2 className="font-display font-extrabold text-[#d4b574] text-xl sm:text-2xl tracking-widest leading-none uppercase">
                  Arabic Master Certificação
                </h2>
                
                <div className="w-16 h-[1px] bg-gold-500/50 mx-auto"></div>

                <p className="font-display italic text-xs text-slate-400 tracking-wider">
                  Outorga-se de forma solene o presente diploma com louvor de honra ao estudante:
                </p>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white py-1">
                  {profile.name}
                </h3>

                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Por ter demonstrado empenho inabalável, completado as disciplinas com proeza prática e de conversação básica com o assistente Sheikh AI, conquistando proficiência recomendada em caracteres e saudações comuns do idioma árabe.
                </p>

                <div className="w-24 h-[1.5px] bg-[#c5a85c]/40 mx-auto my-4"></div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 px-4">
                  <div>
                    <p className="font-bold uppercase text-slate-400">CHANCELADO EM:</p>
                    <p className="font-sans mt-0.5">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase text-[#c5a85c] tracking-widest leading-none">ARABIC DE HONOR</p>
                    <p className="font-sans text-[8px] text-slate-600 mt-1">DIPLOMA SECURE ID: AM-{(profile.xp * 7).toString(16).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-gold-600 hover:bg-gold-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Download className="w-4 h-4" /> Imprimir / PDF
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white text-slate-400 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Fechar Diploma
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
