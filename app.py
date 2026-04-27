import sqlite3
import json
import os
try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

from flask import Flask, request, jsonify
from flask_cors import CORS
from analysis import analyze_content
from analysis import analyze_content

app = Flask(__name__)
CORS(app)

DB_FILE = "/tmp/database.sqlite" if os.environ.get('VERCEL') else "database.sqlite"
MONGO_URI = os.environ.get("MONGODB_URI")
USE_MONGO = bool(MONGO_URI and MongoClient)

if USE_MONGO:
    mongo_client = MongoClient(MONGO_URI)
    mongo_db = mongo_client.get_database() # Uses default db in URI
    mongo_collection = mongo_db["user_data"]
else:
    def init_db():
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_data (
                user_id TEXT,
                key TEXT,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, key)
            )
        ''')
        conn.commit()
        conn.close()

    init_db()

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    return jsonify(analyze_content(text))

@app.route("/api/db/save", methods=["POST"])
def save_data():
    data = request.json
    user_id = data.get("user_id")
    key = data.get("key")
    value = data.get("value")
    
    if not user_id or not key:
        return jsonify({"error": "Missing user_id or key"}), 400
        
    if isinstance(value, (dict, list)):
        value_str = json.dumps(value)
    else:
        value_str = str(value)
        
    if USE_MONGO:
        mongo_collection.update_one(
            {"user_id": user_id, "key": key},
            {"$set": {"value": value_str}},
            upsert=True
        )
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO user_data (user_id, key, value)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, key) DO UPDATE SET
            value = excluded.value,
            updated_at = CURRENT_TIMESTAMP
        ''', (user_id, key, value_str))
        conn.commit()
        conn.close()
    
    return jsonify({"success": True, "message": "Data saved to database"})

@app.route("/api/db/load", methods=["GET"])
def load_data():
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
        
    if USE_MONGO:
        cursor = mongo_collection.find({"user_id": user_id})
        rows = [(doc["key"], doc["value"]) for doc in cursor]
    else:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM user_data WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        conn.close()
    
    result = {}
    for key, value in rows:
        try:
            result[key] = json.loads(value)
        except json.JSONDecodeError:
            result[key] = value
            
    return jsonify({"success": True, "data": result})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
