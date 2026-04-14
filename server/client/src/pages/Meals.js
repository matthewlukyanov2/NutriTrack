import {  useEffect, useState } from "react";

function Meals() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/meals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setMeals(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Your Meals</h2>
      <ul>
        {meals.map(meal => (
          <li key={meal._id}>
            {meal.name} — {meal.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Meals;
