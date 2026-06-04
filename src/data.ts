import { Module, Lesson, Exercise } from "./types";

export const CURRICULUM_MODULES: Module[] = [
  {
    id: "modulo_1",
    title: "MÓDULO 1 – PRIMEIROS PASSOS",
    description: "Aprenda as saudações mais usadas, despedidas cordiais, expressões básicas e perguntas essenciais do cotidiano árabe.",
    badgeId: "badge_passos",
    xpValue: 100,
    lessons: [
      {
        id: "l_1_1",
        moduleId: "modulo_1",
        title: "Lição 1: Saudações Comuns",
        description: "Como saudar as pessoas educadamente em qualquer situação.",
        order: 1,
        portuguese: "Olá / Bem-vindo",
        arabic: "مرحبا",
        pronunciation: "Marhaban",
        phraseArabic: "مرحبا كيف حالك",
        phrasePronunciation: "Marhaban Kaifa Haluk",
        phrasePortuguese: "Olá, como você está?"
      },
      {
        id: "l_1_2",
        moduleId: "modulo_1",
        title: "Lição 2: Despedidas Cordiais",
        description: "Diga adeus e deseje paz nas viagens alheias de forma elegante.",
        order: 2,
        portuguese: "Até logo / Vá com paz",
        arabic: "مع السلامة",
        pronunciation: "Ma'a as-salama",
        phraseArabic: "مع السلامة يا صديقتي",
        phrasePronunciation: "Ma'a as-salama ya sadiqati",
        phrasePortuguese: "Até logo, minha amiga"
      },
      {
        id: "l_1_3",
        moduleId: "modulo_1",
        title: "Lição 3: Expressões Básicas de Gratidão",
        description: "Seja grato e responda a agradecimentos.",
        order: 3,
        portuguese: "Obrigado",
        arabic: "شكرا",
        pronunciation: "Shukran",
        phraseArabic: "شكرا جزيلا على المساعدة",
        phrasePronunciation: "Shukran jazilan 'ala al-musa'ada",
        phrasePortuguese: "Muito obrigado pela ajuda!"
      },
      {
        id: "l_1_4",
        moduleId: "modulo_1",
        title: "Lição 4: Perguntas Simples de Reconhecimento",
        description: "Pergunte quem e o que em diálogos simples.",
        order: 4,
        portuguese: "Quem é você?",
        arabic: "من أنت؟",
        pronunciation: "Man anta? (Masc) / Man anti? (Fem)",
        phraseArabic: "مرحبا من أنت؟",
        phrasePronunciation: "Marhaban, man anta?",
        phrasePortuguese: "Olá, quem é você?"
      }
    ]
  },
  {
    id: "modulo_2",
    title: "MÓDULO 2 – ALFABETO ÁRABE",
    description: "Conheça o sistema de escrita e as 28 letras em suas formas Isolada, Inicial, Média e Final.",
    badgeId: "badge_alfabeto",
    xpValue: 150,
    lessons: [
      {
        id: "l_2_1",
        moduleId: "modulo_2",
        title: "Lição 1: A Letra Alif (أ)",
        description: "A primeira letra do alfabeto e sua sonoridade de vogal.",
        order: 1,
        portuguese: "Alif (Vogal longa 'A' ou suporte para Glotal)",
        arabic: "أ",
        pronunciation: "Alif",
        phraseArabic: "أنا أحب اللغة العربية",
        phrasePronunciation: "Ana uhibbu al-lughat al-'arabiyya",
        phrasePortuguese: "Eu amo a língua árabe"
      },
      {
        id: "l_2_2",
        moduleId: "modulo_2",
        title: "Lição 2: A Letra Ba' (ب)",
        description: "O som de B, representada por um ponto inferior.",
        order: 2,
        portuguese: "Ba' (letra B)",
        arabic: "ب",
        pronunciation: "Ba'",
        phraseArabic: "هذا بيت كبير",
        phrasePronunciation: "Hadha baytun kabir",
        phrasePortuguese: "Esta é uma casa grande"
      },
      {
        id: "l_2_3",
        moduleId: "modulo_2",
        title: "Lição 3: A Letra Ta' (ت)",
        description: "O som de T, escrita com dois pontos superiores.",
        order: 3,
        portuguese: "Ta' (letra T)",
        arabic: "ت",
        pronunciation: "Ta'",
        phraseArabic: "تفاحة حمراء ولذيذة",
        phrasePronunciation: "Tuffahatun hamra'u wa ladhidha",
        phrasePortuguese: "Uma maçã vermelha e deliciosa"
      }
    ]
  },
  {
    id: "modulo_3",
    title: "MÓDULO 3 – NÚMEROS E VALORES",
    description: "Compreenda os numerais de 0 a 1000, além de como formular horas, idades e preços de mercado.",
    badgeId: "badge_numeros",
    xpValue: 120,
    lessons: [
      {
        id: "l_3_1",
        moduleId: "modulo_3",
        title: "Lição 1: Os Números Básicos (1-5)",
        description: "Contar os primeiros elementos em árabe.",
        order: 1,
        portuguese: "Um, Dois, Três, Quatro, Cinco",
        arabic: "واحد، اثنان، ثلاثة، أربعة، خمسة",
        pronunciation: "Wahid, Ithnan, Thalatha, Arba'a, Khamsa",
        phraseArabic: "عندي خمسة كتب جديدة",
        phrasePronunciation: "Indi khamsa kutub jadida",
        phrasePortuguese: "Eu tenho cinco livros novos"
      },
      {
        id: "l_3_2",
        moduleId: "modulo_3",
        title: "Lição 2: Falando sobre Idade",
        description: "Como perguntar e responder os anos de vida.",
        order: 2,
        portuguese: "Quantos anos você tem?",
        arabic: "كم عمرك؟",
        pronunciation: "Kam 'umruk?",
        phraseArabic: "عمري عشرون سنة",
        phrasePronunciation: "Umri 'ishruna sana",
        phrasePortuguese: "Tenho vinte anos de idade"
      }
    ]
  },
  {
    id: "modulo_4",
    title: "MÓDULO 4 – CORES VÍVIDAS",
    description: "Adjetivos de cores primárias, secundárias, tons escuros e tons claros estruturados gramaticalmente.",
    badgeId: "badge_cores",
    xpValue: 100,
    lessons: [
      {
        id: "l_4_1",
        moduleId: "modulo_4",
        title: "Lição 1: As Cores Primárias",
        description: "Descreva objetos simples com cores primárias.",
        order: 1,
        portuguese: "Azul, Vermelho, Amarelo, Verde",
        arabic: "أزرق، أحمر، أصفر، أخضر",
        pronunciation: "Azraq, Ahmar, Asfar, Akhdar",
        phraseArabic: "السماء زرقاء والوردة حمراء",
        phrasePronunciation: "As-sama'u zarqa'u wal-wardatu hamra'",
        phrasePortuguese: "O céu é azul e a rosa é vermelha"
      }
    ]
  },
  {
    id: "modulo_5",
    title: "MÓDULO 5 – ALIMENTOS E BEBIDAS",
    description: "Vocabulário de frutas, legumes, carnes e diálogos em restaurantes ou feiras tradicionais árabes.",
    badgeId: "badge_alimentos",
    xpValue: 120,
    lessons: [
      {
        id: "l_5_1",
        moduleId: "modulo_5",
        title: "Lição 1: No Restaurante Árabe",
        description: "Como pedir comidas clássicas e bebidas.",
        order: 1,
        portuguese: "A conta, por favor",
        arabic: "الحساب من فضلك",
        pronunciation: "Al-hisab min fadlik",
        phraseArabic: "أريد خبز ولحم من فضلك",
        phrasePronunciation: "Uridu khubz wa lahm min fadlik",
        phrasePortuguese: "Eu quero pão e carne, por favor"
      }
    ]
  },
  {
    id: "modulo_6",
    title: "MÓDULO 6 – ROUPAS E VESTUÁRIO",
    description: "Nomeie peças de vestuário comuns, sapatos e acessórios do dia a dia e da cultura árabe tradicional.",
    badgeId: "badge_roupas",
    xpValue: 110,
    lessons: [
      {
        id: "l_6_1",
        moduleId: "modulo_6",
        title: "Lição 1: Peças de Roupa Comuns",
        description: "Camisa, calça e acessórios essenciais.",
        order: 1,
        portuguese: "Camisa e Calça",
        arabic: "قميص وسروال",
        pronunciation: "Qamis wa sirwal",
        phraseArabic: "أرتدي قميصاً جميلاً اليوم",
        phrasePronunciation: "Artadi qamisan jamilan al-yawm",
        phrasePortuguese: "Estou vestindo uma camisa bonita hoje"
      }
    ]
  },
  {
    id: "modulo_7",
    title: "MÓDULO 7 – LAÇOS DE FAMÍLIA",
    description: "Termos carinhosos e formais para mãe, pai, irmãos, avós e parentes distantes.",
    badgeId: "badge_familia",
    xpValue: 120,
    lessons: [
      {
        id: "l_7_1",
        moduleId: "modulo_7",
        title: "Lição 1: Meus Pais e Irmãos",
        description: "Fale sobre sua árvore genealógica imediata.",
        order: 1,
        portuguese: "Mãe e Pai",
        arabic: "أمي وأبي",
        pronunciation: "Ummi wa Abi",
        phraseArabic: "أنا أحب أمي وأبي كثيراً",
        phrasePronunciation: "Ana uhibbu ummi wa abi kathiran",
        phrasePortuguese: "Eu amo muito a minha mãe e o meu pai"
      }
    ]
  },
  {
    id: "modulo_8",
    title: "MÓDULO 8 – AMIZADES E RELAÇÕES",
    description: "Diferencie vizinhos, colegas de trabalho e amigos próximos, estruturando interações ricas.",
    badgeId: "badge_amizades",
    xpValue: 100,
    lessons: [
      {
        id: "l_8_1",
        moduleId: "modulo_8",
        title: "Lição 1: Meu Grande Amigo",
        description: "Como definir amigos e companheiros de curso.",
        order: 1,
        portuguese: "Meu amigo / Minha amiga",
        arabic: "صديقي / صديقتي",
        pronunciation: "Sadiqi (Masc) / Sadiqati (Fem)",
        phraseArabic: "أنت صديقي المفضل يا علي",
        phrasePronunciation: "Anta sadiqi al-mufaddal ya Ali",
        phrasePortuguese: "Você é meu amigo favorito, Ali"
      }
    ]
  },
  {
    id: "modulo_9",
    title: "MÓDULO 9 – CONVERSAS ROMÂNTICAS",
    description: "Elogios profundos, declarações afetuosas e vocabulário romântico literário em árabe.",
    badgeId: "badge_romantico",
    xpValue: 140,
    lessons: [
      {
        id: "l_9_1",
        moduleId: "modulo_9",
        title: "Lição 1: Declarações de Carinho",
        description: "Elogie e expresse afeição profunda em árabe.",
        order: 1,
        portuguese: "Eu te amo",
        arabic: "أنا أحبك",
        pronunciation: "Ana uhibbuka (para Masc) / Ana uhibbuki (para Fem)",
        phraseArabic: "حبيبي، أنا أحبك كثيراً",
        phrasePronunciation: "Habibi, ana uhibbuka kathiran",
        phrasePortuguese: "Meu amor, eu te amo muito"
      }
    ]
  },
  {
    id: "modulo_10",
    title: "MÓDULO 10 – FRASES DIVERTIDAS E HUMOR",
    description: "Descubra o humor tradicional árabe, piadas populares e gírias de lazer cotidianas.",
    badgeId: "badge_humor",
    xpValue: 100,
    lessons: [
      {
        id: "l_10_1",
        moduleId: "modulo_10",
        title: "Lição 1: Provérbios Engraçados",
        description: "Interprete expresses populares divertidas.",
        order: 1,
        portuguese: "Como dizem os árabes de bom humor",
        arabic: "ضحك بلا سبب من قلة الأدب",
        pronunciation: "Dahik bila sabab min qillat al-adab",
        phraseArabic: "لماذا تضحك؟ ضحك بلا سبب من قلة الأدب!",
        phrasePronunciation: "Limadha tadhak? Dahik bila sabab min qillat al-adab!",
        phrasePortuguese: "Por que você está rindo? Rir sem motivo é falta de educação!"
      }
    ]
  },
  {
    id: "modulo_11",
    title: "MÓDULO 11 – TRISTEZA E DESABAFOS",
    description: "Saudade dolorida (Ghariba), sentimentos de consolo melancólico e empatia em momentos difíceis.",
    badgeId: "badge_triste",
    xpValue: 110,
    lessons: [
      {
        id: "l_11_1",
        moduleId: "modulo_11",
        title: "Lição 1: Sinto sua falta (Saudade)",
        description: "Como expressar o clássico arrebatamento de saudade.",
        order: 1,
        portuguese: "Tenho saudades suas / Sinto sua falta",
        arabic: "اشتقت إليك",
        pronunciation: "Ishtaqtu ilayka (Masc) / Ishtaqtu ilayki (Fem)",
        phraseArabic: "يا صديقي اشتقت إليك كثيراً",
        phrasePronunciation: "Ya sadiqi, ishtaqtu ilayka kathiran",
        phrasePortuguese: "Meu amigo, sinto muito a sua falta!"
      }
    ]
  },
  {
    id: "modulo_12",
    title: "MÓDULO 12 – CASOS DO COTIDIANO REAL",
    description: "Diálogos completos simulando aeroportos, hotéis, táxis, mercados de especiarias e saúde pública.",
    badgeId: "badge_casos",
    xpValue: 150,
    lessons: [
      {
        id: "l_12_1",
        moduleId: "modulo_12",
        title: "Lição 1: Conversa com o Taxista",
        description: "Indique endereços de hotéis ou mercados célere.",
        order: 1,
        portuguese: "Vá para o hotel, por favor",
        arabic: "اذهب إلى الفندق من فضلك",
        pronunciation: "Idhhab ila al-funduq min fadlik",
        phraseArabic: "يا سائق، اذهب إلى الفندق من فضلك سريعا",
        phrasePronunciation: "Ya sa'iq, idhhab ila al-funduq min fadlik sari'an",
        phrasePortuguese: "Motorista, vá para o hotel rapidamente, por favor"
      }
    ]
  },
  {
    id: "modulo_13",
    title: "MÓDULO 13 – VOCABULÁRIO ESSENCIAL (1000 palavras)",
    description: "Exploração bento-style de 10 categorias de substantivos mais úteis: Tecnologia, Saúde, Casa, Viagem.",
    badgeId: "badge_palavras",
    xpValue: 130,
    lessons: [
      {
        id: "l_13_1",
        moduleId: "modulo_13",
        title: "Lição 1: Tecnologia Moderna",
        description: "Termos úteis de computadores, internet e celulares.",
        order: 1,
        portuguese: "Computador e Telefone celular",
        arabic: "حاسوب وهاتف محمول",
        pronunciation: "Hasub wa hatif mahmul",
        phraseArabic: "أستعمل الحاسوب للدراسة العربية",
        phrasePronunciation: "Asta'milu al-hasub li-dirasat al-'arabiyya",
        phrasePortuguese: "Estou utilizando o computador para estudar árabe"
      }
    ]
  },
  {
    id: "modulo_14",
    title: "MÓDULO 14 – CONJUGAÇÃO DE VERBOS",
    description: "Domine os 500 verbos fundamentais em suas construções de Passado, Presente e Futuro pronominal.",
    badgeId: "badge_verbos",
    xpValue: 160,
    lessons: [
      {
        id: "l_14_1",
        moduleId: "modulo_14",
        title: "Lição 1: O Verbo Escrever (Kataba)",
        description: "Conjugue um dos verbos mais emblemáticos do Árabe clássico.",
        order: 1,
        portuguese: "Ele escreveu / Eu escrevo",
        arabic: "كتب / أنا أكتب",
        pronunciation: "Kataba / Ana aktubu",
        phraseArabic: "أنا أكتب رسالة باللغة العربية",
        phrasePronunciation: "Ana aktubu risalatan bil-lughati al-'arabiyya",
        phrasePortuguese: "Eu estou escrevendo uma carta em língua árabe"
      }
    ]
  },
  {
    id: "modulo_15",
    title: "MÓDULO 15 – FUNDAMENTOS GRAMATICAIS",
    description: "Entenda pronomes possessivos, estruturas nominais (Idafa), gênero substantivo e plurais irregulares.",
    badgeId: "badge_gramatica",
    xpValue: 180,
    lessons: [
      {
        id: "l_15_1",
        moduleId: "modulo_15",
        title: "Lição 1: Pronomes Demonstrativos",
        description: "Aprenda a apontar termos masculinos e femininos de perto.",
        order: 1,
        portuguese: "Isto é (Masc) / Isto é (Fem)",
        arabic: "هذا / هذه",
        pronunciation: "Hadha / Hadhihi",
        phraseArabic: "هذا كتاب وهذه تفاحة",
        phrasePronunciation: "Hadha kitab wa hadhihi tuffaha",
        phrasePortuguese: "Isto é um livro e isto é uma maçã"
      }
    ]
  }
];

