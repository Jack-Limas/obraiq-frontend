import { apiClient } from "./api-client";
import { useMutation } from "@tanstack/react-query";

export function useAskAssistant() {
  return useMutation({
    // locale lets the answer use the translated labels of the interface language
    mutationFn: async ({ question, locale }: { question: string; locale: string }) => {
      const { data } = await apiClient.post<{ data: { answer: string } }>("/assistant/ask", { question, locale });
      return data.data.answer;
    },
  });
}