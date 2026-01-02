export interface AIProvider {
  id: string;
  name: string;
  description: string;
}

export interface AIModel {
  id: string;
  name: string;
  iconUrl?: string;
  description: string;
  model: string;
  provider: AIProvider;
  isDefault: boolean;
  isPremium: boolean;
}

export interface AIGenerateImageModelRequest {
  illustrationId: string;
  imageId: string;
  modelId: string;
  description: string;
  gestationalWeek: string;
}

interface AIModelExpenseProps {
  id: string;
  modelId: string;
  tokens: number;
  price: number;
  type: "input" | "output";
  createdAt: string;
}

export interface AIModelExpense {
  input: AIModelExpenseProps;
  output: AIModelExpenseProps;
}

export interface AIShemaModelPrice {
  id: string;
  created_at: string;
  price_per_token_generation: string;
  name: string;
  description: string | null;
  tokens_per_generation: string;
  limit_generations: string | null;
  tokens_to_generate: string | null;
  type: "input" | "output";
  quality: string;
  total_consumption: number;
}
