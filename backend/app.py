from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_cors import CORS
import re


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///volunteer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

mail = Mail(app)
db = SQLAlchemy(app)


class Opportunity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location
        }
        
def add_dummy_data():
    dummy_data = [
    {"title": "Beach Cleanup", "description": "Help clean up the local beach.", "location": "Miami, FL"},
    {"title": "Soup Kitchen Helper", "description": "Serve meals to those in need.", "location": "New York, NY"},
    {"title": "Tree Planting", "description": "Join us in planting trees in the community park.", "location": "Seattle, WA"},
    {"title": "Park Cleanup", "description": "Description for the park cleanup.", "location": "Los Angeles, CA"},
    {"title": "Animal Shelter Volunteer", "description": "Care for animals and assist with adoption events.", "location": "Denver, CO"},
    {"title": "Tutoring Program", "description": "Help kids improve their math and reading skills.", "location": "Chicago, IL"},
    {"title": "Hospital Volunteer", "description": "Provide support to hospital staff and comfort to patients.", "location": "Boston, MA"},
    {"title": "Food Bank Assistant", "description": "Sort and pack food items for distribution.", "location": "Austin, TX"},
    {"title": "Community Garden Project", "description": "Help grow vegetables and teach gardening skills.", "location": "Portland, OR"},
    {"title": "Recycling Drive Coordinator", "description": "Organize and run a recycling event.", "location": "Phoenix, AZ"},
    {"title": "Senior Center Companion", "description": "Spend time with seniors and assist with activities.", "location": "Atlanta, GA"},
    {"title": "Disaster Relief Volunteer", "description": "Support emergency response efforts during disasters.", "location": "New Orleans, LA"},
    {"title": "Cultural Festival Organizer", "description": "Assist with organizing and running a cultural festival.", "location": "San Francisco, CA"},
    {"title": "Library Helper", "description": "Sort books and assist visitors at the local library.", "location": "Columbus, OH"},
    {"title": "Clothing Drive Volunteer", "description": "Collect, sort, and distribute clothing to those in need.", "location": "Charlotte, NC"}
]

    for data in dummy_data:
        opportunity = Opportunity(
            title=data['title'],
            description=data['description'],
            location=data['location']
        )
        db.session.add(opportunity)
    
    db.session.commit()

# API route to fetch all opportunities
@app.route('/opportunities', methods=['GET'])
def get_opportunities():
    
    title = request.args.get('title')
    location = request.args.get('location')
    
    query = Opportunity.query
    
    if title:
        query = query.filter(Opportunity.title.ilike(f"%{title}%"))  # makes the search case-insensitive

    if location:
        query = query.filter(Opportunity.location.ilike(f"%{location}%"))
    
    opportunities = query.all()  # get all opportunities from the database
    return jsonify([op.to_dict() for op in opportunities])

@app.route('/opportunities/<int:volunteer_id>', methods=['GET'])
def get_opportunity(volunteer_id):
    opportunity = Opportunity.query.get(volunteer_id)  # fetch the opportunity by its ID
    if opportunity is None:
        return jsonify({"error": "Opportunity not found"}), 404
    return jsonify(opportunity.to_dict())

def is_valid_email(email):
    # email validation 
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

# API route to submit an application
@app.route('/apply', methods=['POST'])
def apply_for_opportunity():
    # Email Validation

    data = request.get_json()  # get JSON data from the frontend
    title = data.get('title')
    email = data.get('email')

    if not title:
        return jsonify({"error": "Title is required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "A valid email is required"}), 400
    
    return jsonify({"message": f"You applied for {title}!"})

@app.route('/search', methods=['GET'])
def search_opportunities():
    query = request.args.get('query', '').lower()
    results = [
        opp for opp in volunteer_opportunities
        if query in opp['name'].lower() or query in opp['description'].lower()
    ]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/opportunities', methods=['POST'])
def create_opportunity():
    data = request.get_json()
    new_opportunity = Opportunity(
        title=data['title'],
        description=data['description'],
        location=data['location']
    )
    db.session.add(new_opportunity)  # add to the database 
    db.session.commit()  # commit the session to the database (save to the database)

    return jsonify(new_opportunity.to_dict()), 201

@app.route('/opportunities/<int:volunteer_id>', methods=['PUT'])
def update_opportunity(volunteer_id):
    opportunity = Opportunity.query.get(volunteer_id)
    if opportunity is None:
        return jsonify({"error": "Opportunity not found"}), 404

    data = request.get_json()
    opportunity.title = data.get('title', opportunity.title)
    opportunity.description = data.get('description', opportunity.description)
    opportunity.location = data.get('location', opportunity.location)

    db.session.commit()  # save to the database
    return jsonify(opportunity.to_dict())

@app.route('/opportunities/<int:volunteer_id>', methods=['DELETE'])
def delete_opportunity(volunteer_id):
    opportunity = Opportunity.query.get(volunteer_id)
    if opportunity is None:
        return jsonify({"error": "Opportunity not found"}), 404

    db.session.delete(opportunity)  # delete from the database
    db.session.commit()  # commit the changes to the database

    return jsonify({"message": "Opportunity deleted"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # if not Opportunity.query.first(): 
        add_dummy_data()
    app.run(debug=True)
    
    
""""
Volunteer Opportunities Management API
This Flask application provides a backend service to manage volunteer opportunities, including creating, reading, updating, deleting (CRUD), and searching opportunities. Additionally, it supports applying for opportunities and integrating email validation.

Requirements
To run this application, ensure the following Python libraries are installed:

Flask: Web framework
Flask-SQLAlchemy: ORM for database operations
Flask-Mail: Email service integration
Flask-CORS: Cross-Origin Resource Sharing
re: For regular expression operations (email validation)


Configuration
Database: Uses SQLite as the database, stored locally as volunteer.db.
Mail Service: Currently initialized but not configured (no mail server settings provided).
CORS: Enabled to allow requests from different origins.

Routes
Opportunity CRUD Operations
Get All Opportunities
Endpoint: /opportunities
Method: GET
Description: Fetches all volunteer opportunities, with optional filtering by title and location.
Query Parameters:

title (optional): Search by title (case-insensitive).
location (optional): Search by location (case-insensitive).
Response: JSON list of opportunities.
Get Opportunity by ID
Endpoint: /opportunities/<int:volunteer_id>
Method: GET
Description: Fetches a specific opportunity by its ID.
Response: JSON object representing the opportunity or 404 error if not found.

Create Opportunity
Endpoint: /opportunities
Method: POST
Description: Adds a new volunteer opportunity.
Request Body: JSON with title, description, and location.
Response: JSON object of the created opportunity with status code 201.

Update Opportunity
Endpoint: /opportunities/<int:volunteer_id>
Method: PUT
Description: Updates an existing opportunity.
Request Body: JSON with optional title, description, and location.
Response: JSON object of the updated opportunity or 404 error if not found.

Delete Opportunity
Endpoint: /opportunities/<int:volunteer_id>
Method: DELETE
Description: Deletes a specific opportunity by ID.
Response: Success message or 404 error if not found.

"""