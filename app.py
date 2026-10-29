import os
import json
import mimetypes
import subprocess
import urllib.request
import urllib.error
from flask import Flask, send_from_directory, jsonify, request
from dotenv import load_dotenv

# Ensure proper MIME types for modern ES modules and assets
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/json", ".json")

# Load environment variables if available
load_dotenv()

app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get("SECRET_KEY", "nova-30-os-secret-key-1998")

def find_dist_dir():
    candidates = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "dist")),
        os.path.abspath(os.path.join(os.getcwd(), "dist")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "nova-os", "dist")),
        os.path.abspath(os.path.join(os.getcwd(), "nova-os", "dist")),
    ]
    for c in candidates:
        if os.path.exists(c) and os.path.isdir(c) and os.path.exists(os.path.join(c, "index.html")):
            return c
    
    # If not found, attempt auto-build if npm is available
    try:
        print("Dist directory missing. Attempting automatic build with npm run build...")
        subprocess.run(["npm", "run", "build"], check=True, timeout=120)
        for c in candidates:
            if os.path.exists(c) and os.path.isdir(c) and os.path.exists(os.path.join(c, "index.html")):
                return c
    except Exception as e:
        print(f"Auto-build attempt failed: {e}")
        
    return candidates[0]

DIST_DIR = find_dist_dir()

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "system": "NOVA 30 OS",
        "version": "30.01",
        "dist_loaded": os.path.exists(DIST_DIR) and os.path.exists(os.path.join(DIST_DIR, "index.html"))
    })

@app.route("/api/ai/chat", methods=["POST"])
def proxy_ai():
    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", os.environ.get("VITE_AZURE_OPENAI_ENDPOINT", ""))
    api_key = os.environ.get("AZURE_OPENAI_API_KEY", os.environ.get("VITE_AZURE_OPENAI_API_KEY", ""))
    if not endpoint or not api_key:
        return jsonify({"error": "Azure OpenAI not configured on server", "fallback": True}), 503

    data = request.get_json(silent=True) or {}
    req_url = f"{endpoint.rstrip('/')}/chat/completions"
    try:
        req = urllib.request.Request(
            req_url,
            data=json.dumps(data).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "api-key": api_key,
                "Authorization": f"Bearer {api_key}"
            }
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            return (resp.read(), resp.status, {"Content-Type": "application/json"})
    except Exception as e:
        return jsonify({"error": str(e), "fallback": True}), 502

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    global DIST_DIR
    if not os.path.exists(DIST_DIR) or not os.path.exists(os.path.join(DIST_DIR, "index.html")):
        DIST_DIR = find_dist_dir()
        if not os.path.exists(DIST_DIR) or not os.path.exists(os.path.join(DIST_DIR, "index.html")):
            return (
                "<h1>NOVA 30 OS</h1><p>Build directory not found. Please wait a moment and refresh, or run <code>npm run build</code>.</p>",
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
