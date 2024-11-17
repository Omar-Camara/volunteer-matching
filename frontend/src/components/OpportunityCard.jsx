import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const OpportunityCard = ({ opportunity }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleDetailsModalShow = () => setShowDetailsModal(true);
  const handleDetailsModalClose = () => setShowDetailsModal(false);
  const handleApplyModalShow = () => setShowApplyModal(true);
  const handleApplyModalClose = () => setShowApplyModal(false);
  const handleConfirmationModalClose = () => setShowConfirmationModal(false);

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setShowApplyModal(false);
    setShowConfirmationModal(true);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card" onClick={handleDetailsModalShow}>
        <div className="card-body">
          <h5 className="card-title">{opportunity.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {opportunity.location}
          </h6>
          <p className="card-text">
            {opportunity.description.slice(0, 100)}...
          </p>
          <Button variant="primary" onClick={handleApplyModalShow}>
            Apply Now
          </Button>
        </div>
      </div>

      {/* Modal to display details of opportunities */}
      <Modal show={showDetailsModal} onHide={handleDetailsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{opportunity.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Location: {opportunity.location}</h5>
          <p>{opportunity.description}</p>
          <Button variant="primary" onClick={handleApplyModalShow}>
            Apply Now
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailsModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for application from */}
      <Modal show={showApplyModal} onHide={handleApplyModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {opportunity.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitApplication}>
            <Form.Group controlId="formName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formResume">
              <Form.Label>Upload Resume</Form.Label>
              <Form.Control type="file" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleApplyModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal for confirmation */}
      <Modal show={showConfirmationModal} onHide={handleConfirmationModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Application Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your application for {opportunity.title} has been successfully
            submitted!
          </p>
          <p>Thank you for applying. They will be in touch with you shortly.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmationModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OpportunityCard;
