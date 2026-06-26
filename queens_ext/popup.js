document.getElementById("solveButton").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: detectBoard
    });
});

function detectBoard() {
    const divs = document.querySelectorAll("div");
    let cells = [];

    divs.forEach(div => {
        const rect = div.getBoundingClientRect();
        if(rect.width>=40 && rect.width<=90 && Math.abs(rect.width-rect.height)<3){
            const style = window.getComputedStyle(div);
            cells.push({
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                color: style.backgroundColor,
                element: div
            });
            div.style.outline = "2px solid red";
        }
    });



    //remove duplicate
    let filtered = [];
    const threshold = 5;

    cells.forEach(cell => {
        let duplicate = false;
        for(let existing of filtered){
            if(Math.abs(existing.x-cell.x)<threshold && Math.abs(existing.y-cell.y)<threshold){
                duplicate = true; break;
            }
        }
        if(!duplicate){
            filtered.push(cell);
        }
    });
    cells = filtered;



    //sort
    cells.sort((a, b) => {
        if(a.y==b.y) return a.x-b.x;
        return a.y-b.y;
    });

    //group into rows
    let rows = [];
    cells.forEach(cell => {
        let added = false;
        for(let row of rows){
            if(Math.abs(row[0].y-cell.y)<10){
                row.push(cell); added = true; break;
            }
        }
        if(!added){
            rows.push([cell]);
        }
    });



    //sort each row
    rows.forEach(row => {
        row.sort((a, b) => a.x-b.x);
    });

    console.clear();
    console.log("ROWS:");
    console.log(rows);
    console.log("GRID SIZE:");
    console.log(rows.length, "x", rows[0].length);

    //convert colors to numbers
    let colorMap = new Map();
    let nextId = 0;
    let board = [];

    rows.forEach(row => {
        let newRow = [];
        row.forEach(cell => {
            if(!colorMap.has(cell.color)){
                colorMap.set(cell.color, nextId);
                nextId++;
            }
            newRow.push(colorMap.get(cell.color));
        });
        board.push(newRow);
    });

    console.log("BOARD:");
    console.table(board);
    const n = board.length;

    
    let temp = Array.from({ length: n }, () => Array(n).fill(0));

    
    let usedColors = new Set();

    
    let ans = [];

    function help(row, col) {
        //check neighbors
        for(let dr=-1; dr<=1; dr++){
            for(let dc=-1; dc<=1; dc++){
                if(!dr && !dc) continue;

                let r = row+dr; let c = col+dc;
                if(r>=0 && r<n && c>=0 && c<n){
                    if(temp[r][c]==1) return false;
                }
            }
        }

        //check row left side
        let nc = col;
        while(nc>=0){
            if(temp[row][nc]==1) return false;
            nc--;
        }

        //check color
        if(usedColors.has(board[row][col])) return false;

        return true;
    }

    function solve(col) {
        if(col==n){
            //deep copy temp
            ans.push(temp.map(row => [...row])); return;
        }

        for(let row=0; row<n; row++){
            if(help(row, col)){
                temp[row][col] = 1;
                usedColors.add(board[row][col]);
                solve(col+1);
                //backtrack
                usedColors.delete(board[row][col]);
                temp[row][col] = 0;
            }
        }
    }

    //run solver
    solve(0);

    //print ans
    console.log("ANSWER:");
    console.table(ans[0]);

    //mark solution cells
    for(let r=0; r<n; r++){
        for(let c=0; c<n; c++){
            if(ans[0][r][c]==1){
                const cell = rows[r][c].element;
                
                //gold border
                cell.style.border = "4px solid gold";

                //crown emoji
                const mark = document.createElement("div");
                mark.innerText = "x";
                mark.style.position = "absolute";
                mark.style.top = "50%";
                mark.style.left = "50%";
                mark.style.transform = "translate(-50%, -50%)";
                mark.style.fontSize = "14px";
                mark.style.fontWeight = "bold";
                mark.style.color = "black";
                mark.style.pointerEvents = "none";
                mark.style.zIndex = "9999";

                //important
                cell.style.position = "relative";
                cell.appendChild(mark);
            }
        }
    }
}