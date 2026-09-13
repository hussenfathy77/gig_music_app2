import { ApiConfig } from "@/constants/api";

export const API_BASE_URL = ApiConfig.baseUrl.replace(/\/$/, "");
export const ACCESS_TOKEN_KEY = "music_app_access_token";
export const REFRESH_TOKEN_KEY = "music_app_refresh_token";
