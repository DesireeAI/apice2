
import { GoogleGenAI, Type } from "@google/genai";
import { LifePilar } from "../types";

export const generateLifeDiagnosis = async (structuredAnswers: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
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

  try {
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
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro ao gerar diagnóstico Gemini:", error);
    throw error;
  }
};

export const analyzeImpact = async (activities: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise o impacto cruzado das seguintes atividades planejadas: ${JSON.stringify(activities)}. Retorne um parágrafo curto de insight.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Análise de impacto indisponível no momento.";
  }
};
