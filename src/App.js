import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/Homepage/HomePage";
import Login from "./Components/Homepage/Login";
import DashBoard from "./Components/Dashboard/DashBoard";
import Booking from "./Components/BookingComponent/Booking";

function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
