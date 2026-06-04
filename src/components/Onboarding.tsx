import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Clock, Target, Lightbulb, Compass, Award, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingProps {
  onComplete: (data: {
    profileName: string;
    objective: string;
    plan: string[];
    dailyGoal: string;
    duration: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
  }) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0); // 0 = Welcome, 1-7 = Questions, 8 = Personalized Results
  
  // State for storing the selected answers
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");

  const q1Options = ["Na rua", "Na escola", "Em casa", "Em uma viagem", "Em vídeos da internet", "Em filmes ou séries", "Em músicas", "Nunca ouvi árabe antes"];
  const q2Options = ["Me comunicar melhor", "Fazer networking internacional", "Trabalho", "Negócios", "Religião", "Curiosidade", "Viajar para países árabes", "Fazer amizades", "Casamento ou relacionamento", "Estudos", "Quero morar em um país árabe"];
  const q3Options = ["Nunca estudei árabe", "Sei algumas palavras", "Sei ler algumas letras", "Consigo fazer frases simples", "Nível intermediário", "Nível avançado"];
  const q4Options = ["Conversação", "Pronúncia", "Escrita", "Leitura", "Gramática", "Vocabulário"];
  const q5Options = ["5 minutos", "10 minutos", "15 minutos", "30 minutos", "1 hora", "Mais de 1 hora"];
  const q6Options = ["Saudações", "Família", "Comida", "Viagens", "Trabalho", "Relacionamentos", "Cultura Árabe", "Religião", "Compras", "Conversas do dia a dia"];
  const q7Options = ["Falar árabe fluentemente", "Ler árabe", "Escrever árabe", "Viajar com confiança", "Trabalhar com árabes", "Fazer amigos árabes", "Entender filmes e músicas", "Aprender por hobby"];

  // Handle question selection
  const handleSelectOption = (option: string) => {
    switch (step) {
      case 1: setQ1(option); break;
      case 2: setQ2(option); break;
      case 3: setQ3(option); break;
      case 4: setQ4(option); break;
      case 5: setQ5(option); break;
      case 6: setQ6(option); break;
      case 7: setQ7(option); break;
      default: break;
    }
    // Auto-advance with a slight delay for a smoother tactile feel
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 250);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  // Profile calculations based on options selected
  const getPersonalizedProfile = () => {
    let profileName = "Explorador Cultural";
    let objective = "Aprender árabe de forma completa.";
    let duration = "30 dias";
    let icon = "Compass";

    // Decidir o Nome do Perfil com base nas respostas
    if (q2 === "Religião" || q6 === "Religião") {
      profileName = "Leitor das Escrituras";
      icon = "Award";
    } else if (q2 === "Trabalho" || q2 === "Negócios" || q2 === "Fazer networking internacional" || q7 === "Trabalhar com árabes") {
      profileName = "Diplomata de Negócios";
      icon = "Target";
    } else if (q2 === "Viajar para países árabes" || q7 === "Viajar com confiança" || q1 === "Em uma viagem") {
      profileName = "Nômade Cultural";
      icon = "Compass";
    } else if (q2 === "Fazer amizades" || q2 === "Casamento ou relacionamento" || q7 === "Fazer amigos árabes") {
      profileName = "Conector Social";
      icon = "Sparkles";
    } else if (q3 === "Nível intermediário" || q3 === "Nível avançado") {
      profileName = "Praticante Avançado";
      icon = "Award";
    } else if (q2 === "Curiosidade" || q7 === "Aprender por hobby") {
      profileName = "Buscador de Sabedoria";
      icon = "Lightbulb";
    }

    // Decidir Objetivo Textual
    if (q2 && q7) {
      objective = `Aprender árabe focado em ${q2.toLowerCase()} para futuramente conseguir ${q7.toLowerCase()}.`;
    } else if (q2) {
      objective = `Focado em ${q2.toLowerCase()} para comunicação essencial.`;
    } else if (q7) {
      objective = `Desenvolver habilidades para ${q7.toLowerCase()}.`;
    }

    // Decidir Duração Estimada com base no nível atual (Q3) e tempo de estudo (Q5)
    let minPerDay = 15;
    if (q5.includes("5")) minPerDay = 5;
    else if (q5.includes("10")) minPerDay = 10;
    else if (q5.includes("15")) minPerDay = 15;
    else if (q5.includes("30")) minPerDay = 30;
    else minPerDay = 60;

    let isBeginner = q3 === "Nunca estudei árabe" || q3 === "Sei algumas palavras";
    
    if (isBeginner) {
      if (minPerDay <= 10) duration = "45 dias";
      else if (minPerDay <= 15) duration = "30 dias";
      else duration = "21 dias";
    } else {
      if (minPerDay <= 10) duration = "21 dias";
      else if (minPerDay <= 15) duration = "15 dias";
      else duration = "10 dias";
    }

    // Gerar plano de estudos personalizado baseado nas habilidades (Q4) e assuntos (Q6)
    const week1 = [
      `Fundamentos e ${q6 || "Saudações"} iniciais em árabe`,
      `Aprendizado do Alfabeto Árabe essencial`,
      `Sinfonia dos Sons: Treino de Pronúncia focada em ${q4 || "Conversação"}`
    ];

    const week2 = [
      `Expansão Vocabular: Assunto "${q6 || "Cultura Árabe"}"`,
      `Estruturas Práticas e frases comuns de uso básico`,
      `Erros de conexão de escrita e regras essenciais`
    ];

    const week3 = [
      `Construção de diálogos reais de ${q4 || "Conversação"}`,
      `Fixação Avançada com assistência do Sheikh AI`,
      `Simulador e Testes Rápidos Práticos`
    ];

    return {
      profileName,
      objective,
      plan: [
        `Semana 1: \n* ${week1[0]}\n* ${week1[1]}\n* ${week1[2]}`,
        `Semana 2: \n* ${week2[0]}\n* ${week2[1]}\n* ${week2[2]}`,
        `Semana 3: \n* ${week3[0]}\n* ${week3[1]}\n* ${week3[2]}`
      ],
      dailyGoal: q5 || "15 minutos",
      duration,
      icon
    };
  };

  const currentProfile = getPersonalizedProfile();

  const handleFinalize = () => {
    onComplete({
      profileName: currentProfile.profileName,
      objective: currentProfile.objective,
      plan: currentProfile.plan,
      dailyGoal: currentProfile.dailyGoal,
      duration: currentProfile.duration,
      q1, q2, q3, q4, q5, q6, q7
    });
  };

  const percentage = Math.floor((step / 7) * 100);

  // Render question component inline for speed and performance
  const renderQuestion = (
    title: string, 
    options: string[], 
    selectedValue: string,
    stepNum: number
  ) => {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-slate-500 font-display text-xs mb-4 uppercase tracking-widest font-semibold">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-1 hover:text-gold-400 font-bold transition text-slate-400 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </button>
          <span>Pergunta {stepNum} de 7</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900 border border-slate-850 h-2.5 rounded-full overflow-hidden mb-8 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500" 
            initial={{ width: `${((stepNum - 1) / 7) * 100}%` }}
            animate={{ width: `${(stepNum / 7) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight mb-6 text-center leading-snug"
        >
          {title}
        </motion.h2>

        {/* Options list */}
        <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {options.map((option, idx) => {
            const isSelected = selectedValue === option;
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? "bg-slate-900/90 border-gold-500 text-gold-400" 
                    : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700/80"
                }`}
              >
                <span className="font-semibold">{option}</span>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                  isSelected ? "border-gold-500 bg-gold-500/20" : "border-slate-700"
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6">
      <AnimatePresence mode="wait">
        
        {/* STEP 0: WELCOME SCREEN */}
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            {/* Elegant visual badge */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-850 p-1 mx-auto">
              <div className="absolute inset-1 rounded-full border border-dashed border-gold-500/30"></div>
              <Compass className="w-10 h-10 text-gold-500 animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight leading-snug">
                Bem-vindo ao <span className="text-gold-500 font-extrabold pb-0.5">Arabic Master</span>!
              </h1>
              <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto font-sans leading-relaxed">
                Vamos personalizar sua jornada de aprendizagem em menos de 1 minuto para acelerar sua fluência.
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full max-w-xs mx-auto bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 font-bold px-6 py-3.5 rounded-xl text-slate-950 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer text-sm"
            >
              Começar <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </motion.div>
        )}

        {/* STEP 1: Q1 */}
        {step === 1 && (
          <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Onde você ouviu árabe pela primeira vez?", q1Options, q1, 1)}
          </motion.div>
        )}

        {/* STEP 2: Q2 */}
        {step === 2 && (
          <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("O que faz você querer aprender árabe?", q2Options, q2, 2)}
          </motion.div>
        )}

        {/* STEP 3: Q3 */}
        {step === 3 && (
          <motion.div key="q3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Qual é o seu nível atual?", q3Options, q3, 3)}
          </motion.div>
        )}

        {/* STEP 4: Q4 */}
        {step === 4 && (
          <motion.div key="q4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Qual habilidade você deseja desenvolver primeiro?", q4Options, q4, 4)}
          </motion.div>
        )}

        {/* STEP 5: Q5 */}
        {step === 5 && (
          <motion.div key="q5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Quanto tempo você pode estudar por dia?", q5Options, q5, 5)}
          </motion.div>
        )}

        {/* STEP 6: Q6 */}
        {step === 6 && (
          <motion.div key="q6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Qual assunto mais lhe interessa?", q6Options, q6, 6)}
          </motion.div>
        )}

        {/* STEP 7: Q7 */}
        {step === 7 && (
          <motion.div key="q7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {renderQuestion("Qual é seu principal objetivo?", q7Options, q7, 7)}
          </motion.div>
        )}

        {/* STEP 8: SUMMARY / RESULT SCREEN */}
        {step === 8 && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              {/* Achievement Badge style icon */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold-600 to-amber-500 text-slate-950 p-4 mx-auto mb-3 shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-gold-500 font-display text-xs font-bold uppercase tracking-widest">Parabéns!</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight mt-1 leading-snug">
                Seu perfil foi identificado!
              </h2>
            </div>

            {/* Profile identification card & plans */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Compass className="w-24 h-24 text-gold-500" />
              </div>

              {/* Dynamic Profile Class */}
              <div className="border-b border-slate-850 pb-4">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Seu Perfil de Estudante</div>
                <div className="text-lg font-bold font-display text-white mt-0.5 flex items-center gap-1.5">
                  <span className="text-gold-400">{currentProfile.profileName}</span> 
                  <Sparkles className="w-4 h-4 text-gold-500 fill-gold-500/20 shrink-0" />
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-gold-500" />
                  Objetivo
                </div>
                <p className="text-sm font-medium text-slate-200 pl-5">
                  {currentProfile.objective}
                </p>
              </div>

              {/* Study Plan */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider pr-2">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  Plano Recomendado
                </div>
                
                <div className="grid grid-cols-1 gap-2.5 pl-5">
                  <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3">
                    <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1.5">Semana 1</p>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
                      <li>Fundamentos e {q6 || "Saudações"} iniciais em árabe</li>
                      <li>Alfabeto Árabe essencial</li>
                      <li>Treino de Pronúncia focada em {q4 || "Conversação"}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3">
                    <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1.5">Semana 2</p>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
                      <li>Vocabulário expandido de {q6 || "Cultura"}</li>
                      <li>Construção de frases comuns e vocabulário</li>
                      <li>Erros de conexão ortográfica de letras</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3">
                    <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1.5">Semana 3</p>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
                      <li>Conversação básica ativa no dia a dia</li>
                      <li>Prática de dúvidas e diálogos com o Sheikh AI</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Goal parameters in horizontal flex */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    Meta Diária
                  </div>
                  <p className="text-sm font-bold text-slate-200 mt-1 pl-5">
                    {currentProfile.dailyGoal}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    Conversação Básica
                  </div>
                  <p className="text-sm font-bold text-slate-200 mt-1 pl-5">
                    {currentProfile.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleFinalize}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-bold px-6 py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer text-sm font-sans"
            >
              Começar Minha Jornada <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
