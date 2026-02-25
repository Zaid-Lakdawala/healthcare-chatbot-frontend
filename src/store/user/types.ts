

export interface ILoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface IRegisterRequest {
  name: string;           
  email: string;
  password: string;
  dob: string;           
  gender: string;        
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  dob: { $date: string };
  gender: string;
  role: string;
  created_at: { $date: string };
  updated_at: { $date: string };
}

