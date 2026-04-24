import { useState } from "react";
import API from "../services/api";
import TopNav from "../components/TopNav";
import "../dashboard.css";

const MealPlannerPage = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [openDays, setOpenDays] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const getMealPlan = () => {
    setLoadingPlan(true);

    API.get("/llm/meal-plan")
      .then((res) => {
        setMealPlan(res.data.days);
      })
      .catch((err) => {
        console.error("Meal plan error:", err);
      })
      .finally(() => setLoadingPlan(false));
  };

  const addMealFromPlan = (mealName) => {
    API.post("/meals", {
      name: mealName,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      consumed: false,
    })
      .then(() => {
        API.get("/meals");
      })
      .catch((err) => {
        console.error("Add meal from plan error:", err);
      });
  };

  return (
    <div className="container">
      <TopNav />

      <header className="dashboard-header">
        <div>
          <h1>Smart Meal Planner</h1>
          <p className="subtitle">
            Generate weekly meal ideas using AI planning support.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="card">
            <h3>Smart Meal Planner</h3>

            <button onClick={getMealPlan} disabled={loadingPlan}>
              {loadingPlan ? "Generating..." : "Generate Weekly Plan"}
            </button>

            {mealPlan && (
              <>
                <button onClick={getMealPlan} className="regen-btn">
                  🔄 Regenerate Plan
                </button>

                <div className="meal-plan-grid">
                  {mealPlan.map((day, index) => {
                    const labels = ["🍳 Breakfast", "🥗 Lunch", "🍽️ Dinner"];

                    return (
                      <div
                        key={index}
                        className={`meal-day-card ${
                          day.day === today ? "today" : ""
                        }`}
                      >
                        <h4
                          onClick={() => {
                            setOpenDays((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index]
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          📅 {day.day}
                        </h4>

                        {openDays.includes(index) &&
                          day.meals.map((meal, i) => (
                            <div key={i} className="meal-row">
                              <span className="meal-label">{labels[i]}</span>
                              <span className="meal-text">{meal}</span>

                              <button
                                onClick={() => addMealFromPlan(meal)}
                                style={{ marginTop: "5px", fontSize: "12px" }}
                              >
                                ➕ Add to Today
                              </button>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerPage;