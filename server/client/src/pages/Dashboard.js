import { useEffect, useState } from "react";
import { getToken, logout } from "../utils/auth";

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

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

  const getRecommendations = () => {
    fetch("http://localhost:5000/api/recommendations/meals", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // ensure data is an array
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else if (Array.isArray(data.recommendations)) {
          // some APIs return { recommendations: [...] }
          setRecommendations(data.recommendations);
        } else {
          console.error("Unexpected recommendations format:", data);
          setRecommendations([]);
        }
      })
      .catch(err => {
        console.error(err);
        setRecommendations([]);
      });
  };


  return (
    <div className="container">
      <h2>Dashboard</h2>
      <button className="logout" onClick={logout}>Logout</button>

      <h3>Your Meals</h3>
      <ul>
        {meals.map(meal => (
          <li key={meal._id}>
            {meal.name} — {meal.calories} kcal
          </li>
        ))}
      </ul>

      {/* Recommendations Section */}
      <h3>AI Recommendations</h3>
      <button onClick={getRecommendations}>Get Recommendations</button>

      <ul>
        {recommendations.map((meal, index) => (
          <li key={index}>{meal.name}</li>
        ))}
      </ul>

    </div>
  );
};

export default Dashboard;
