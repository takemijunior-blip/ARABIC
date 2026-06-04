import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
  }

  // Sheikh AI endpoint
  app.post("/api/sheikh-ai", async (req, res) => {
    try {
      const { action, message, history } = req.body;
      
      if (!ai) {
        return res.status(503).json({ 
          error: "Serviço de IA Sheikh AI temporariamente indisponível. Configure a chave de API no painel de segredos (Settings > Secrets)." 
        });
      }

      let systemInstruction = `Você é o "Sheikh AI", um professor virtual sábio, acolhedor, experiente e muito bem-humorado, dedicado a ensinar o idioma árabe para falantes de português do Brasil de forma didática e progressiva.

Seu objetivo é guiar o aluno em suas dúvidas, corrigir pronúncias transliteradas, avaliar erros ortográficos de escrita árabe, destrinchar dúvidas sobre gramática clássica e dialetos, e criar testes personalizados excelentes.

Suas diretrizes de formatação de resposta são:
1. Sempre organize o texto com parágrafos legíveis e itens escaneáveis usando negrito e símbolos.
2. Sempre que introduzir uma palavra ou frase original em Árabe (ex: مرحبا), você DEVE obrigatoriamente fornecer:
   - A escrita em árabe elegante.
   - A pronúncia transliterada legível foneticamente para o público falante de português.
   - A tradução literal ou contextual para o português.
   - Exemplo: **مرحبا** (*Márhaban*) - Olá / Bem-vindo.
3. Se o campo "action" estiver definido, foque na tarefa específica:
   - "chat": Interaja de forma livre e conversacional. Se o usuário falar em árabe, responda de forma simples com tradução. Encoraje-o a se expressar.
   - "pronunciation": Explique didaticamente os sons das letras, as diferenças entre as vogais curtas e longas e dê dicas de como posicionar a língua/garganta.
   - "writing": Analise erros de conexão de letras, ortografia árabe ou estrutura sintática e apresente conselhos generosos de correção.
   - "grammar": Decomponha regras gramaticais claras com exemplos simples e tabelas se necessário (gênero masculino/feminino, plurais, pronomes pessoais e possessivos).
   - "custom_exercises": Crie 3 exercícios rápidos de fixação em português sobre o assunto pedido. No fim da resposta, apresente as respostas comentadas com clareza.

Utilize emojis elegantes de forma moderada para reter o caráter de mentoria (🕌, 🐪, ✍️, 📖, ✨, 🌟). Mantenha as respostas acolhedoras e afetuosas, sempre motivando o usuário! É muito importante ajudá-los para manter seus streaks de estudo ativos!`;

      let prompt = "";
      if (action === "chat") {
        prompt = message || "Olá Sheikh AI, estou pronto para aprender mais árabe hoje!";
      } else if (action === "pronunciation") {
        prompt = `Preciso de conselhos e correções sobre como pronunciar isto: "${message}"`;
      } else if (action === "writing") {
        prompt = `Por favor analise e corrija a escrita desta tentativa em árabe: "${message}"`;
      } else if (action === "grammar") {
        prompt = `Por favor, explique didaticamente as regras de gramática árabe contidas em: "${message}"`;
      } else if (action === "custom_exercises") {
        prompt = `Crie exatamente 3 exercícios fáceis de fixação sobre: "${message}" com ganchos culturais ou práticos.`;
      } else {
        prompt = message;
      }

      // Build history if array format
      let contents: any[] = [];
      if (history && Array.isArray(history)) {
        contents = history.slice(-8).map((m: any) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));
      }

      // Append active user request
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Sheikh AI error handler:", error);
      res.status(500).json({ error: error?.message || "Ocorreu um erro ao consultar o Sheikh AI de prontidão." });
    }
  });

  // Setup Vite development environment or production static file assets
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT} [ENV:${process.env.NODE_ENV || "development"}]`);
  });
}

startServer();
