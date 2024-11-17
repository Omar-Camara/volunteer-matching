import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Modal from "./components/Modal";
import "./App.css"; // Add this to style your components, especially the taskbar
import LoginForm from "./Login/LoginForm";

function App() {
  return (
    <Router>
      <div>
        {/* Top Taskbar */}
        <nav className="taskbar">
          <ul className="taskbar-list">
            <li className="taskbar-item">
              <Link to="/">Home</Link>
            </li>
            <li className="taskbar-item">
              <Link to="/opportunities">Opportunities</Link>
            </li>
            <li className="taskbar-item">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="taskbar-item">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home Page Component
function Home() {
  return (
    <div className="container">
      <h1>Welcome to the Volunteer Portal</h1>
      <p>This is the home page. Navigate to see opportunities or contact us.</p>
    </div>
  );
}

// Opportunities Page Component
function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch opportunities from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/opportunities")
      .then((response) => {
        setOpportunities(response.data);
      })
      .catch((error) => console.error("Error fetching opportunities:", error));
  }, []);

  const applyForOpportunity = (opportunityId) => {
    axios
      .post("http://127.0.0.1:5000/apply", {
        name,
        email,
        volunteer_id: opportunityId,
        title: selectedOpportunity.title,
      })
      .then((response) => {
        setModalMessage(response.data.message);
        setShowMessageModal(true);
        setShowApplyModal(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || "Unknown error";
        setModalMessage(`Error: ${errorMessage}`);
        setShowMessageModal(true);
      });
  };

  const openApplyModal = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplyModal(true);
  };

  return (
    <div className="container">
      <h1>Volunteer Opportunities</h1>
      <ul>
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <h2>{opportunity.title}</h2>
            <p>{opportunity.description}</p>
            <p>
              <strong>Location:</strong> {opportunity.location}
            </p>
            <button onClick={() => openApplyModal(opportunity)}>Apply</button>
          </li>
        ))}
      </ul>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)}>
        <h3>Apply for: {selectedOpportunity?.title}</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={() => applyForOpportunity(selectedOpportunity.id)}>
          Submit
        </button>
      </Modal>
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

// Contact Page Component
function Contact() {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>You can reach us at: volunteer@example.com</p>
    </div>
  );
}

export default App;
