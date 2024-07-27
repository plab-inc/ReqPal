import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

httpClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Zugriff auf den Auth-Store
    if (authStore.sessionToken) {
      config.headers["Authorization"] = `Bearer ${authStore.sessionToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
