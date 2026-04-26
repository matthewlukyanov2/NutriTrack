import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import "../dashboard.css";

// Goals page allows users to view and update daily nutrition targets
const GoalsPage = () => {
  // Load nutrition goals from localStorage to persist user preferences
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

  // Toggle between view mode and edit mode for goals
  const [editingGoals, setEditingGoals] = useState(false);

  // Save updated goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("nutritionGoals", JSON.stringify(nutritionGoals));
  }, [nutritionGoals]);

  return (
    <div className="container">
      <TopNav />
      
      {/* Page header with navigation back to dashboard */}
      <header className="dashboard-header">
        <div>
          <h1>Goals</h1>
          <p className="subtitle">
            Set and manage your daily nutrition targets.
          </p>
        </div>
        <Link to="/">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          {/* Main goals card displaying current targets or edit form */}
          <div className="card goals-card dashboard-goals-card">
            <div className="card-header-row">
    <h3>Daily Nutrition Goals</h3>
    <span className="goal-badge">Daily</span>
  </div>

  {/* Display current goals when not editing */}
  {!editingGoals ? (
    <>
      {/* Summary view of all nutrition goal values */}
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

      {/* Action buttons for editing or resetting goals */}
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
      {/* Input fields for each nutrition goal */}
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
      
      {/* Save updated goals and exit edit mode */}
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