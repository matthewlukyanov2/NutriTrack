import { useState } from "react";
import API from "../services/api";
import TopNav from "../components/TopNav";
import { Link } from "react-router-dom";
import "../dashboard.css";

// Page for displaying AI-generated meal recommendations based on user data
const RecommendationsPage = () => {
  // Stores AI-generated recommendations and loading state
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Fetch personalized recommendations from backend LLM endpoint and update state
  const getRecommendations = () => {
    setLoadingRecs(true);

    // Call OpenAI-backed endpoint to generate meal suggestions based on user's meals and goals
    API.get("/llm/meals")
      .then((res) => {
        const data = res.data.recommendations || [];
        setRecommendations(data);
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecs(false));
  };

  return (
    <div className="container">
      <TopNav />

      {/* Page header with navigation back to dashboard */}
      <header className="dashboard-header">
        <div>
          <h1>Recommendations</h1>
          <p className="subtitle">
            Get personalized nutrition suggestions based on your meals and progress.
          </p>
        </div>
        <Link to="/">
          <button className="back-dashboard-btn">Back to Dashboard</button>
        </Link>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          {/* Main card displaying AI recommendations */}
          <div className="card recommendations-card">
            <h3>AI Recommendations</h3>

            <p className="recommendation-text">
              Use intelligent suggestions to improve your nutrition choices.
            </p>

            {/* Trigger AI recommendation generation */}
            <button className="recommend-btn" onClick={getRecommendations}>
              Get Recommendations
            </button>

            {/* Show loading state while AI response is being generated */}
            {loadingRecs ? (
              <p className="loading">Thinking 🤖...</p>
            ) : recommendations.length === 0 ? null : (
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index}>
                    <strong>{rec.name}</strong>
                    <br />
                    <small>{rec.reason}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;