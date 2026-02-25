import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {API_BASE_URL} from "@/lib/constants.ts";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { isTokenValid } from "@/lib/isTokenValid";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL, // your Flask API base URL
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token && isTokenValid()) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      localStorage.removeItem("token");
    }

    // Don't force Content-Type for FormData - let browser set multipart/form-data
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});