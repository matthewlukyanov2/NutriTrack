import { useEffect, useState } from "react";
import API from "../services/api";
import "../dashboard.css";
import { logout } from "../utils/auth";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {

  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const savedGoals = localStorage.getItem("nutritionGoals");

    return savedGoals
    ? JSON.parse(savedGoals)
    : {

      calories: 2000,
      protein: 120,
      carbs: 250,
      fats: 70
    };
  });
  
  const [editingGoals, setEditingGoals] = useState(false);
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

   // Loading states 
   const [loadingMeals, setLoadingMeals] = useState(true);
   const [loadingWorkouts, setLoadingWorkouts] = useState(true);
   const [loadingRecs, setLoadingRecs] = useState(false);
   const [sortOrder, setSortOrder] = useState("desc");
   const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Add meal form
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  // Workout form
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    duration: ""
  });

  // Workout edit state
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Edit meal form
  const [editingMealId, setEditingMealId] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fats: ""
});

useEffect(() => {
  localStorage.setItem(
    "nutritionGoals",
    JSON.stringify(nutritionGoals)
  );
}, [nutritionGoals]);

useEffect(() => {
  document.body.classList.toggle("dark", darkMode);
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  // Fetch meals on load
  useEffect(() => {
    setLoadingMeals(true);
    API.get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Meals error:", err))
      .finally(() => setLoadingMeals(false));
  }, []);

  // Fetch workouts on load
useEffect(() => {
    setLoadingWorkouts(true);
    API.get("/workouts")
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.error("Workouts error:", err))
      .finally(() => setLoadingWorkouts(false));
  }, []);

   // Sorted meals logic
  const sortedMeals = [...meals].sort((a, b) => {
    return sortOrder === "desc"
      ? b.calories - a.calories
      : a.calories - b.calories;
  });

  const mealsForSelectedDate = meals.filter((meal) => {
    const mealDate = new Date(meal.createdAt)
      .toISOString()
      .split("T")[0];
  
    return mealDate === selectedDate;
  });

  const totals = mealsForSelectedDate.reduce(
    (acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fats += meal.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const calorieScore = Math.min(
    (totals.calories / nutritionGoals.calories) * 40,
    40
  );
  
  const proteinScore = Math.min(
    (totals.protein / nutritionGoals.protein) * 30,
    30
  );
  
  const macroBalanceScore =
    totals.carbs > 0 && totals.fats > 0
      ? 30
      : 15;
  
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

  // Total calories 
const totalCalories = meals.reduce(
  (sum, meal) => sum + (meal.calories || 0),
  0
);

const dailyGoal = 2000;
const caloriesRemaining = Math.max(dailyGoal - totalCalories, 0);
const percentage = Math.min((totalCalories / dailyGoal) * 100, 100).toFixed(0);
  
//Chart data format
const chartData = meals.map((meal) => ({
  name: meal.name,
  calories: meal.calories,
}));

// Get last 7 days
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
};

const last7Days = getLast7Days();

const weeklyData = last7Days.map((day) => {
  const total = meals
    .filter((meal) => {
      const mealDate = new Date(meal.createdAt)
        .toISOString()
        .split("T")[0];
      return mealDate === day;
    })
    .reduce((sum, meal) => sum + (meal.calories || 0), 0);

  return {
    date: day.slice(5), // MM-DD
    calories: total,
  };
});


  // Get AI recommendations
  const getRecommendations = () => {
    setLoadingRecs(true);
    API.get("/recommendations/meals")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.recommendations || [];
        setRecommendations(data);
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecs(false));
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // handle workout input
  const handleWorkoutChange = (e) => {
    setWorkoutForm({
      ...workoutForm,
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
        toast.success("Meal added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => console.error("Add meal error:", err));
  };

    // Add workout
  const addWorkout = (e) => {
    e.preventDefault();

    API.post("/workouts", {
      name: workoutForm.name,
      duration: Number(workoutForm.duration)
    })
      .then((res) => {
        setWorkouts((prev) => [...prev, res.data]);
        setWorkoutForm({ name: "", duration: "" });
      })
      .catch((err) => console.error("Add workout error:", err));
  };

  // Save workout (PUT)
  const saveWorkout = (id) => {
    API.put(`/workouts/${id}`, {
      name: editingWorkout.name,
      duration: Number(editingWorkout.duration)
    })
      .then((res) => {
        setWorkouts((prev) =>
          prev.map((w) => (w._id === id ? res.data : w))
        );
        setEditingWorkout(null);
        toast.success("Workout updated successfully!");
      })
      .catch((err) => console.error("Update workout error:", err));
  };

    // Delete workout
  const deleteWorkout = (id) => {
  setWorkoutToDelete(id);
  setShowDeleteModal(true);
  };


    // Start editing a meal
    const startEdit = (meal) => {
        setEditingMealId(meal._id);
        setEditForm({
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats
        });
      };      

      // Handle edit form input
      const handleEditChange = (e) => {
        setEditForm({
          ...editForm,
          [e.target.name]: e.target.value
        });
      };
      
      // Save edited meal
      const saveEdit = (id) => {
        API.put(`/meals/${id}`, {
          ...editForm,
          calories: Number(editForm.calories),
          protein: Number(editForm.protein),
          carbs: Number(editForm.carbs),
          fats: Number(editForm.fats)
        })
          .then((res) => {
            setMeals((prev) =>
              prev.map((meal) => (meal._id === id ? res.data : meal))
            );
            setEditingMealId(null);
            toast.success("Meal updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
          })
          .catch((err) => console.error("Edit meal error:", err));
      };

      // Delete meal
      const deleteMeal = (id) => {
        setMealToDelete(id);
        setShowDeleteModal(true);
      };      

      const confirmDeleteMeal = () => {
       if (mealToDelete) {
        API.delete(`/meals/${mealToDelete}`)
          .then(() => {
            setMeals((prev) =>
              prev.filter((meal) => meal._id !== mealToDelete)
            );
      
            toast.success("Meal deleted successfully!");
          })
          .catch((err) => console.error("Delete meal error:", err));
      }
    
      if (workoutToDelete) {
        API.delete(`/workouts/${workoutToDelete}`)
          .then(() => {
            setWorkouts((prev) =>
              prev.filter((w) => w._id !== workoutToDelete)
            );
            toast.success("Workout deleted successfully!");
          })
          .catch((err) => console.error("Delete workout error:", err));
      }
    
      setTimeout(() => setSuccessMessage(""), 3000);
    
            setShowDeleteModal(false);
            setMealToDelete(null);
            setWorkoutToDelete(null);
      };
      
      const cancelDelete = () => {
        setShowDeleteModal(false);
        setMealToDelete(null);
      };
      

      return (
        <div className="container">
      
          <header className="dashboard-header">
            <div>
              <h1>My Fitness Dashboard</h1>
              <p className="subtitle">Track your nutrition & workouts</p>
            </div>

            <button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>
      
            <button className="logout" onClick={logout}>Logout</button>
          </header>
      
          {successMessage && <p className="success">{successMessage}</p>}

      <div className="dashboard-grid">

  {/* LEFT SIDE */}
  <div className="main-column">

  <div className="date-selector">
    <label>📅 Date:</label>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
  </div>

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
     
     {/* DAILY VIEW */}
{viewMode === "daily" && (
  <>
  
     {/* HERO CARD */}

     
     <div className="card">
  <h3>Today's Progress</h3>

  <div className="nutrition-score">
  <h3>Nutrition Score</h3>
  <div className="score-value">
    {nutritionScore} / 100
  </div>

  <p>{scoreMessage}</p>
</div>

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
  <label>Protein {totals.protein}g / {nutritionGoals.protein}g</label>
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(totals.protein / nutritionGoals.protein) * 100}%` }}
    ></div>
  </div>
</div>

<div className="macro-progress">
  <label>Carbs {totals.carbs}g / {nutritionGoals.carbs}g</label>
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(totals.carbs / nutritionGoals.carbs) * 100}%` }}
    ></div>
  </div>
</div>

<div className="macro-progress">
  <label>Fats {totals.fats}g / {nutritionGoals.fats}g</label>
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(totals.fats / nutritionGoals.fats) * 100}%` }}
    ></div>
  </div>
</div>
</div>

  </div>
  {/* MEAL HISTORY*/}
  <div className="card">
  <h3>Meals for Selected Date</h3>

  {mealsForSelectedDate.length === 0 ? (
    <p>No meals logged for this date.</p>
  ) : (
    <ul className="meal-list">
      {mealsForSelectedDate.map((meal, index) => (
        <li key={meal._id} className="meal-item">
        <div>
          <strong>{meal.name}</strong>
          <p>
            {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
          </p>
        </div>
      
        <div>
          <button onClick={() => startEdit(meal)}>
            <FaEdit />
          </button>
      
          <button
            onClick={() => deleteMeal(meal._id)}
            style={{ marginLeft: "8px" }}
          >
            <FaTrash />
          </button>
        </div>
      </li>
      ))}
    </ul>
  )}
</div>

</>
)}



{/* WEEKLY VIEW */}
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

    {/* Calories Summary */}
    <div className="card">
      <h3>Calories Overview</h3>

      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Total Calories: {totalCalories} kcal
      </p>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    

    {/* Meals */}
    <div className="card">
      <h3>Your Meals</h3>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
        >
          Sort by Calories (
          {sortOrder === "desc" ? "High → Low" : "Low → High"})
        </button>
      </div>

      {loadingMeals ? (
        <p className="loading">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="empty">No meals yet. Add your first meal above</p>
      ) : (
        <div className="meals-grid">
  {sortedMeals.map((meal) => (
    <div className="meal-card" key={meal._id}>
              {editingMealId === meal._id ? (
                <>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                  <input
                    name="calories"
                    type="number"
                    value={editForm.calories}
                    onChange={handleEditChange}
                  />
                  <input
                    name="protein"
                    type="number"
                    value={editForm.protein}
                    onChange={handleEditChange}
                  />
                  <input
                    name="carbs"
                    type="number"
                    value={editForm.carbs}
                    onChange={handleEditChange}
                  />
                  <input
                    name="fats"
                    type="number"
                    value={editForm.fats}
                    onChange={handleEditChange}
                  />

                  <button onClick={() => saveEdit(meal._id)}>Save</button>
                  <button onClick={() => setEditingMealId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{meal.name}</strong> — {meal.calories} kcal
                  <div>
                    <button onClick={() => startEdit(meal)}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal._id)}
                      style={{ marginLeft: "8px" }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
              </div>
          ))}
        </div>
      )}
    </div>

  </div>

  {/* RIGHT SIDE */}
  <div className="side-column">

    {/* Add Meal */}
    <div className="card">
      <h3>Add Meal</h3>
      <form onSubmit={addMeal}>
        <input type="text" name="name" placeholder="Meal name" value={form.name} onChange={handleChange} required />
        <input type="number" name="calories" placeholder="Calories" value={form.calories} onChange={handleChange} required />
        <input type="number" name="protein" placeholder="Protein" value={form.protein} onChange={handleChange} required />
        <input type="number" name="carbs" placeholder="Carbs" value={form.carbs} onChange={handleChange} required />
        <input type="number" name="fats" placeholder="Fats" value={form.fats} onChange={handleChange} required />
        <button type="submit" className="add-meal-btn">Add Meal</button>
      </form>
    </div>

    {/* Add Workout */}
    <div className="card">
      <h3>Add Workout</h3>
      <form onSubmit={addWorkout}>
        <input
          type="text"
          name="name"
          placeholder="Workout name"
          value={workoutForm.name}
          onChange={handleWorkoutChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={workoutForm.duration}
          onChange={handleWorkoutChange}
          required
        />
        <button type="submit">Add Workout</button>
      </form>
    </div>

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
      fats: 70
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
          calories: Number(e.target.value)
        })
      }
    />

    <input
      type="number"
      value={nutritionGoals.protein}
      onChange={(e) =>
        setNutritionGoals({
          ...nutritionGoals,
          protein: Number(e.target.value)
        })
      }
    />

    <input
      type="number"
      value={nutritionGoals.carbs}
      onChange={(e) =>
        setNutritionGoals({
          ...nutritionGoals,
          carbs: Number(e.target.value)
        })
      }
    />

    <input
      type="number"
      value={nutritionGoals.fats}
      onChange={(e) =>
        setNutritionGoals({
          ...nutritionGoals,
          fats: Number(e.target.value)
        })
      }
    />

    <button onClick={() => setEditingGoals(false)}>
      Save Goals
    </button>
  </>
)}
</div>

    {/* Workouts */}
    <div className="card">
      <h3>Your Workouts</h3>

      {loadingWorkouts ? (
        <p className="loading">Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="empty">No workouts yet. Time to move 💪</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
  <li key={workout._id} className="list-item">
    {editingWorkout && editingWorkout._id === workout._id ? (
      <>
        <input
          value={editingWorkout.name}
          onChange={(e) =>
            setEditingWorkout({
              ...editingWorkout,
              name: e.target.value
            })
          }
        />
        <input
          type="number"
          value={editingWorkout.duration}
          onChange={(e) =>
            setEditingWorkout({
              ...editingWorkout,
              duration: e.target.value
            })
          }
        />

        <button onClick={() => saveWorkout(workout._id)}>
          Save
        </button>
        <button onClick={() => setEditingWorkout(null)}>
          Cancel
        </button>
      </>
    ) : (
      <>
        {workout.name} — {workout.duration} min
        <button onClick={() => setEditingWorkout(workout)}>
          Edit
        </button>
        <button onClick={() => deleteWorkout(workout._id)}>
          Delete
        </button>
      </>
    )}
  </li>
))}
        </ul>
      )}
    </div>

    {/* AI Recommendations */}
    <div className="card recommendations-card">
  <h3>Recommendations</h3>

  <p className="recommendation-text"> Get personalized nutrition suggestions based on your meals and progress.</p>
      <button className="recommend-btn"  onClick={getRecommendations}>Get Recommendations</button>

      {loadingRecs ? (
  <p className="loading">Thinking 🤖...</p>
) : recommendations.length === 0 ? null : (
        <ul>
          {recommendations.map((meal) => (
            <li key={meal._id}>{meal.name}</li>
          ))}
        </ul>
      )}
    </div>

  </div>
</div>
{showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal">
    <h3>
  {mealToDelete ? "Delete Meal" : "Delete Workout"}
</h3>

<p>
  Are you sure you want to delete this{" "}
  {mealToDelete ? "meal" : "workout"}?
</p>
      <div className="modal-actions">
        <button className="confirm-btn" onClick={confirmDeleteMeal}>
          Yes, Delete
        </button>

        <button className="cancel-btn" onClick={cancelDelete}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

<ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
