import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import TopNav from "../components/TopNav";
import { logout } from "../utils/auth";
import "../dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Main dashboard overview page
// Displays user progress summaries using meal, workout and goal data
const Dashboard = () => {

  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [viewMode, setViewMode] = useState("daily");

  // Selected date is stored in localStorage so it stays consistent across pages
  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];
});

   // Loading states 
   const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

    // Load saved nutrition goals used for dashboard progress calculations
    const [nutritionGoals] = useState(() => {
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

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch meals and workouts used to calculate dashboard summaries
  useEffect(() => {
    API.get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Meals error:", err));

    API.get("/workouts")
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.error("Workouts error:", err));
  }, []);

  // Update selected date and persist it for other pages to use
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  // Update selected date and persist it for other pages
  const mealsForSelectedDate = meals.filter((meal) => {
    const mealDate = new Date(meal.createdAt).toISOString().split("T")[0];
    return mealDate === selectedDate;
  });

  const workoutsForSelectedDate = workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt).toISOString().split("T")[0];
    return workoutDate === selectedDate;
  });

  // Only consumed meals contribute to nutrition totals
  const consumedMeals = mealsForSelectedDate.filter((meal) => meal.consumed);

  // Calculate daily calories and macro totals from consumed meals
  const totals = consumedMeals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fats += meal.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const totalCalories = totals.calories;

  // Calculate total calories burned from workouts on the selected date
  const totalCaloriesBurned = workoutsForSelectedDate.reduce(
    (sum, workout) => sum + (workout.caloriesBurned || 0),
    0
  );

  const netCalories = totalCalories - totalCaloriesBurned;
  const dailyGoal = nutritionGoals.calories;
  const caloriesRemaining = Math.max(dailyGoal - totalCalories, 0);
  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100).toFixed(0);

  // Generate a simple nutrition score based on calories, protein and macro balance
  const calorieScore = Math.min(
    (totals.calories / nutritionGoals.calories) * 40,
    40
  );

  const proteinScore = Math.min(
    (totals.protein / nutritionGoals.protein) * 30,
    30
  );

  let macroBalanceScore = 0;

  if (totals.calories === 0) {
    macroBalanceScore = 0;
  } else if (totals.carbs > 0 && totals.fats > 0) {
    macroBalanceScore = 30;
  } else {
    macroBalanceScore = 15;
  }

  const nutritionScore = Math.round(
    calorieScore + proteinScore + macroBalanceScore
  );

  let scoreMessage = "";

  if (nutritionScore >= 85) {
    scoreMessage = "🔥 Excellent nutrition day!";
  } else if (nutritionScore >= 60) {
    scoreMessage = "👍 Good progress, keep going!";
  } else {
    scoreMessage = "⚡ Try to improve your nutrition goals.";
  }

  // Build the last seven dates for the weekly calorie chart
  const getLast7Days = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }

    return days;
  };

  // Prepare weekly chart data by grouping meal calories by date
  const weeklyData = getLast7Days().map((day) => {
    const total = meals
      .filter((meal) => {
        const mealDate = new Date(meal.createdAt).toISOString().split("T")[0];
        return mealDate === day;
      })
      .reduce((sum, meal) => sum + (meal.calories || 0), 0);

    return {
      date: day.slice(5),
      calories: total,
    };
  });

  // Update selected date and persist it for other pages
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container">
      <TopNav />

      <header className="dashboard-header" id="dashboard">
        <div>
          <h1>Welcome back, {username}!</h1>
          <p className="subtitle">Ready to crush your goals today?</p>
        </div>

        <div className="header-actions">
        <button className="logout" onClick={logout}>
          Logout
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">


          <div className="view-toggle">
            <button
              className={viewMode === "daily" ? "active-toggle" : ""}
              onClick={() => setViewMode("daily")}
            >
              Daily
            </button>

            <button
              className={viewMode === "weekly" ? "active-toggle" : ""}
              onClick={() => setViewMode("weekly")}
            >
              Weekly
            </button>
          </div>

          {/* Daily progress summary */}
          {viewMode === "daily" && (
            <div className="card">
              <h3 className="progress-title">
                {selectedDate === new Date().toISOString().split("T")[0]
                  ? "Today's Progress"
                  : `Progress for ${formatDate(selectedDate)}`}
              </h3>

              <div className="nutrition-score">
                <h3>Nutrition Score</h3>

                {totals.calories === 0 ? (
                  <p>No consumed meals logged yet</p>
                ) : (
                  <>
                    <div
                      className="score-value"
                      style={{
                        color:
                          nutritionScore >= 85
                            ? "green"
                            : nutritionScore >= 50
                            ? "orange"
                            : "red",
                      }}
                    >
                      {nutritionScore} / 100
                    </div>
                    <p>{scoreMessage}</p>
                  </>
                )}
              </div>

              <h4 className="mini-section-title">Meal Progress</h4>

              <div className="calorie-stats">
                <div className="stat-box">
                  <span className="big-number">{totalCalories}</span>
                  <span>Calories Consumed</span>
                </div>

                <div className="stat-box">
                  <span className="big-number">{caloriesRemaining}</span>
                  <span>Calories Remaining</span>
                </div>
              </div>

              <h4 className="mini-section-title">Workout Impact</h4>

              <div className="calorie-stats">
                <div className="stat-box">
                  <span className="big-number">{totalCaloriesBurned}</span>
                  <span>Calories Burned</span>
                </div>

                <div className="stat-box">
                  <span
                    className="big-number"
                    style={{
                      color:
                        netCalories < 0
                          ? "green"
                          : netCalories > 0
                          ? "red"
                          : "gray",
                    }}
                  >
                    {netCalories}
                  </span>
                  <span>Net Calories</span>
                  <p style={{ fontSize: "12px", marginTop: "5px" }}>
                    {netCalories < 0
                      ? "🔥 You're in a calorie deficit!"
                      : netCalories > 0
                      ? "⚡ You're in a surplus"
                      : "⚖️ Balanced intake"}
                  </p>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Calorie Progress</span>
                  <span>{percentage}% of goal</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <h4 style={{ marginTop: "20px" }}>Macros</h4>

                <div className="macro-progress">
                  <label>
                    Protein {totals.protein}g / {nutritionGoals.protein}g
                  </label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          (totals.protein / nutritionGoals.protein) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="macro-progress">
                  <label>
                    Carbs {totals.carbs}g / {nutritionGoals.carbs}g
                  </label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          (totals.carbs / nutritionGoals.carbs) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="macro-progress">
                  <label>
                    Fats {totals.fats}g / {nutritionGoals.fats}g
                  </label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          (totals.fats / nutritionGoals.fats) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly calorie trend chart */}
          {viewMode === "weekly" && (
            <div className="card">
              <h3>Weekly Calorie Trend</h3>

              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Shared dashboard date selector */}
          <div className="card date-card">
            <h3>Dashboard Date</h3>
            <div className="date-selector">
              <label>📅 Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          {/* Meal summary preview with link to full Meals page */}
          <div className="card">
            <h3>Meal Summary</h3>
            <p>
              {mealsForSelectedDate.length} meals planned for selected date.
            </p>
            <p>{consumedMeals.length} meals consumed.</p>

            {mealsForSelectedDate.length === 0 ? (
              <p>No meals logged for this date.</p>
            ) : (
              <ul className="meal-list">
                {mealsForSelectedDate.slice(0, 3).map((meal) => (
                  <li key={meal._id} className="meal-item">
                    <div>
                      <strong>{meal.name}</strong>
                      <p>
                        {meal.calories} kcal | P: {meal.protein}g | C:{" "}
                        {meal.carbs}g | F: {meal.fats}g
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link to="/meals">
              <button>Go to Meals</button>
            </Link>
          </div>

          {/* Workout summary preview with link to full Workouts page */}
          <div className="card">
            <h3>Workout Summary</h3>
            <p>
              {workoutsForSelectedDate.length} workouts logged for selected
              date.
            </p>
            <p>{totalCaloriesBurned} calories burned.</p>

            {workoutsForSelectedDate.length === 0 ? (
              <p>No workouts logged for this date.</p>
            ) : (
              <div className="meals-grid">
                {workoutsForSelectedDate.slice(0, 3).map((workout) => (
                  <div className="meal-card" key={workout._id}>
                    <strong>{workout.name}</strong>
                    <p>
                      {workout.duration} min 🔥{" "}
                      {workout.caloriesBurned || 0} kcal
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link to="/workouts">
              <button>Go to Workouts</button>
            </Link>
          </div>
        </div>

        <div className="side-column">

          {/* Nutrition goals summary with link to Goals page */}
          <div className="card goals-card dashboard-goals-card">
  <div className="card-header-row">
    <h3>Your Goals</h3>
    <span className="goal-badge">Daily</span>
  </div>

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

  <Link to="/goals">
    <button className="edit-goals-btn">Edit Goals</button>
  </Link>
</div>

          {/* AI feature shortcut cards */}
          <div className="card recommendations-card">
            <h3>AI Recommendations</h3>
            <p>
              Get personalized suggestions based on your meals and progress.
            </p>

            <Link to="/recommendations">
              <button className="recommend-btn">Open Recommendations</button>
            </Link>
          </div>

          <div className="card">
            <h3>Smart Meal Planner</h3>
            <p>Generate a weekly meal plan using your nutrition goals.</p>

            <Link to="/meal-planner">
              <button>Open Meal Planner</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;