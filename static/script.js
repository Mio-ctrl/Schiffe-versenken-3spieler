let currentPlayer = "";
const GRID_SIZE = 15;
// Definition der Flotte: 1x5, 2x4, 3x3, 4x2 = Gesamt 30 Felder
const MAX_SHIP_FIELDS = (1*5) + (2*4) + (3*3) + (4*2); 
let placedFields = 0;

function attemptLogin() {
    const player = document.getElementById('player-select').value;
    const password = document.getElementById('password-input').value;

    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({player, password})
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            currentPlayer = player;
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            document.getElementById('current-player-display').innerText = "Spieler: " + player;
            initGrids();
        } else { alert("Falsches Passwort!"); }
    });
}

function initGrids() {
    createGrid('my-grid', true);
    createGrid('opponent-a', false);
    createGrid('opponent-b', false);
    updateCounter();
}

function createGrid(elementId, isPlayerGrid) {
    const grid = document.getElementById(elementId);
    grid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (isPlayerGrid) {
            cell.onclick = () => toggleShip(cell);
        } else {
            cell.onclick = () => cycleOpponentStatus(cell);
        }
        grid.appendChild(cell);
    }
}

function toggleShip(cell) {
    if (!cell.classList.contains('ship') && placedFields >= MAX_SHIP_FIELDS) {
        alert("Alle Schiffe platziert!");
        return;
    }
    
    cell.classList.toggle('ship');
    placedFields = document.querySelectorAll('#my-grid .cell.ship').length;
    updateCounter();
}

function updateCounter() {
    const remaining = MAX_SHIP_FIELDS - placedFields;
    document.getElementById('ship-counter').innerText = `Noch zu platzierende Felder: ${remaining}`;
}

function saveFleet() {
    if (placedFields !== MAX_SHIP_FIELDS) {
        alert(`Du musst genau ${MAX_SHIP_FIELDS} Felder belegen!`);
        return;
    }
    // Hier könnte eine API-Anfrage stehen, um die Flotte serverseitig zu speichern
    alert("Flotte erfolgreich gespeichert! (Lokal)");
}

function cycleOpponentStatus(cell) {
    // Status: leer -> wasser (blau) -> kreis (vermutung) -> kreuz (treffer)
    if (!cell.classList.contains('water') && !cell.classList.contains('circle') && !cell.classList.contains('cross')) {
        cell.classList.add('water');
    } else if (cell.classList.contains('water')) {
        cell.classList.remove('water');
        cell.classList.add('circle');
    } else if (cell.classList.contains('circle')) {
        cell.classList.remove('circle');
        cell.classList.add('cross');
    } else {
        cell.classList.remove('cross');
    }
}

function resetMyBoard() {
    document.querySelectorAll('#my-grid .cell').forEach(c => c.className = 'cell');
    placedFields = 0;
    updateCounter();
}
