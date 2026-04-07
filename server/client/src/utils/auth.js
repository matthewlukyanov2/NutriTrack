export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  