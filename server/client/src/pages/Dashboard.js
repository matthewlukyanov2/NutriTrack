import { useEffect, useState } from "react";
import API from "../services/api";
import "../dashboard.css";
import { logout } from "../utils/auth";
import { FaEdit, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Add meal form
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

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
    API.get("/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("Meals error:", err));
  }, []);

  // Get AI recommendations
  const getRecommendations = () => {
    API.get("/recommendations/meals")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.recommendations || [];
        setRecommendations(data);
      })
      .catch((err) => {
        console.error("Recommendations error:", err);
        setRecommendations([]);
      });
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
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
        if (!window.confirm("Are you sure you want to delete this meal?")) return;
      
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

      {/* Add Meal */}
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

      {/* Meals */}
      <div className="section">
      <h3>Your Meals</h3>
      <ul>
        {meals.map((meal) => (
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
      </div>

      

      {/* Recommendations */}
      <div className="section">
      <h3>AI Recommendations</h3>
      <button onClick={getRecommendations}>Get Recommendations</button>

      <ul>
        {recommendations.map((meal) => (
          <li key={meal._id} className="card">
          <span>{meal.name}</span>
        </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Dashboard;
