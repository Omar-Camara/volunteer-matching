import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import './App.css'; // Add this to style your components, especially the taskbar

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
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/contact" element={<Contact />} />
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

  // Fetch opportunities from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/opportunities")
      .then((response) => setOpportunities(response.data))
      .catch((error) => console.error("Error fetching opportunities:", error));
  }, []);

  const applyForOpportunity = (opportunityId) => {
    axios
      .post("http://127.0.0.1:5000/apply", {
        name,
        volunteer_id: opportunityId,
        title: selectedOpportunity.title,
      })
      .then((response) => alert(response.data.message))
      .catch((error) => console.error("Error applying:", error));
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
            <button onClick={() => setSelectedOpportunity(opportunity)}>
              Apply
            </button>
          </li>
        ))}
      </ul>

      {selectedOpportunity && (
        <div>
          <h3>Apply for: {selectedOpportunity.title}</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => applyForOpportunity(selectedOpportunity.id)}>
            Submit
          </button>
        </div>
      )}
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
