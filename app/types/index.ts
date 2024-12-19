export interface ImageContext {
  url: string;
  description: string;
}

export interface AiResponse {
  type: 'thinking' | 'response';
  message: string;
}

export interface ImageContext {
  url: string;
  description: string;
  analysis?: {
    mood: string;
    details: string[];
    questions: string;
  };
}

export interface ImageUploadResponse {
  description: string;
  analysis: {
    mood: string;
    details: string[];
    questions: string;
  };
}