// Helper to acquire associated exercise questions for each lesson ID statically
export const GET_LESSON_EXERCISES = (lessonId: string): Exercise[] => {
  const exMap: { [key: string]: Exercise[] } = {
    // Lesson 1.1 Saudades exercicio
    "l_1_1": [
      {
        id: "ex_1_1_1",
        lessonId: "l_1_1",
        type: "choice",
        question: "Como se traduz o cumprimento 'Olá / Bem-vindo' para o árabe clássico?",
        arabicContext: "مرحبا",
        options: ["مرحبا (Marhaban)", "شكرا (Shukran)", "مع السلامة (Ma'a as-salama)", "أنا أحبك (Ana uhibbu)"],
        correctAnswer: "مرحبا (Marhaban)"
      },
      {
        id: "ex_1_1_2",
        lessonId: "l_1_1",
        type: "complete",
        question: "Preencha a lacuna com a saudação correta em árabe para formar 'Olá, como vai?': '______ كيف حالك'",
        arabicContext: "كيف حالك",
        options: ["مرحبا", "سروال", "ماء", "أبي"],
        correctAnswer: "مرحبا"
      },
      {
        id: "ex_1_1_3",
        lessonId: "l_1_1",
        type: "translate",
        question: "Qual o significado da frase 'Marhaban Kaifa Haluk'?",
        correctAnswer: "Olá, como você está?"
      }
    ],
    // Lesson 1.2 Despedidas
    "l_1_2": [
      {
        id: "ex_1_2_1",
        lessonId: "l_1_2",
        type: "choice",
        question: "Qual das opções é o modo correto de falar 'Até logo / Vá com paz'?",
        arabicContext: "مع السلامة",
        options: ["مرحبا", "مع السلامة (Ma'a as-salama)", "أمي وابي", "واحد"],
        correctAnswer: "مع السلامة (Ma'a as-salama)"
      }
    ],
    // Lesson 1.3 Gratidao
    "l_1_3": [
      {
        id: "ex_1_3_1",
        lessonId: "l_1_3",
        type: "choice",
        question: "Selecione o termo que traduz corretamente a palavra 'Obrigado'.",
        arabicContext: "شكرا",
        options: ["شكرا", "مع السلامة", "ازرق", "قميص"],
        correctAnswer: "شكرا"
      }
    ],
    // Lesson 1.4 Quem e vc
    "l_1_4": [
      {
        id: "ex_1_4_1",
        lessonId: "l_1_4",
        type: "choice",
        question: "Como perguntar 'Quem é você?' para um homem?",
        arabicContext: "من أنت؟",
        options: ["من أنت؟ (Man anta?)", "من فضلك", "عمري عشرون سنة", "أسفر"],
        correctAnswer: "من أنت؟ (Man anta?)"
      }
    ],
    // Lesson 2.1 Alif
    "l_2_1": [
      {
        id: "ex_2_1_1",
        lessonId: "l_2_1",
        type: "complete",
        question: "Como se desenha a primeira letra do alfabeto 'Alif'?",
        arabicContext: "أ Check",
        options: ["أ", "ب", "ت", "ج"],
        correctAnswer: "أ"
      }
    ],
    // Lesson 2.2 Ba
    "l_2_2": [
      {
        id: "ex_2_2_1",
        lessonId: "l_2_2",
        type: "choice",
        question: "Quantos pontos possui a letra Ba' (ب) e onde se situam?",
        arabicContext: "ب",
        options: ["1 ponto embaixo", "2 pontos em cima", "3 pontos no meio", "Sem pontos"],
        correctAnswer: "1 ponto embaixo"
      }
    ],
    // Lesson 2.3 Ta
    "l_2_3": [
      {
        id: "ex_2_3_1",
        lessonId: "l_2_3",
        type: "choice",
        question: "A palavra 'Tuffaha' (Maçã) começa com qual letra árabe?",
        arabicContext: "ت",
        options: ["ت (Ta')", "ب (Ba')", "أ (Alif)", "م (Mim)"],
        correctAnswer: "ت (Ta')"
      }
    ],
    "l_3_1": [
      {
        id: "ex_3_1_1",
        lessonId: "l_3_1",
        type: "choice",
        question: "Como se traduz o número 'Três' para o árabe?",
        arabicContext: "ثلاثة",
        options: ["واحد (Wahid)", "اثنان (Ithnan)", "ثلاثة (Thalatha)", "أربعة (Arba'a)"],
        correctAnswer: "ثلاثة (Thalatha)"
      }
    ],
    "l_4_1": [
      {
        id: "ex_4_1_1",
        lessonId: "l_4_1",
        type: "choice",
        question: "O que significa o termo de cor 'Azraq'?",
        arabicContext: "أزرق",
        options: ["Azul", "Vermelho", "Amarelo", "Verde"],
        correctAnswer: "Azul"
      }
    ]
  };

  // Default fallback exercise array for any undocumented lesson ID
  return exMap[lessonId] || [
    {
      id: `ex_${lessonId}_fallback`,
      lessonId: lessonId,
      type: "choice",
      question: "Qual a transliteração correta desta palavra?",
      arabicContext: "العربية",
      options: ["Al-lughah al-'Arabiyyah", "Shukran", "An-naas", "Marhaban"],
      correctAnswer: "Al-lughah al-'Arabiyyah"
    }
  ];
};

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirements: string;
}

