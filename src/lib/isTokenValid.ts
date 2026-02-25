// src/utils/isTokenValid.ts
import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  exp: number;
  user_id?: string;
  email?: string;
  name?: string;
  role: string;
  [key: string]: any;
}

export function isTokenValid(): boolean {
  try {
    const token = localStorage.getItem("token");

    if (!token) return false;

    // Decode token payload
    const payload = jwtDecode<JWTPayload>(token);

    if (!payload?.exp) {
      localStorage.removeItem("token");
      return false;
    }

    // Convert exp (seconds) to milliseconds
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    // Token is invalid or corrupted → remove
    localStorage.removeItem("token");
    return false;
  }
}

export function getAuthUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = jwtDecode<JWTPayload>(token);

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return payload;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

