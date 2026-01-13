import { useState } from "react";

function Meals() {
  const [meals, setMeals] = useState([]);

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
