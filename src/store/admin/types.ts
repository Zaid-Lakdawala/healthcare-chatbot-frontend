export interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  totalDocuments: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  dob: { $date: string };
  gender: string;
  role: string;
  status: string;
  created_at: { $date: string };
  updated_at: { $date: string };
}

export interface Conversation {
  _id: string;
  user_id: string;
  title: string;
  messages: Array<{
    _id: string;
    role: string;
    content: string;
    created_at: string;
  }>;
  ended: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
}

export interface AdminUsersResponse {
  success: boolean;
  data: User[];
  count: number;
}

export interface AdminConversationsResponse {
  success: boolean;
  data: Conversation[];
  count: number;
}
