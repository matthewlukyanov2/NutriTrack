import { NavLink } from "react-router-dom";

// Shared navigation bar used across the main application pages
const TopNav = () => {
  return (
    <nav className="top-nav">
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/meals">Meals</NavLink>
      <NavLink to="/workouts">Workouts</NavLink>
      <NavLink to="/recommendations">Recommendations</NavLink>
      <NavLink to="/meal-planner">Meal Planner</NavLink>
      <NavLink to="/goals">Goals</NavLink>
    </nav>
  );
};

export default TopNav;