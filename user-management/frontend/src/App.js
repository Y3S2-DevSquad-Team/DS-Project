import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/UserManagement/Home";
// import Home from "../src/pages/Home";
import Login from "./pages/UserManagement/Login";
import Signup from "./pages/UserManagement/Signup";
import ErrorPage from "./pages/Errors/ServerError";
import NotFoundPage from "./pages/Errors/NotFoundPage";

// import Restaurants from "../src/pages/UserManagement/Restaurants";
// import Profile from "../src/pages/UserManagement/Profile";

function App() {
  return (
    <Router>
      <div className="bg-secondary min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/500" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
