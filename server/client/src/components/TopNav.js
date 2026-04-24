import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

const TopNav = () => {
  return (
    <nav className="top-nav">
      <Link to="/">Dashboard</Link>
      <Link to="/meals">Meals</Link>
      <Link to="/workouts">Workouts</Link>
      <Link to="/recommendations">Recommendations</Link>
      <Link to="/meal-planner">Meal Planner</Link>
      <Link to="/goals">Goals</Link>
      <button onClick={logout} className="logout">
        Logout
      </button>
    </nav>
  );
};

export default TopNav;