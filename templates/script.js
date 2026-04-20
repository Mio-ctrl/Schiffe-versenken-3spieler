let currentPlayer = "";
const GRID_SIZE = 15;

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
            document.getElementById('current-player-display').innerText = "Bereit, " + player;
            initGrids();
        } else {
            alert(data.message);
        }
    });
}

function initGrids() {
    createGrid('my-grid', true);
    createGrid('opponent-a', false);
    createGrid('opponent-b', false);
}

function createGrid(elementId, isPlayerGrid) {
    const grid = document.getElementById(elementId);
    grid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        
        if (isPlayerGrid) {
            cell.onclick = () => toggleShip(cell);
        } else {
            cell.onclick = () => cycleStatus(cell);
        }
        grid.appendChild(cell);
    }
}

function toggleShip(cell) {
    // Einfache Logik: Umschalten zwischen Schiff und Wasser
    // Hier könnte man noch prüfen, ob Schiffe sich berühren (Nachbarschafts-Check)
    cell.classList.toggle('ship');
}

function cycleStatus(cell) {
    const states = ['', 'water', 'hit', 'sunk', 'maybe'];
    let currentIdx = states.findIndex(s => s === '' ? !cell.className.includes(' ') : cell.classList.contains(s));
    
    // Aktuelle Klasse entfernen
    states.forEach(s => { if(s) cell.classList.remove(s); });
    
    // Nächsten Status setzen
    let nextIdx = (currentIdx + 1) % states.length;
    if(states[nextIdx]) cell.classList.add(states[nextIdx]);
}

function resetMyBoard() {
    document.querySelectorAll('#my-grid .cell').forEach(c => c.className = 'cell');
}
