import { useEffect, useState } from "react";
import API from "../services/api";
import TopNav from "../components/TopNav";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../dashboard.css";

// Meals page handles meal creation, filtering, editing, deletion and export
const MealsPage = () => {
  // State for meal data, loading status, filters, and sorting
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [showConsumedOnly, setShowConsumedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  // Shared selected date is persisted so dashboard and meal page stay consistent
  const [selectedDate, setSelectedDate] = useState(() => {
    return (
      localStorage.getItem("selectedDate") ||
      new Date().toISOString().split("T")[0]
    );
  });

  // Form state for adding a new meal and editing existing meals
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Tracks which meal is currently being edited
  const [editingMealId, setEditingMealId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Fetch all meals for the authenticated user on page load and whenever a meal is added/edited/deleted
  useEffect(() => {
    setLoadingMeals(true);
    API.get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Meals error:", err))
      .finally(() => setLoadingMeals(false));
  }, []);

  // Update selected date and store it for use across pages
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  // Filter meals by selected date and optionally by consumed status
  const mealsForSelectedDate = meals.filter((meal) => {
    const mealDate = new Date(meal.createdAt).toISOString().split("T")[0];

    if (showConsumedOnly) {
      return mealDate === selectedDate && meal.consumed;
    }

    return mealDate === selectedDate;
  });

  // Sort all meals by calories based on selected sort order
  const sortedMeals = [...meals].sort((a, b) => {
    return sortOrder === "desc"
      ? b.calories - a.calories
      : a.calories - b.calories;
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create a new meal through the backend API and update local state on success
  const addMeal = (e) => {
    e.preventDefault();

    const mealData = {
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      consumed: false,
    };

    // Send new meal data to backend and update meals list on success
    API.post("/meals", mealData)
      .then((res) => {
        setMeals((prev) => [...prev, res.data]);
        setForm({
          name: "",
          calories: "",
          protein: "",
          carbs: "",
          fats: "",
        });
        toast.success("Meal added successfully!");
      })
      .catch((err) => console.error("Add meal error:", err));
  };

  // Load selected meal values into edit form when user clicks edit button
  const startEdit = (meal) => {
    setEditingMealId(meal._id);
    setEditForm({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

// Save edited meal values to the backend and update local state on success
  const saveEdit = (id) => {
    API.put(`/meals/${id}`, {
      ...editForm,
      calories: Number(editForm.calories),
      protein: Number(editForm.protein),
      carbs: Number(editForm.carbs),
      fats: Number(editForm.fats),
    })
      .then((res) => {
        setMeals((prev) =>
          prev.map((meal) => (meal._id === id ? res.data : meal))
        );
        setEditingMealId(null);
        toast.success("Meal updated successfully!");
      })
      .catch((err) => console.error("Edit meal error:", err));
  };

  // Delete meal from backend and remove it from local state on success
  const deleteMeal = (id) => {
    API.delete(`/meals/${id}`)
      .then(() => {
        setMeals((prev) => prev.filter((meal) => meal._id !== id));
        toast.success("Meal deleted successfully!");
      })
      .catch((err) => console.error("Delete meal error:", err));
  };

  // Toggle whether a meal has been consumed and update backend and local state 
  const toggleMealConsumed = (meal) => {
    API.put(`/meals/${meal._id}`, {
      ...meal,
      consumed: !meal.consumed,
    })
      .then((res) => {
        setMeals((prev) =>
          prev.map((m) => (m._id === meal._id ? res.data : m))
        );
      })
      .catch((err) => console.error("Toggle meal error:", err));
  };

  // Export current meal list as a CSV file
  const exportMeals = () => {
    const csv = [
      ["Name", "Calories", "Protein", "Carbs", "Fats"],
      ...meals.map((m) => [m.name, m.calories, m.protein, m.carbs, m.fats]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "meals.csv";
    a.click();

    toast.success("Meals exported successfully!");
  };

  return (
    <div className="container">
      <TopNav />

      {/* Page header with navigation back to dashboard */}
      <header className="dashboard-header">
        <div>
          <h1>Meals</h1>
          <p className="subtitle">
            Track planned meals, consumed meals, and nutrition intake.
          </p>
        </div>
        <Link to="/">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          {/* Form for adding a new meal */}
          <div className="card">
            <h3>Add Meal to Today</h3>
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
              <button type="submit">
                Add Meal
              </button>
            </form>
          </div>

          {/* Date selector used to filter meals */}
          <div className="card date-card">
            <h3>Calendar & Meal Date</h3>
            <div className="date-selector">
              <label>📅 Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          {/* Meals filtered by selected date */}
          <div className="card">
            <h3>Meals for Selected Date</h3>

            <h4>
              {mealsForSelectedDate.filter((m) => m.consumed).length} /{" "}
              {mealsForSelectedDate.length} meals completed
            </h4>

            <button
              onClick={() => setShowConsumedOnly(!showConsumedOnly)}
              style={{ marginBottom: "10px" }}
            >
              {showConsumedOnly ? "Show All Meals" : "Show Consumed Only"}
            </button>

            {mealsForSelectedDate.length === 0 ? (
              <p>No meals logged for this date.</p>
            ) : (
              <ul className="meal-list">
                {mealsForSelectedDate.map((meal) => (
                  <li key={meal._id} className="meal-item">
                    <div>
                      <strong>{meal.name}</strong>
                      <p>
                        {meal.calories} kcal | P: {meal.protein}g | C:{" "}
                        {meal.carbs}g | F: {meal.fats}g
                      </p>
                    </div>

                    <div>
                      <button onClick={() => toggleMealConsumed(meal)}>
                        {meal.consumed ? "✅" : "⬜"}
                      </button>

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

          {/* Full meal list with sorting, editing, deleting and export */}
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

            <button onClick={exportMeals} style={{ marginBottom: "10px" }}>
              Export Meals (CSV)
            </button>

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
                        <p className="meal-date">
                          {new Date(meal.createdAt).toLocaleDateString()}
                        </p>

                        <div>
                          <button onClick={() => toggleMealConsumed(meal)}>
                            {meal.consumed ? "✅" : "⬜"}
                          </button>

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
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MealsPage;