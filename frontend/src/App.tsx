// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
const FirstTimer = lazy(() => import("./components/FirstTimer"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Basic provider component
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FirstTimer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
