import { useEffect, useState } from "react";
import API from "../services/api";
import "../dashboard.css";
import { logout } from "../utils/auth";

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  // Fetch meals on load
  useEffect(() => {
    API.get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Meals error:", err));
  }, []);

  // Get AI recommendations
  const getRecommendations = () => {
    API.get("/recommendations/meals")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.recommendations || [];
        setRecommendations(data);
      })
      .catch((err) => {
        console.error("Recommendations error:", err);
        setRecommendations([]);
      });
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add meal
  const addMeal = (e) => {
    e.preventDefault();

    const mealData = {
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats)
    };

    API.post("/meals", mealData)
      .then((res) => {
        setMeals((prev) => [...prev, res.data]);
        setForm({
          name: "",
          calories: "",
          protein: "",
          carbs: "",
          fats: ""
        });
      })
      .catch((err) => console.error("Add meal error:", err));
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <button className="logout" onClick={logout}>Logout</button>

      {/* Add Meal */}
      <h3>Add Meal</h3>
      <form onSubmit={addMeal}>
        <input
          type="text"
          name="name"
          placeholder="Meal name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="protein"
          placeholder="Protein"
          value={form.protein}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="carbs"
          placeholder="Carbs"
          value={form.carbs}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="fats"
          placeholder="Fats"
          value={form.fats}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Meal</button>
      </form>

      {/* Meals */}
      <div className="section">
      <h3>Your Meals</h3>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id} className="card">
            <span>{meal.name} — {meal.calories} kcal</span>
          </li>
        ))}
      </ul>
      </div>

      {/* Recommendations */}
      <div className="section">
      <h3>AI Recommendations</h3>
      <button onClick={getRecommendations}>Get Recommendations</button>

      <ul>
        {recommendations.map((meal) => (
          <li key={meal._id} className="card">
          <span>{meal.name}</span>
        </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Dashboard;
