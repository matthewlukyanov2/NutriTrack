import { useEffect, useState } from "react";
import { getToken, logout } from "../utils/auth";

const Dashboard = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/meals", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then(res => res.json())
      .then(data => setMeals(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Your Meals</h3>
      <ul>
        {meals.map(meal => (
          <li key={meal._id}>
            {meal.name} — {meal.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
