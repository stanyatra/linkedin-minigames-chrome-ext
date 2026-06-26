document.getElementById("solveButton").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: detectBoard
    });
});

function detectBoard(){
    console.clear();
    console.log("Mini Sudoku Solver Running");

    const cells = document.querySelectorAll(".sudoku-cell");
    let grid = [];

    cells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        const text = cell.innerText.trim();

        grid.push({
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            value: text === "" ? 0 : parseInt(text),
            element: cell
        });
    });

    grid.sort((a, b) => {
        if(Math.abs(a.y - b.y) > 10) return a.y - b.y;
        return a.x - b.x;
    });

    let rows = [];
    grid.forEach(cell => {
        let found = false;
        for(let row of rows){
            if(Math.abs(row[0].y - cell.y) < 10){
                row.push(cell);
                found = true;
                break;
            }
        }
        if(!found) rows.push([cell]);
    });

    rows.forEach(row => {
        row.sort((a, b) => a.x - b.x);
    });

    let mat = [];
    for(let r = 0; r < rows.length; r++){
        let currentRow = [];
        for(let c = 0; c < rows[r].length; c++){
            currentRow.push(rows[r][c].value);
        }
        mat.push(currentRow);
    }

    console.log("INITIAL MATRIX:");
    console.table(mat);

    let r = new Array(6).fill(0);
    let c = new Array(6).fill(0);
    let b = new Array(6).fill(0);

    //bitmasking
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
            if(mat[i][j] === 0) continue;

            let mask = (1 << mat[i][j]);
            let reg = 2 * Math.floor(i / 2) + Math.floor(j / 3);

            r[i] |= mask; c[j] |= mask; b[reg] |= mask;
        }
    }

    function help(row, col, num){
        let reg = 2 * Math.floor(row / 2) + Math.floor(col / 3);
        let mask = (1 << num);

        if(r[row] & mask) return false;
        if(c[col] & mask) return false;
        if(b[reg] & mask) return false;
        return true;
    }

    function solve(row, col){
        if(col === 6) return true;

        let nr = (row === 5) ? 0 : row + 1;
        let nc = (row === 5) ? col + 1 : col;

        if(mat[row][col]) return solve(nr, nc);

        for(let num = 1; num <= 6; num++){
            if(help(row, col, num)){
                let mask = (1 << num);
                let reg = 2 * Math.floor(row / 2) + Math.floor(col / 3);

                r[row] |= mask; c[col] |= mask; b[reg] |= mask;
                mat[row][col] = num;

                if(solve(nr, nc)) return true;

                mat[row][col] = 0;
                r[row] ^= mask; c[col] ^= mask; b[reg] ^= mask;
            }
        }
        return false;
    }

    solve(0, 0);
    console.log("SOLVED:");
    console.table(mat);

    //visual markup
    for(let r = 0; r < 6; r++){
        for(let c = 0; c < 6; c++){
            //only empty cells
            if(rows[r][c].value === 0){
                const cell = rows[r][c].element;
                const overlay = document.createElement("div");

                overlay.innerText = mat[r][c];
                overlay.style.position = "absolute";
                overlay.style.top = "50%";
                overlay.style.left = "50%";
                overlay.style.transform = "translate(-50%, -50%)";
                overlay.style.fontSize = "16px";
                overlay.style.fontWeight = "bold";
                overlay.style.color = "orange";
                overlay.style.pointerEvents = "none";
                overlay.style.zIndex = "9999";
                overlay.style.opacity = "0.55";

                //IMPORTANT
                cell.style.position = "relative";
                cell.appendChild(overlay);
            }
        }
    }
}