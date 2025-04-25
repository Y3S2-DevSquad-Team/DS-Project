import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../src/pages/UserManagement/Home";
// import Home from "../src/pages/Home";
import Login from "../src/pages/UserManagement/Login";
import Signup from "../src/pages/UserManagement/Signup";
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
          {/* <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
