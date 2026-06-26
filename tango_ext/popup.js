document.getElementById("solveButton").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: detectBoard
    });
});

//detect board cells
function detectBoard(){
    console.clear();
    console.log("Tango Solver Running");

    
    const cells = Array.from(document.querySelectorAll('[id^="tango-cell-"]')).filter(cell => {
        const rect = cell.getBoundingClientRect();
        return (rect.width > 80 && rect.height > 80);
    });

    let grid = [];

    cells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        let value = 0;
        const svg = cell.querySelector("svg");

        if(svg){
            const label = svg.getAttribute("aria-label");
            if(label === "Sun") value = 1;
            else if(label === "Moon") value = -1;
        }

        grid.push({
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            value: value,
            element: cell
        });

        cell.style.outline = "2px solid red";
    });

    //sort
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

    
    let res = [];

    for(let i=0; i<rows.length; i++){
        let current = [];
        for(let j=0; j<rows[i].length; j++){
            current.push(rows[i][j].value);
        }
        res.push(current);
    }

    console.log("INITIAL MATRIX:");
    console.table(res);

    
    let r = new Map();
    let c = new Map();
    const n = res.length;

    for(let i=0; i<n; i++){
        for(let j=0; j<n; j++){
            if(res[i][j]){
                let val = res[i][j];
                r.set(`${val},${i}`, (r.get(`${val},${i}`) || 0) + 1);
                c.set(`${val},${j}`, (c.get(`${val},${j}`) || 0) + 1);
            }
        }
    }

    
    function help(row, col, num){
        //check row
        if(row-2>=0 && res[row-2][col]==num && res[row-1][col]==num) return false;
        if(row-1>=0 && row+1<n && res[row-1][col]==num && res[row+1][col]==num) return false;
        if(row+2<n && res[row+2][col]==num && res[row+1][col]==num) return false;

        //check col
        if(col-2>=0 && res[row][col-2]==num && res[row][col-1]==num) return false;
        if(col-1>=0 && col+1<n && res[row][col-1]==num && res[row][col+1]==num) return false;
        if(col+2<n && res[row][col+2]==num && res[row][col+1]==num) return false;

        //check freq
        if((r.get(`${num},${row}`) || 0) >= n/2) return false;
        if((c.get(`${num},${col}`) || 0) >= n/2) return false;

        return true;
    }

    //solve
    function solve(row, col){
        if(col==n){
            for(let i=0; i<n; i++){
                if((r.get(`1,${i}`) || 0) != (r.get(`-1,${i}`) || 0)) return false;
                if((c.get(`1,${i}`) || 0) != (c.get(`-1,${i}`) || 0)) return false;
            }
            return true;
        }

        let nr = (row==n-1)?0: row+1;
        let nc = (row==n-1)?col+1:col;

        if(res[row][col]!=0) return solve(nr, nc);

        if(help(row, col, -1)){
            r.set(`-1,${row}`, (r.get(`-1,${row}`) || 0) + 1);
            c.set(`-1,${col}`, (c.get(`-1,${col}`) || 0) + 1);
            res[row][col] = -1;

            if(solve(nr, nc)) return true;
            r.set(`-1,${row}`, r.get(`-1,${row}`) - 1);
            c.set(`-1,${col}`, c.get(`-1,${col}`) - 1);
            res[row][col] = 0;
        }

        if(help(row, col, 1)){
            r.set(`1,${row}`, (r.get(`1,${row}`) || 0) + 1);
            c.set(`1,${col}`, (c.get(`1,${col}`) || 0) + 1);
            res[row][col] = 1;

            if(solve(nr, nc)) return true;
            r.set(`1,${row}`, r.get(`1,${row}`) - 1);
            c.set(`1,${col}`, c.get(`1,${col}`) - 1);
            res[row][col] = 0;
        }

        return false;
    }

    
    solve(0, 0);

    console.log("SOLVED MATRIX:");
    console.table(res);

    //overlay
    for(let i=0; i<n; i++){
        for(let j=0; j<n; j++){
            // only originally empty cells
            if(rows[i][j] == undefined) continue;
            if(rows[i][j].value != 0) continue;

            const cell = rows[i][j].element;
            const overlay = document.createElement("div");

            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "999999";

            overlay.style.backgroundColor = res[i][j]==1
                ? "rgba(255, 215, 0, 0.35)"
                : "rgba(0, 191, 255, 0.35)";

            cell.style.position = "relative";
            cell.appendChild(overlay);
        }
    }
}