import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import { Chatroom } from "./pages/Chatroom";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <div className="min-h-screen bg-white text-gray-800">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
          <Route path="/chat/:chatId" element={<Chatroom />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
