import { useEffect, useState } from "react";
import API from "../services/api";
import TopNav from "../components/TopNav";
import { ToastContainer, toast } from "react-toastify";
import "../dashboard.css";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    return (
      localStorage.getItem("selectedDate") ||
      new Date().toISOString().split("T")[0]
    );
  });

  const [workoutForm, setWorkoutForm] = useState({
    type: "",
    duration: "",
    caloriesBurned: "",
  });

  useEffect(() => {
    setLoadingWorkouts(true);
    API.get("/workouts")
      .then((res) => setWorkouts(res.data))
      .catch((err) => console.error("Workouts error:", err))
      .finally(() => setLoadingWorkouts(false));
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  const workoutsForSelectedDate = workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt).toISOString().split("T")[0];
    return workoutDate === selectedDate;
  });

  const handleWorkoutChange = (e) => {
    setWorkoutForm({
      ...workoutForm,
      [e.target.name]: e.target.value || "",
    });
  };

  const addWorkout = (e) => {
    e.preventDefault();

    API.post("/workouts", {
      name: workoutForm.type,
      duration: Number(workoutForm.duration),
      caloriesBurned: Number(workoutForm.caloriesBurned),
    })
      .then((res) => {
        setWorkouts((prev) => [...prev, res.data]);
        setWorkoutForm({
          type: "",
          duration: "",
          caloriesBurned: "",
        });
        toast.success("Workout added successfully!");
      })
      .catch((err) => console.error("Add workout error:", err));
  };

  const saveWorkout = (id) => {
    API.put(`/workouts/${id}`, {
      name: editingWorkout.name,
      duration: Number(editingWorkout.duration),
      caloriesBurned: Number(editingWorkout.caloriesBurned || 0),
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

  const deleteWorkout = (id) => {
    API.delete(`/workouts/${id}`)
      .then(() => {
        setWorkouts((prev) => prev.filter((w) => w._id !== id));
        toast.success("Workout deleted successfully!");
      })
      .catch((err) => console.error("Delete workout error:", err));
  };

  return (
    <div className="container">
      <TopNav />

      <header className="dashboard-header">
        <div>
          <h1>Workouts</h1>
          <p className="subtitle">
            Track exercise sessions, calories burned, and energy balance.
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="card">
            <h3>Add Workout Session</h3>
            <form onSubmit={addWorkout}>
              <input
                type="text"
                name="type"
                placeholder="Workout type"
                value={workoutForm.type || ""}
                onChange={handleWorkoutChange}
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={workoutForm.duration || ""}
                onChange={handleWorkoutChange}
                required
              />
              <input
                type="number"
                name="caloriesBurned"
                placeholder="Calories burned"
                value={workoutForm.caloriesBurned || ""}
                onChange={handleWorkoutChange}
                required
              />
              <button type="submit">Add Workout</button>
            </form>
          </div>

          <div className="card date-card">
            <h3>Calendar & Workout Date</h3>
            <div className="date-selector">
              <label>📅 Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="card">
            <h3>Workouts for Selected Date</h3>

            {loadingWorkouts ? (
              <p className="loading">Loading workouts...</p>
            ) : workoutsForSelectedDate.length === 0 ? (
              <p className="empty">No workouts logged for this date.</p>
            ) : (
              <div className="meals-grid">
                {workoutsForSelectedDate.map((workout) => (
                  <div className="meal-card" key={workout._id}>
                    {editingWorkout && editingWorkout._id === workout._id ? (
                      <>
                        <input
                          value={editingWorkout.name}
                          onChange={(e) =>
                            setEditingWorkout({
                              ...editingWorkout,
                              name: e.target.value,
                            })
                          }
                        />

                        <input
                          type="number"
                          value={editingWorkout.duration}
                          onChange={(e) =>
                            setEditingWorkout({
                              ...editingWorkout,
                              duration: e.target.value,
                            })
                          }
                        />

                        <input
                          type="number"
                          value={editingWorkout.caloriesBurned || ""}
                          onChange={(e) =>
                            setEditingWorkout({
                              ...editingWorkout,
                              caloriesBurned: e.target.value,
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
                        <strong>{workout.name}</strong>

                        <p style={{ fontSize: "12px", opacity: 0.7 }}>
                          {new Date(workout.createdAt).toLocaleDateString()}
                        </p>

                        <p>
                          {workout.duration} min 🔥{" "}
                          {workout.caloriesBurned || 0} kcal
                        </p>

                        <button onClick={() => setEditingWorkout(workout)}>
                          Edit
                        </button>
                        <button onClick={() => deleteWorkout(workout._id)}>
                          Delete
                        </button>
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

export default WorkoutsPage;