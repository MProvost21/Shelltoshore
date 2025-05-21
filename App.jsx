import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginPage from "./LoginPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginPage />
      </Router>
    </AuthProvider>
  );
}
