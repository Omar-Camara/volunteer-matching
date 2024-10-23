import pytest
from app import app, db, Opportunity

@pytest.fixture
def client():
    """Set up the test client with a testing configuration."""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database
    app.config['SQLALCHEMY_ECHO'] = True  # Log SQL statements for debugging

    with app.app_context():
        db.create_all()  # Create tables

        # Add a consistent opportunity
        opportunity = Opportunity(
            title="Test Opportunity",
            description="A test opportunity",
            location="Test Location"
        )
        db.session.add(opportunity)
        db.session.commit()

        # Confirm the opportunity creation
        print(f"Created Opportunity ID: {opportunity.id}")

    with app.test_client() as client:
        yield client



# Test cases for CRUD Operations

def test_create_opportunity(client):
    """Test POST request to create a new opportunity."""
    response = client.post('/opportunities', json={
        'title': 'New Opportunity',
        'description': 'Description for new opportunity',
        'location': 'Location for new opportunity'
    })
    assert response.status_code == 201
    assert response.json['title'] == 'New Opportunity'

def test_get_opportunities(client):
    """Test GET request to fetch all opportunities."""
    response = client.get('/opportunities')
    assert response.status_code == 200
    assert len(response.json) > 0  # Ensure at least one opportunity exists

def test_get_opportunity(client):
    """Test GET request to fetch a single opportunity."""
    response = client.get('/opportunities/1')
    assert response.status_code == 200
    assert response.json['title'] == 'Test Opportunity'

def test_update_opportunity(client):
    """Test PUT request to update an opportunity."""
    response = client.put('/opportunities/1', json={
        'title': 'Updated Opportunity'
    })
    assert response.status_code == 200
    assert response.json['title'] == 'Updated Opportunity'

def test_delete_opportunity(client):
    """Test DELETE request to remove an opportunity."""
    response = client.delete('/opportunities/1')
    assert response.status_code == 200
    assert response.json['message'] == 'Opportunity deleted'

# Test cases for the application form

def test_apply_for_opportunity(client):
    """Test POST request to apply for an opportunity."""
    response = client.post('/apply', json={
        'title': 'Beach Cleanup',
        'email': 'test@example.com'
    })
    assert response.status_code == 200
    assert 'applied' in response.json['message']

def test_apply_invalid_email(client):
    """Test form validation with invalid email."""
    response = client.post('/apply', json={
        'title': 'Beach Cleanup',
        'email': 'invalid-email'
    })
    assert response.status_code == 400
    assert 'A valid email is required' in response.json['error']
