const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (data) => {
  await delay(800);
  
  // Demo credentials
  if (data.email === "admin@gmail.com" && data.password === "123456") {
    const userData = {
      id: "1",
      name: "Admin User",
      email: data.email,
      role: "receptionist",
    };
    const token = "mock-jwt-token-123456";
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    return {
      success: true,
      user: userData,
      token: token,
    };
  }
  
  throw new Error("Invalid credentials");
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  await delay(300);
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  throw new Error("No user found");
};