// api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4500/api", 
  withCredentials: true,
  timeout: 60000,
});



