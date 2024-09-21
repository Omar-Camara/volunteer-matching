from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///volunteer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

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

# API route to fetch all opportunities
@app.route('/opportunities', methods=['GET'])
def get_opportunities():
    opportunities = Opportunity.query.all()  # get all opportunities from the database
    return jsonify([op.to_dict() for op in opportunities])

@app.route('/opportunities/<int:volunteer_id>', methods=['GET'])
def get_opportunity(volunteer_id):
    opportunity = Opportunity.query.get(volunteer_id)  # fetch the opportunity by its ID
    if opportunity is None:
        return jsonify({"error": "Opportunity not found"}), 404
    return jsonify(opportunity.to_dict())

# API route to submit an application
@app.route('/apply', methods=['POST'])
def apply_for_opportunity():
    data = request.get_json()  # get JSON data from the frontend
    title = data.get('title')

    
    return jsonify({"message": f"You applied for {title}!"})

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
    app.run(debug=True)