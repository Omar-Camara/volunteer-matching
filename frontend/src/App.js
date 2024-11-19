import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css"; // Add this to style your components, especially the taskbar
import LoginForm from "./Login/LoginForm";
import OpportunityCard from "./components/OpportunityCard";
import "bootstrap/dist/css/bootstrap.min.css";
import Search from './components/Search';

function App() {
  return (
    <Router>
      <div>
        {/* Top Taskbar */}
        <nav className="taskbar">
          <div className="Logo"><img src="Logo.png" height="30"/></div>
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
    <div className="container text-center mt-5">
      <h1>Welcome to the Volunteer Portal</h1>
      <p>
        Discover meaningful volunteer opportunities and make a difference today!
      </p>
      <Link to="/opportunities">
        <button className="btn btn-primary">Explore Opportunities</button>
      </Link>
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
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);


  // Fetch opportunities from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/opportunities")
      .then((response) => {
        setOpportunities(response.data);
        setFilteredOpportunities(response.data); // Initialize with all opportunities
      })
      .catch((error) => {
        console.error("There was an error fetching the opportunities!", error);
      });
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

 // Search handler
 const handleSearch = ({ title, location }) => {
  const lowercasedTitle = title.toLowerCase();
  const lowercasedLocation = location.toLowerCase();

  const filtered = opportunities.filter((opportunity) =>
    (opportunity.title.toLowerCase().includes(lowercasedTitle) || !title) &&
    (opportunity.location.toLowerCase().includes(lowercasedLocation) || !location)
  );

  setFilteredOpportunities(filtered); // Update filtered opportunities
};
  

  return (
    <div className="container mt-5">
      <h1>Available Opportunities</h1>
      <Search onSearch={handleSearch} /> {/* Search component */}
      <div className="row">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}

// Contact Page
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/contact",
        formData
      );
      setResponseMessage("Your message has been sent successfully.");
      setIsSubmitting(false);
    } catch (error) {
      setResponseMessage("There was an error sending your message.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Contact Us</h1>
      <div className="row">
        <div className="col-md-6">
          <h3>Contact Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          {responseMessage && <p className="mt-3">{responseMessage}</p>}
        </div>

        {/* Contact info */}
        <div className="col-md-6">
          <h3>Get In Touch</h3>
          <p>
            Feel free to reach out to us for any questions or feedback. You can
            also follow us on our social media platforms.
          </p>
          <ul>
            <li>Email: volunteer@example.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 123 Volunteer St, City, Country</li>
            <li>
              Follow us on:
              <ul>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