export const BADGES_LIST: BadgeDefinition[] = [
  {
    id: "badge_passos",
    title: "Desbravador do Deserto",
    description: "Desbloqueou ou completou lições no Módulo 1 (Primeiros Passos)",
    emoji: "🐪",
    requirements: "Completar qualquer lição do Módulo 1"
  },
  {
    id: "badge_alfabeto",
    title: "Calígrafo Real",
    description: "Estudou a beleza das letras do Alfabeto Árabe",
    emoji: "✍️",
    requirements: "Completar lições do Módulo 2"
  },
  {
    id: "badge_numeros",
    title: "Mercador de Abu Dhabi",
    description: "Domine a contagem e valores do comércio árabe",
    emoji: "💰",
    requirements: "Completar lições do Módulo 3"
  },
  {
    id: "badge_cores",
    title: "Sultão do Arco-Íris",
    description: "Destrinche as cores vívidas clássicas árabe",
    emoji: "🎨",
    requirements: "Completar lições do Módulo 4"
  },
  {
    id: "badge_sheikh_chat",
    title: "Pupilo do Sheikh",
    description: "Iniciou sua primeira conversa rica com o sábio Sheikh AI",
    emoji: "🕌",
    requirements: "Conversar com o Sheikh AI"
  },
  {
    id: "badge_premium",
    title: "Membro de Elite",
    description: "Conquistou acesso de aprendizagem ilimitado Arabic Premium",
    emoji: "🌟",
    requirements: "Tornar-se membro Premium"
  }
];
