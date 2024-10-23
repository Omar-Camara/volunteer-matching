import pytest
from app import app, db, Opportunity 

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all() 
        yield client 
        with app.app_context():
            db.drop_all()  

def test_get_opportunities(client):
    response = client.get('/opportunities')
    assert response.status_code == 200

def test_create_opportunity(client):
    response = client.post('/opportunities', json={
        'title': 'Test Opportunity',
        'description': 'Test Description',
        'location': 'Test Location'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['title'] == 'Test Opportunity'