import axios from "axios";

// Create an Axios instance with the base URL for the backend API 
const API = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: process.env.REACT_APP_API_URL,
});

// Attach token if exists to every request for authentication
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN BEING SENT:", token)
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
