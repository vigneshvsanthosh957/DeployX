
import pytest
from app.app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get("/")
    assert response.status_code == 200

    data = response.get_json()
    assert data["project"] == "DeployX"
    assert data["status"] == "healthy"

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "healthy"

def test_metrics(client):
    response = client.get("/metrics")
    assert response.status_code == 200
    assert b"deployx_requests_total" in response.data
