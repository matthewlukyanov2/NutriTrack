import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import "../dashboard.css";

const GoalsPage = () => {
  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const savedGoals = localStorage.getItem("nutritionGoals");

    return savedGoals
      ? JSON.parse(savedGoals)
      : {
          calories: 2000,
          protein: 120,
          carbs: 250,
          fats: 70,
        };
  });

  const [editingGoals, setEditingGoals] = useState(false);

  useEffect(() => {
    localStorage.setItem("nutritionGoals", JSON.stringify(nutritionGoals));
  }, [nutritionGoals]);

  return (
    <div className="container">
      <TopNav />

      <header className="dashboard-header">
        <div>
          <h1>Goals</h1>
          <p className="subtitle">
            Set and manage your daily nutrition targets.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="card goals-card">
            <h3>Daily Nutrition Goals</h3>

            {!editingGoals ? (
              <>
                <p>Calories: {nutritionGoals.calories}</p>
                <p>Protein: {nutritionGoals.protein}g</p>
                <p>Carbs: {nutritionGoals.carbs}g</p>
                <p>Fats: {nutritionGoals.fats}g</p>

                <button onClick={() => setEditingGoals(true)}>
                  Edit Goals
                </button>

                <button
                  onClick={() =>
                    setNutritionGoals({
                      calories: 2000,
                      protein: 120,
                      carbs: 250,
                      fats: 70,
                    })
                  }
                >
                  Reset to Default
                </button>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={nutritionGoals.calories}
                  onChange={(e) =>
                    setNutritionGoals({
                      ...nutritionGoals,
                      calories: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  value={nutritionGoals.protein}
                  onChange={(e) =>
                    setNutritionGoals({
                      ...nutritionGoals,
                      protein: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  value={nutritionGoals.carbs}
                  onChange={(e) =>
                    setNutritionGoals({
                      ...nutritionGoals,
                      carbs: Number(e.target.value),
                    })
                  }
                />

                <input
                  type="number"
                  value={nutritionGoals.fats}
                  onChange={(e) =>
                    setNutritionGoals({
                      ...nutritionGoals,
                      fats: Number(e.target.value),
                    })
                  }
                />

                <button onClick={() => setEditingGoals(false)}>
                  Save Goals
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;