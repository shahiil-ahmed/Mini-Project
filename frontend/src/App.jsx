import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Attendance from "./pages/Attendance";
import QualityCheck from "./pages/QualityCheck";
import PaymentStatus from "./pages/PaymentStatus";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Attendance />} />
            <Route path="/quality" element={<QualityCheck />} />
            <Route path="/payment" element={<PaymentStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
