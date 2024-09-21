import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
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
    <div>
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

export default App;
