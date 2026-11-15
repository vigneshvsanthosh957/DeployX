
from flask import Flask, jsonify
from flask_cors import CORS
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = Flask(__name__)

# Enable frontend-backend communication
CORS(app)

# Prometheus request counter
REQUEST_COUNT = Counter(
    "deployx_requests_total",
    "Total number of requests"
)


# 1. Home route
@app.route("/")
def home():
    REQUEST_COUNT.inc()
    return jsonify({
        "project": "DeployX",
        "message": "Deployment platform is running!",
        "status": "healthy"
    })


# 2. Health check API
@app.route("/health")
def health():
    return jsonify({
        "project": "DeployX",
        "status": "healthy"
    }), 200


# 3. Dashboard statistics API
@app.route("/api/stats")
def stats():
    return jsonify({
        "project": "DeployX",
        "status": "healthy",
        "total_deployments": 1,
        "successful_deployments": 1,
        "failed_deployments": 0,
        "active_services": 1
    }), 200


# 4. Deployment history API
@app.route("/api/deployments")
def deployments():
    return jsonify({
        "deployments": [
            {
                "id": "DEP-001",
                "project": "DeployX Backend",
                "branch": "main",
                "status": "Success",
                "environment": "Production"
            }
        ]
    }), 200


# 5. Prometheus metrics API
@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {
        "Content-Type": CONTENT_TYPE_LATEST
    }


# Run application
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
