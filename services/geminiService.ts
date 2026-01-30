
import { GoogleGenAI, Type } from "@google/genai";

export const generateLifeDiagnosis = async (structuredAnswers: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise o diagnóstico de vida do usuário baseado em um questionário estruturado de 25 perguntas (5 para cada pilar: Saúde, Profissional, Financeiro, Espiritual, Pessoal).
    O usuário busca ALTA PERFORMANCE INTEGRAL.
    
    Respostas enviadas:
    ${JSON.stringify(structuredAnswers)}
    
    Sua tarefa:
    1. Calcule um score (0-100) para cada pilar baseado nas alternativas escolhidas.
    2. Identifique o "Foco da Temporada" (o pilar mais crítico ou com maior potencial de alavancagem).
    3. Sugira 3 a 5 "Ações Dose Mínima Eficaz (MED)" - pequenas mudanças que geram grandes resultados imediatos.
    4. Gere uma Análise Integrada explicando como a melhoria em um pilar (ex: Saúde) impactará os outros (ex: Produtividade Profissional).
    
    Retorne os dados estritamente em formato JSON seguindo o esquema fornecido.
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
                Saúde: { type: Type.NUMBER },
                Profissional: { type: Type.NUMBER },
                Financeiro: { type: Type.NUMBER },
                Espiritual: { type: Type.NUMBER },
                Pessoal: { type: Type.NUMBER }
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
  const prompt = `Analise o impacto cruzado das seguintes atividades planejadas: ${JSON.stringify(activities)}. 
  Explique como elas se reforçam ou se há trade-offs negativos (ex: excesso de trabalho prejudicando saúde).`;

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
