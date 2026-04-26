export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // Clear all authentication data and redirect to login page
  export const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  