from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Konfiguration (Hier kannst du Passwörter festlegen)
admin_config = {
    "passwords": {
        "Spieler 1": "p1",
        "Spieler 2": "p2",
        "Spieler 3": "p3"
    },
    "grid_size": 15,
    "ships": {5: 1, 4: 2, 3: 3, 2: 4} # Größe: Anzahl
}

@app.route('/')
def index():
    return render_template('index.html', config=admin_config)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    player = data.get("player")
    password = data.get("password")
    
    if admin_config["passwords"].get(player) == password:
        return jsonify({"status": "success", "config": admin_config})
    return jsonify({"status": "error", "message": "Falsches Passwort"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
