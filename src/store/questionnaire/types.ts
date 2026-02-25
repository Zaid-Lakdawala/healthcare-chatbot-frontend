export interface IQuestionnaireAnswer {
  age: string;
  gender: string;
  medical_history: string;
  medications: string;
  allergies: string;
  height: string;
  weight: string;
}

export interface IQuestionnaireSubmitRequest {
  age: string;
  gender: string;
  medical_history: string;
  medications: string;
  allergies: string;
  height: string;
  weight: string;
}

export interface IQuestionnaireSubmitResponse {
  success: boolean;
  message: string;
  data?: {
    age: string;
    gender: string;
    medical_history: string;
    medications: string;
    allergies: string;
    height: string;
    weight: string;
    submitted_at: string;
  };
}

export interface IQuestionnaireStatusResponse {
  success: boolean;
  hasSubmitted: boolean;
  data?: {
    age: string;
    gender: string;
    medical_history: string;
    medications: string;
    allergies: string;
    height: string;
    weight: string;
    submitted_at: string;
  } | null;
}

export interface IQuestion {
  id: keyof IQuestionnaireAnswer;
  question: string;
  type: "number" | "select" | "textarea";
  options?: string[];
  required: boolean;
}
