import readline from "readline";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Inicializa o cliente usando sua GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Interface do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function perguntarIA(pergunta) {
  try {
    const resposta = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Você é um assistente que responde dúvidas de iniciantes sobre carreira em TI, programação e estágios. " +
        "Seja claro, objetivo, amigável e dê exemplos práticos quando fizer sentido.\n\n" +
        "Pergunta do usuário: " +
        pergunta,
    });

    // A doc oficial mostra que o texto vem em `response.text`
    // https://ai.google.dev/gemini-api/docs :contentReference[oaicite:1]{index=1}
    return resposta.text;
  } catch (error) {
    console.error("Erro ao chamar o Gemini:\n", error);
    return "❌ Ocorreu um erro ao tentar obter a resposta da IA.";
  }
}

function iniciarChat() {
  console.log("🤖 FAQ Inteligente sobre Carreira em TI (Gemini API Oficial)");
  console.log("Digite sua pergunta ou 'sair' para encerrar.\n");

  rl.question("Você: ", async (input) => {
    if (input.toLowerCase() === "sair") {
      console.log("Chat encerrado. Até mais!");
      rl.close();
      return;
    }

    const resposta = await perguntarIA(input);
    console.log("\nIA:", resposta, "\n");

    iniciarChat(); // repete o loop
  });
}

iniciarChat();
