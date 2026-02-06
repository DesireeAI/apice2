import { GoogleGenAI, Type } from "@google/genai";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { structuredAnswers, action } = JSON.parse(event.body || "{}");

    if (!structuredAnswers || !action) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing structuredAnswers or action" }) };
    }

    const apiKey = process.env.API_KEY || process.env.VITE_API_KEY;  // Use sem VITE_ no server-side

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Chave API não configurada" }) };
    }

    const ai = new GoogleGenAI({ apiKey });

    if (action === "generateLifeDiagnosis") {
      const prompt = `
        // Coloque aqui o prompt completo da generateLifeDiagnosis
        Analise o diagnóstico de vida do usuário baseado em um questionário estruturado de 25 perguntas.
        O usuário busca ALTA PERFORMANCE INTEGRAL.
        
        Respostas enviadas:
        ${JSON.stringify(structuredAnswers)}
        
        Sua tarefa:
        1. Calcule um score (0-100) para cada pilar baseado nas alternativas escolhidas. 
           - Alternativas de baixo impacto = 0-20
           - Alternativas medianas = 40-60
           - Alternativas de alta performance = 80-100
        2. Identifique o "Foco da Temporada" (o pilar mais crítico ou com maior potencial de alavancagem).
        3. Sugira 3 a 5 "Ações Dose Mínima Eficaz (MED)".
        4. Gere uma Análise Integrada de impacto cruzado curta e direta.
        
        IMPORTANTE: O objeto 'pilarScores' DEVE conter exatamente estas chaves: "Saúde", "Profissional", "Financeiro", "Espiritual", "Pessoal".
        
        Retorne os dados estritamente em formato JSON seguindo o esquema solicitado.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weeklyFocus: { type: Type.STRING },
              pilarScores: {
                type: Type.OBJECT,
                properties: {
                  "Saúde": { type: Type.NUMBER },
                  "Profissional": { type: Type.NUMBER },
                  "Financeiro": { type: Type.NUMBER },
                  "Espiritual": { type: Type.NUMBER },
                  "Pessoal": { type: Type.NUMBER }
                },
                required: ["Saúde", "Profissional", "Financeiro", "Espiritual", "Pessoal"]
              },
              medActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              impactAnalysis: { type: Type.STRING }
            },
            required: ["weeklyFocus", "pilarScores", "medActions", "impactAnalysis"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Modelo não retornou conteúdo.");
      return { statusCode: 200, body: JSON.stringify(JSON.parse(text)) };
    } else if (action === "analyzeImpact") {
      const prompt = `Analise o impacto cruzado das seguintes atividades planejadas: ${JSON.stringify(structuredAnswers)}. Retorne um parágrafo curto de insight.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return { statusCode: 200, body: JSON.stringify({ text: response.text }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Ação inválida" }) };
    }
  } catch (error: any) {
    console.error("Erro na function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "Falha na IA" }) };
  }
};