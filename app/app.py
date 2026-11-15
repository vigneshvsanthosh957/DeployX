
from flask import Flask, jsonify
from flask_cors import CORS
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import psutil
import os
import time

app = Flask(__name__)
CORS(app)

REQUEST_COUNT = Counter(
    "deployx_requests_total",
    "Total number of requests"
)

START_TIME = time.time()
process = psutil.Process(os.getpid())


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
    return jsonify({"status": "healthy"}), 200


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


@app.route("/api/monitoring")
def monitoring():
    memory = process.memory_info()

    return jsonify({
        "status": "healthy",
        "cpu_percent": process.cpu_percent(interval=0.1),
        "memory_mb": round(memory.rss / (1024 * 1024), 2),
        "memory_percent": round(process.memory_percent(), 2),
        "threads": process.num_threads(),
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "open_files": process.num_fds() if hasattr(process, "num_fds") else None
    })


@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {
        "Content-Type": CONTENT_TYPE_LATEST
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
