export interface Consultation {
  id: string;
  user_id?: string;
  chat_id: string;
  summary: string;
  severity: "low" | "medium" | "high";
  status: "pending" | "accepted" | "active" | "closed";
  assigned_doctor_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ConsultationMessage {
  _id: string;
  consultation_id: string;
  sender: "doctor" | "user";
  message: string;
  timestamp: string;
}

export interface ConsultationResponse {
  success: boolean;
  consultation: Consultation;
  message?: string;
}

export interface ConsultationListResponse {
  success: boolean;
  consultations: Consultation[];
}

export interface ConsultationMessagesResponse {
  success: boolean;
  messages: ConsultationMessage[];
}
