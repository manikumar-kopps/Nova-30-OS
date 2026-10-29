import os
from flask import Flask, send_from_directory, jsonify
from dotenv import load_dotenv

# Load environment variables if available
load_dotenv()

app = Flask(__name__, static_folder="dist")
app.secret_key = os.environ.get("SECRET_KEY", "nova-30-os-secret-key-1998")

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "system": "NOVA 30 OS",
        "version": "30.01"
    })

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if not os.path.exists(DIST_DIR):
        return (
            "<h1>NOVA 30 OS</h1><p>Build directory not found. Please build the frontend using <code>npm run build</code>.</p>",
            500
        )
    
    file_path = os.path.join(DIST_DIR, path)
    if path != "" and os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)
    else:
        return send_from_directory(DIST_DIR, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
