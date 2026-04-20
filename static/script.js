let currentPlayer = "";
const GRID_SIZE = 15;
const fleetSchema = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2]; // Alle Schiffe nacheinander
let currentShipIndex = 0;
let currentShipCells = []; // Zellen des aktuell im Bau befindlichen Schiffes
let permanentShips = [];   // Alle bereits bestätigten Zellen

function initGrids() {
    setupLabels();
    createGrid('my-grid', true);
    createGrid('opponent-a', false);
    createGrid('opponent-b', false);
    updateInstruction();
}

function setupLabels() {
    const letters = "ABCDEFGHIJKLMNO".split("");
    const lCol = document.getElementById('letters-my');
    const nRow = document.getElementById('numbers-my');
    nRow.innerHTML = '<div></div>'; // Leere Ecke
    for(let i=1; i<=15; i++) {
        nRow.innerHTML += `<div class="coord-label">${i}</div>`;
        lCol.innerHTML += `<div class="coord-label">${letters[i-1]}</div>`;
    }
}

function createGrid(elementId, isPlayerGrid) {
    const grid = document.getElementById(elementId);
    grid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        if (isPlayerGrid) {
            cell.onclick = () => handleFleetClick(cell, i);
        } else {
            cell.onclick = () => cycleOpponentStatus(cell);
        }
        grid.appendChild(cell);
    }
}

function handleFleetClick(cell, index) {
    if (permanentShips.includes(index)) return; // Bereits besetzt
    
    const pos = currentShipCells.indexOf(index);
    if (pos > -1) {
        currentShipCells.splice(pos, 1);
        cell.classList.remove('current-build');
    } else {
        if (currentShipCells.length < fleetSchema[currentShipIndex]) {
            currentShipCells.push(index);
            cell.classList.add('current-build');
        }
    }
}

function confirmCurrentShip() {
    const needed = fleetSchema[currentShipIndex];
    if (currentShipCells.length !== needed) {
        alert(`Dieses Schiff muss genau ${needed} Felder groß sein!`);
        return;
    }

    if (!isValidConnection(currentShipCells)) {
        alert("Fehler: Schiffsteile müssen zusammenhängen (nicht diagonal)!");
        return;
    }

    // Schiff als permanent markieren
    currentShipCells.forEach(idx => {
        permanentShips.push(idx);
        const cell = document.querySelector(`#my-grid .cell[data-index="${idx}"]`);
        cell.classList.remove('current-build');
        cell.classList.add('ship');
    });

    currentShipCells = [];
    currentShipIndex++;

    if (currentShipIndex >= fleetSchema.length) {
        document.getElementById('ship-instruction').innerText = "Alle Schiffe bereit!";
        alert("Flotte komplett!");
    } else {
        updateInstruction();
    }
}

function isValidConnection(cells) {
    if (cells.length === 0) return false;
    let visited = new Set();
    let queue = [cells[0]];
    visited.add(cells[0]);

    while (queue.length > 0) {
        let curr = queue.shift();
        let r = Math.floor(curr / GRID_SIZE);
        let c = curr % GRID_SIZE;

        let neighbors = [
            curr - GRID_SIZE, curr + GRID_SIZE, // oben, unten
            curr - 1, curr + 1                  // links, rechts
        ];

        neighbors.forEach(nb => {
            // Check ob Nachbar im aktuellen Schiff liegt und noch nicht besucht wurde
            if (cells.includes(nb) && !visited.has(nb)) {
                // Verhindere Zeilenumbruch-Nachbarschaft (rechts -> links)
                let nr = Math.floor(nb / GRID_SIZE);
                let nc = nb % GRID_SIZE;
                if (Math.abs(r - nr) + Math.abs(c - nc) === 1) {
                    visited.add(nb);
                    queue.push(nb);
                }
            }
        });
    }
    return visited.size === cells.length;
}

function updateInstruction() {
    const size = fleetSchema[currentShipIndex];
    document.getElementById('ship-instruction').innerText = `Platziere ein ${size}er Schiff`;
}

function resetMyBoard() {
    permanentShips = [];
    currentShipCells = [];
    currentShipIndex = 0;
    document.querySelectorAll('#my-grid .cell').forEach(c => c.className = 'cell');
    updateInstruction();
}
