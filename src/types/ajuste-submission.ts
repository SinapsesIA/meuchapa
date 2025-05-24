
import { MelhoriaCategoriaType, MelhoriaUrgenciaType } from './melhorias';

export interface AjusteSubmissionInput {
  description: string;
  imageBase64: string;
}

export interface OpenAIAnalysisResult {
  title: string;
  category: MelhoriaCategoriaType;
  urgency: MelhoriaUrgenciaType;
  summary: string;
}
