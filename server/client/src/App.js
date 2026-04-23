import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MealsPage from "./pages/MealsPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import GoalsPage from "./pages/GoalsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <MealsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <WorkoutsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meal-planner"
          element={
            <ProtectedRoute>
              <MealPlannerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
