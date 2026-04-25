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
          <div className="card goals-card dashboard-goals-card">
            <div className="card-header-row">
    <h3>Daily Nutrition Goals</h3>
    <span className="goal-badge">Daily</span>
  </div>

  {!editingGoals ? (
    <>
      <div className="goals-summary-grid">
        <div className="goal-mini-box">
          <span>Calories</span>
          <strong>{nutritionGoals.calories}</strong>
        </div>

        <div className="goal-mini-box">
          <span>Protein</span>
          <strong>{nutritionGoals.protein}g</strong>
        </div>

        <div className="goal-mini-box">
          <span>Carbs</span>
          <strong>{nutritionGoals.carbs}g</strong>
        </div>

        <div className="goal-mini-box">
          <span>Fats</span>
          <strong>{nutritionGoals.fats}g</strong>
        </div>
      </div>

      <div className="goal-actions">
        <button className="edit-goals-btn" onClick={() => setEditingGoals(true)}>
          Edit Goals
        </button>

        <button
          className="reset-goals-btn"
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
      </div>
    </>
  ) : (
    <>
      <div className="goals-form-grid">
        <label>
          Calories
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
        </label>

        <label>
          Protein
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
        </label>

        <label>
          Carbs
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
        </label>

        <label>
          Fats
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
        </label>
      </div>

      <button className="edit-goals-btn" onClick={() => setEditingGoals(false)}>
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