import React, { useState, useEffect } from "react";
import { Lesson, Exercise } from "../types";
import { GET_LESSON_EXERCISES } from "../data";
import { useAuth } from "../lib/AuthContext";
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  Play,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LessonViewProps {
  lesson: Lesson;
  badgeIdToAward: string;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, badgeIdToAward, onBack }) => {
  const { completeLesson } = useAuth();
  
  // Carousel states
  // 0: Vocab Card, 1: Contextual Phrase, 2+: Exercises
  const [step, setStep] = useState(0);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);

  // Load static exercises based on lesson code
  useEffect(() => {
    const list = GET_LESSON_EXERCISES(lesson.id);
    setExercises(list);
    setStep(0);
    setSelectedOption(null);
    setWrittenAnswer("");
    setHasChecked(false);
    setIsCorrect(false);
    setXpAwarded(0);
  }, [lesson]);

  // Audio Playback with high-fidelity Google TTS and SpeechSynthesis fallback
  const handlePlayVoice = (text: string) => {
    if (!text) return;
    setPlayingText(text);

    // Google Translate TTS is exceptionally accurate and accent-neutral for standard Arabic
    // Using Audio object with real user-initiated play is highly reliable inside iframes
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(ttsUrl);

    audio.onended = () => {
      setPlayingText(null);
    };

    audio.onerror = (e) => {
      console.warn("Google TTS fell back to SpeechSynthesis due to network/iframe restriction", e);
      // Fallback to SpeechSynthesis
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ar-SA";
          utterance.rate = 0.75;
          
          const voices = window.speechSynthesis.getVoices();
          const arVoice = voices.find(v => v.lang.startsWith("ar"));
          if (arVoice) {
            utterance.voice = arVoice;
          }
          
          utterance.onend = () => {
            setPlayingText(null);
          };
          utterance.onerror = () => {
            setPlayingText(null);
          };
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("SpeechSynthesis error:", err);
          setPlayingText(null);
        }
      } else {
        setPlayingText(null);
      }
    };

    audio.play().catch((audioErr) => {
      console.warn("Standard Audio element play failed, falling back to Web Speech", audioErr);
      // Immediate fallback to SpeechSynthesis
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ar-SA";
          utterance.rate = 0.75;
          const voices = window.speechSynthesis.getVoices();
          const arVoice = voices.find(v => v.lang.startsWith("ar"));
          if (arVoice) {
            utterance.voice = arVoice;
          }
          utterance.onend = () => {
            setPlayingText(null);
          };
          utterance.onerror = () => {
            setPlayingText(null);
          };
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("SpeechSynthesis fallback failed:", err);
          setPlayingText(null);
        }
      } else {
        setPlayingText(null);
      }
    });
  };

  const activeExerciseIndex = step - 2;
  const activeExercise = exercises[activeExerciseIndex];
  
  // Total steps: Intro vocab cards (2) + exercise size
  const totalSteps = 2 + exercises.length;

  const handleCheckAnswer = () => {
    if (!activeExercise || hasChecked) return;

    let correct = false;
    if (activeExercise.type === "choice" || activeExercise.type === "complete") {
      correct = selectedOption === activeExercise.correctAnswer;
    } else if (activeExercise.type === "translate" || activeExercise.type === "write") {
      const cleanInput = writtenAnswer.trim().toLowerCase();
      const cleanAnswer = activeExercise.correctAnswer.trim().toLowerCase();
      correct = cleanInput === cleanAnswer || cleanAnswer.includes(cleanInput) && cleanInput.length > 2;
    } else {
      // fallback
      correct = true;
    }

    setIsCorrect(correct);
    setHasChecked(true);
    if (correct) {
      setXpAwarded((prev) => prev + 10);
    }
  };

  const handleNextStep = async () => {
    // Reset assessment attributes
    setSelectedOption(null);
    setWrittenAnswer("");
    setHasChecked(false);
    setIsCorrect(false);

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Converted entire lesson!
      setIsSubmitting(true);
      try {
        await completeLesson(lesson.id, lesson.moduleId, badgeIdToAward);
        // Show success summary page
        setStep(step + 1);
      } catch (err) {
        console.error("Error committing completed lesson:", err);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header with Exit controls */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider cursor-pointer bg-slate-900 border border-slate-800 py-2 px-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>

        <span className="text-xs font-extrabold text-gold-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 font-display">
          {lesson.title}
        </span>
      </div>

      {/* Progress horizontal step indicator */}
      <div className="w-full bg-slate-900 rounded-full h-2 mb-8 overflow-hidden flex">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div 
            key={idx}
            className={`h-full transition-all duration-300 ${
              idx < step ? "bg-emerald-500" :
              idx === step ? "bg-gold-500 ring-2 ring-gold-450" : "bg-slate-800"
            }`}
            style={{ width: `${100 / totalSteps}%` }}
          ></div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          /* STEP 0: VOCAB CARD */
          <motion.div 
            key="step0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6 relative"
          >
            <div className="text-xs uppercase font-bold text-slate-500 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-850 inline-block">
              Vocabulário Novo
            </div>

            <div className="space-y-2">
              <span className="text-gold-500 block uppercase font-bold tracking-wider text-xs font-display">EM PORTUGUÊS</span>
              <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">{lesson.portuguese}</h3>
            </div>

            {/* Arabic Script box */}
            <div className="bg-slate-950 border border-gold-500/20 py-8 rounded-xl shadow-inner relative group">
              <span className="absolute top-2 right-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest font-display">Escrita Árabe</span>
              <p className="font-arabic font-extrabold text-5xl sm:text-6xl text-white py-2 select-text" dir="rtl">{lesson.arabic}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Pronúncia Correta</span>
                <p className="text-lg font-bold text-slate-200 font-display">“{lesson.pronunciation}”</p>
              </div>

              {/* Audio reproduction button */}
              <button 
                onClick={() => handlePlayVoice(lesson.arabic)}
                disabled={playingText !== null && playingText !== lesson.arabic}
                className={`mx-auto flex items-center justify-center gap-2.5 font-extrabold px-6 py-3.5 rounded-full shadow-lg transition active:scale-[0.98] cursor-pointer ${
                  playingText === lesson.arabic
                    ? "bg-amber-500 text-slate-950 animate-pulse border-none"
                    : "bg-gold-600 hover:bg-gold-500 text-slate-950 disabled:opacity-50"
                }`}
              >
                {playingText === lesson.arabic ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    REPRODUZINDO...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" /> REPRODUZIR ÁUDIO
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleNextStep}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-gold-500/20 text-white font-extrabold px-5 py-3 rounded-xl transition flex items-center gap-1.5 text-sm cursor-pointer"
              >
                Continuar <ArrowRight className="w-4 h-4 text-gold-500" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          /* STEP 1: CONTEXTUAL PHRASE */
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6"
          >
            <div className="text-xs uppercase font-bold text-slate-500 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-850 inline-block">
              Exemplo Em Frase
            </div>

            {lesson.phraseArabic ? (
              <div className="space-y-6">
                <div className="bg-slate-950 border border-gold-500/20 py-8 rounded-xl shadow-inner relative group">
                  <span className="absolute top-2 right-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest font-display">Contexto Árabe</span>
                  <p className="font-arabic font-extrabold text-3xl sm:text-4xl text-white py-2 leading-relaxed" dir="rtl">
                    {lesson.phraseArabic}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Pronúncia Translada</span>
                    <p className="text-base font-bold text-slate-200">“{lesson.phrasePronunciation}”</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gold-500 block text-[10px] uppercase font-bold font-display">Tradução Contextual</span>
                    <p className="text-lg font-semibold text-slate-100">“{lesson.phrasePortuguese}”</p>
                  </div>

                  <button 
                    onClick={() => handlePlayVoice(lesson.phraseArabic || "")}
                    disabled={playingText !== null && playingText !== lesson.phraseArabic}
                    className={`mx-auto flex items-center justify-center gap-2.5 font-extrabold px-6 py-3.5 rounded-full shadow transition cursor-pointer ${
                      playingText === lesson.phraseArabic
                        ? "bg-amber-500 text-slate-950 animate-pulse border-none"
                        : "bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-gold-500/30 text-white disabled:opacity-50"
                    }`}
                  >
                    {playingText === lesson.phraseArabic ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        REPRODUZINDO...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white shrink-0" /> ESCUTAR CONTEXTO
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Este vocabulário serve de apoio prático elementar básico.</p>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button 
                onClick={() => setStep(0)}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold py-2 cursor-pointer"
              >
                Voltar
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-gold-500/20 text-white font-extrabold px-5 py-3 rounded-xl transition flex items-center gap-1.5 text-sm cursor-pointer animate-pulse"
              >
                Ir para Exercícios <ArrowRight className="w-4 h-4 text-gold-500" />
              </button>
            </div>
          </motion.div>
        )}

        {step >= 2 && step < totalSteps && activeExercise && (
          /* EXERCISE PHASES */
          <motion.div 
            key={`ex_${activeExercise.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4b574] bg-[#d4b574]/10 border border-[#d4b574]/20 px-2.5 py-1 rounded-full">
                Exercício de Prática
              </span>
              <span className="text-xs text-slate-500">Questão {step - 1} de {exercises.length}</span>
            </div>

            {/* Prompt */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                {activeExercise.question}
              </h4>

              {activeExercise.arabicContext && (
                <div className="bg-slate-950 border border-slate-850 py-5 px-4 rounded-xl text-center select-all flex flex-col items-center justify-center space-y-3.5">
                  <p className="font-arabic font-extrabold text-3xl text-slate-100" dir="rtl">
                    {activeExercise.arabicContext}
                  </p>
                  <button
                    onClick={() => handlePlayVoice(activeExercise.arabicContext || "")}
                    disabled={playingText !== null && playingText !== activeExercise.arabicContext}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full tracking-wider transition ${
                      playingText === activeExercise.arabicContext
                        ? "bg-amber-500 text-slate-950 animate-pulse animate-none"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-gold-500/30 disabled:opacity-50 cursor-pointer"
                    }`}
                  >
                    {playingText === activeExercise.arabicContext ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        REPRODUZINDO...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" /> OUVIR PRONÚNCIA
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Answer Mode selectors */}
            <div className="space-y-3">
              {(activeExercise.type === "choice" || activeExercise.type === "complete") && activeExercise.options && (
                <div className="grid grid-cols-1 gap-2.5">
                  {activeExercise.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={opt}
                        disabled={hasChecked}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition font-medium cursor-pointer ${
                          isSelected 
                            ? "bg-slate-950 border-gold-500 text-gold-500 shadow-md ring-1 ring-gold-500/20" 
                            : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {(activeExercise.type === "translate" || activeExercise.type === "write") && (
                <input
                  type="text"
                  placeholder="Escreva sua resposta aqui..."
                  disabled={hasChecked}
                  value={writtenAnswer}
                  onChange={(e) => setWrittenAnswer(e.target.value)}
                  className="w-full text-slate-200 bg-slate-950 border border-slate-800 px-4 py-4 rounded-xl focus:outline-none focus:border-gold-500 transition text-sm text-center font-semibold"
                />
              )}
            </div>

            {/* Correct/Incorrect Evaluation Feedback Block */}
            {hasChecked && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isCorrect 
                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" 
                  : "bg-rose-950/40 border-rose-800 text-rose-450"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 self-start mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 self-start mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold">{isCorrect ? "Fantástico! Resposta Correta!" : "Que pena, resposta incorreta..."}</h4>
                  <p className="text-xs text-slate-400 mt-1">Gabari correto: <b className="text-slate-200 font-bold">{activeExercise.correctAnswer}</b></p>
                </div>
              </motion.div>
            )}

            {/* Actions triggers */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              {!hasChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={
                    (activeExercise.type === "choice" || activeExercise.type === "complete") 
                      ? !selectedOption 
                      : !writtenAnswer.trim()
                  }
                  className="bg-gold-600 hover:bg-gold-500 disabled:bg-slate-900 disabled:text-slate-650 disabled:border-slate-800 border-none text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition cursor-pointer"
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="bg-slate-950 hover:bg-slate-850 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                >
                  {isSubmitting ? "Carregando..." : step === totalSteps - 1 ? "Completar Lição" : "Avançar"} 
                  <ArrowRight className="w-4 h-4 text-gold-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === totalSteps && (
          /* SUCCESS SUMMARY SUMMARY CARD */
          <motion.div 
            key="successCard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 mb-2">
              <Sparkles className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-2xl text-white">LIÇÃO CONCLUÍDA!</h3>
              <p className="text-xs text-slate-400">Você provou ser um excelente linguista na lição: <b>{lesson.title}</b></p>
            </div>

            <div className="max-w-xs mx-auto bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
              <p className="text-xs uppercase font-semibold text-slate-500">Métricas Conquistadas</p>
              <div className="flex justify-between items-center text-sm px-4">
                <span className="text-slate-300 font-medium font-sans">Ganhos Acadêmicos</span>
                <span className="text-gold-500 font-bold">+40 XP</span>
              </div>
              <div className="flex justify-between items-center text-sm px-4">
                <span className="text-slate-300 font-medium font-sans font-display">Estrelas acumuladas</span>
                <span className="text-orange-500 font-bold">+10 Medalhas</span>
              </div>
            </div>

            <button 
              onClick={onBack}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition shadow-lg shrink-0 cursor-pointer"
            >
              Retornar ao Painel de Módulos
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
