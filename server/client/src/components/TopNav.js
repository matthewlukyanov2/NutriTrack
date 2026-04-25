import { Link } from "react-router-dom";

const TopNav = () => {
  return (
    <nav className="top-nav">
      <Link to="/">Dashboard</Link>
      <Link to="/meals">Meals</Link>
      <Link to="/workouts">Workouts</Link>
      <Link to="/recommendations">Recommendations</Link>
      <Link to="/meal-planner">Meal Planner</Link>
      <Link to="/goals">Goals</Link>
    </nav>
  );
};

export default TopNav;