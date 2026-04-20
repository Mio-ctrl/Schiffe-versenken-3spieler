from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Zentraler Speicher für die Passwörter
admin_config = {
    "passwords": {
        "Spieler 1": "p1",
        "Spieler 2": "p2",
        "Spieler 3": "p3"
    }
}

@app.route('/')
def index():
    return render_template('index.html')

# Die Admin-Ansicht
@app.route('/admin')
def admin():
    return render_template('admin.html')

# Endpunkt zum Ändern der Passwörter
@app.route('/admin/update', methods=['POST'])
def update_passwords():
    new_pws = request.json
    for player, pw in new_pws.items():
        if pw.strip(): # Nur ändern, wenn nicht leer
            admin_config["passwords"][player] = pw
    return jsonify({"status": "success"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    player = data.get("player")
    password = data.get("password")
    
    if admin_config["passwords"].get(player) == password:
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Falsches Passwort"}), 401

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
