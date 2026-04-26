# NutriTrack

## Overview
NutriTrack is a full-stack web application designed to help users track their nutrition and fitness activities while providing intelligent, AI-driven insights. The system allows users to log meals and workouts, monitor progress through an interactive dashboard, and receive context-aware recommendations using a Large Language Model (LLM).

---

## Dashboard Overview

<img width="554" height="613" alt="image" src="https://github.com/user-attachments/assets/751abfc1-f174-4add-bfa0-955980915d2a" />

---

## 🚀 Features
- 🔐 Secure user authentication (JWT + bcrypt)  
- 🍽️ Meal tracking with macronutrient breakdown  
- 💪 Workout logging and calorie tracking  
- 📊 Interactive dashboard with progress visualisation  
- 🤖 AI-powered meal recommendations (OpenAI API)  
- 📅 Weekly meal planner with AI-generated plans  
- ☁️ Cloud deployment (Vercel, Render, MongoDB Atlas)  

---

## 🛠️ Technologies Used

### Frontend
- React  
- Axios  
- React Router  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Other Tools
- OpenAI API (LLM recommendations)  
- JWT (authentication)  
- bcrypt (password hashing)  
- Jest & Supertest (testing)  
- GitHub Actions (CI)  

---

## ⚙️ Setup Instructions

### 1. Clone the repository
    git clone https://github.com/matthewlukyanov2/NutriTrack.git
    cd YOUR-REPO

### 2. Backend setup
    cd server
    npm install

Create a `.env` file in `/server` with:
    MONGO_URI=your_mongodb_connection
    JWT_SECRET=your_secret_key
    OPENAI_API_KEY=your_openai_key

Run backend:
    npm start

### 3. Frontend setup
    cd client
    npm install
    npm start

---

## 🌐 Live Demo
👉 https://youtu.be/hF4hyL6cuws

---

## 📂 Project Structure
    /server → Backend API (Express, MongoDB, AI logic)
    /client → Frontend (React dashboard & pages)

---

## 🧪 Testing
Backend tests are implemented using Jest and Supertest:
    cd server
    npm test

---

## ⚠️ Notes
- AI features require a valid OpenAI API key  
- CI tests may fail if environment variables are not configured in GitHub Actions  
- AI responses are generated dynamically and may vary  

---

## 📖 Dissertation Context
This project was developed as part of a final-year dissertation exploring:
- Full-stack web development (MERN)  
- AI-driven recommendation systems  
- User engagement in fitness tracking applications  

---

## 👨‍💻 Author
Matthew Lukyanov
