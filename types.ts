
export enum AuthenticityType {
  REAL = 'REAL',
  AI_GENERATED = 'AI_GENERATED',
  INCONCLUSIVE = 'INCONCLUSIVE'
}

export interface AnalysisResult {
  verdict: AuthenticityType;
  confidence: number;
  reasoning: string[];
  artifactsDetected: string[];
  summary: string;
}

export interface ImagePreview {
  url: string;
  name: string;
  size: string;
  base64: string;
}
