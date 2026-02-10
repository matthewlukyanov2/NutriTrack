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


const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [workouts, setWorkouts] = useState([]);

   // Loading states 
   const [loadingMeals, setLoadingMeals] = useState(true);
   const [loadingWorkouts, setLoadingWorkouts] = useState(true);
   const [loadingRecs, setLoadingRecs] = useState(false);
   const [sortOrder, setSortOrder] = useState("desc");

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

  // Total calories 
const totalCalories = meals.reduce(
  (sum, meal) => sum + (meal.calories || 0),
  0
);
  
//Chart data format
const chartData = meals.map((meal) => ({
  name: meal.name,
  calories: meal.calories,
}));

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
        setSuccessMessage("Meal added successfully!");
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
      })
      .catch((err) => console.error("Update workout error:", err));
  };

    // Delete workout
  const deleteWorkout = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    API.delete(`/workouts/${id}`)
      .then(() => {
        setWorkouts((prev) => prev.filter((w) => w._id !== id));
      })
      .catch((err) => console.error("Delete workout error:", err));
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
            setSuccessMessage("Meal updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
          })
          .catch((err) => console.error("Edit meal error:", err));
      };

      // Delete meal
      const deleteMeal = (id) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this meal?"
        );
    
        if (!confirmed) return;
        API.delete(`/meals/${id}`)
          .then(() => {
            setMeals((prev) => prev.filter((meal) => meal._id !== id));

            setSuccessMessage("Meal deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
          })
          .catch((err) => console.error("Delete meal error:", err));
      };      
      

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      <button className="logout" onClick={logout}>Logout</button>

      <div className="dashboard-grid">

      {/* Add Meal */}
      <div className="card">
      <h3>Add Meal</h3>
      <form onSubmit={addMeal}>
        <input
          type="text"
          name="name"
          placeholder="Meal name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="protein"
          placeholder="Protein"
          value={form.protein}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="carbs"
          placeholder="Carbs"
          value={form.carbs}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="fats"
          placeholder="Fats"
          value={form.fats}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Meal</button>
      </form>
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
      <ul>
        {sortedMeals.map((meal) => (
          <li key={meal._id} className="card">
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
              <br />
              {/* Edit icon */}
            <button onClick={() => startEdit(meal)}>
              <FaEdit />
            </button>

            {/* Delete icon */}
            <button
              onClick={() => deleteMeal(meal._id)}
              disabled={editingMealId === meal._id}
              style={{
                backgroundColor: "#ef4444",
                marginLeft: "8px",
                opacity: editingMealId === meal._id ? 0.5 : 1,
                cursor:
                  editingMealId === meal._id ? "not-allowed" : "pointer"
              }}
            >
              <FaTrash />
                </button>
            </>
          )}
        </li>
        ))}
      </ul>
      )}
      </div>

      {/* Workout Form */}
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
      <li key={workout._id} className="card">
        {editingWorkout?._id === workout._id ? (
                <>
                  <input
                    type="text"
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
                  <button onClick={() => saveWorkout(workout._id)}>Save</button>
                  <button onClick={() => setEditingWorkout(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {workout.name} — {workout.duration} min
                  <button onClick={() => setEditingWorkout(workout)}>Edit</button>
                  <button onClick={() => deleteWorkout(workout._id)}
                   disabled={editingWorkout?._id === workout._id}
                                    >
                        Delete
                               </button>
                </>
              )}
      </li>
    ))}
  </ul>
  )}
</div>


      

      {/* Recommendations */}
      <div className="card">
      <h3>AI Recommendations</h3>
      <button onClick={getRecommendations}>Get Recommendations</button>
      {loadingRecs ? (
            <p className="loading">Thinking 🤖...</p>
          ) : recommendations.length === 0 ? (
            <p className="empty">
              Click <strong>Get Recommendations</strong> to see suggestions 🤖
            </p>
          ) : (

      <ul>
        {recommendations.map((meal) => (
          <li key={meal._id} className="card">
          <span>{meal.name}</span>
        </li>
        ))}
      </ul>
      )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
