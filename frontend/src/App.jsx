import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/home"  element={<ProtectedRoute><HomePage /></ProtectedRoute>} />   
        <Route path="/createtask"  element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
