from flask_cors import CORS
from flask import Flask, jsonify
from prometheus_client import Counter, generate_latest
from prometheus_client import CONTENT_TYPE_LATEST

app = Flask(__name__)
CORS(app)

REQUEST_COUNT = Counter(
    "deployx_requests_total",
    "Total number of requests"
)

@app.route("/")
def home():
    REQUEST_COUNT.inc()
    return jsonify({
        "project": "DeployX",
        "message": "Deployment platform is running!",
        "status": "healthy"
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    }), 200
@app.route("/api/stats")
def stats():
    return jsonify({
        "project": "DeployX",
        "status": "healthy",
        "total_deployments": 1,
        "successful_deployments": 1,
        "failed_deployments": 0,
        "active_services": 1
    })

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {
        "Content-Type": CONTENT_TYPE_LATEST
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)