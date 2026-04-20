from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Admin-Einstellungen (könnte man über eine Admin-Seite ändern)
game_config = {
    "passwords": {"Spieler 1": "p1", "Spieler 2": "p2", "Spieler 3": "p3"},
    "ships": {5: 1, 4: 2, 3: 3, 2: 4} # Größe: Anzahl
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    player = data.get("player")
    password = data.get("password")
    if game_config["passwords"].get(player) == password:
        return jsonify({"status": "success", "player": player})
    return jsonify({"status": "error", "message": "Falsches Passwort"}), 401

if __name__ == '__main__':
    app.run(debug=True)
