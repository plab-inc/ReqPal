import axios from "axios"
import { useAuthStore } from "@/stores/auth.ts";

const authStore = useAuthStore();

export default axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Authorization': 'Bearer ' + authStore.sessionToken
  }
});
