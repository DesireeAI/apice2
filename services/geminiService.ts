import { LifePilar } from "../types";  // Ajuste se necessário

export const generateLifeDiagnosis = async (structuredAnswers: any[]) => {
  try {
    const res = await fetch("/.netlify/functions/generate-diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structuredAnswers, action: "generateLifeDiagnosis" }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Falha na requisição");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao gerar diagnóstico:", error);
    throw error;
  }
};

export const analyzeImpact = async (activities: any[]) => {
  try {
    const res = await fetch("/.netlify/functions/generate-diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structuredAnswers: activities, action: "analyzeImpact" }),  // Renomeie se necessário
    });

    if (!res.ok) {
      const err = await res.json();
      return err.error || "Análise de impacto indisponível no momento.";
    }

    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("Erro ao analisar impacto:", error);
    return "Análise de impacto indisponível no momento.";
  }
};
