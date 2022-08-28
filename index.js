const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.oncontextmenu = () => false;

canvas.width = "360";
canvas.height = "360";

function Cell(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color;
    this.isMine = false;
    this.isHint = 0;
    this.isRevealed = false;
    this.isFlagged = false;

    this.fillWithColor = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    this.fillWithNumber = function() {
        ctx.font = "25px Arial";
        ctx.fillStyle = "black";
        ctx.fillText((this.isHint), x + 14, y + 28);
    }
}

// create the 2D array
let cellMatrix = new Array(9);
for (let i = 0; i < cellMatrix.length; ++i) {
    cellMatrix[i] = new Array(9);
}

function generateGrid(x, y, width, height, color1) {
    for (let line = 0; line < 9; ++line) {
        for (let col = 0; col < 9; ++col) {
            // create object
            cellMatrix[line][col] = new Cell(x, y, width, height);
            // create object coordinates
            if (x < canvas.width - (width + height / 2)) {
                x += 40;
            } else {
                x = 0;
                y += 40;
            }
            changeColor(color1, line, col);
        }
    }
}

generateGrid(0, 0, 40, 40, '#59A608', '#5BB318');

function insertMines(cells) {
    let mines = [];
    // plant 10 mines
    let i = 0;
    while (i < 10) {
        let randomMine = Math.floor(Math.random() * 81);
        if (!mines.includes(randomMine)) {
            mines.push(randomMine);
            ++i;
        } else {
            let randomMine = Math.floor(Math.random() * 81);
        }
    }
    let minePosition = 0;
    let index = 0;
    for (let line = 0; line < 9; ++line) {
        for (let col = 0; col < 9; ++col) {
            ++minePosition;
            if (mines.includes(minePosition)) {
                cells[line][col].isMine = true;
                ++index;
            }
        }
    }
}

insertMines(cellMatrix);

function insertHints() {
    for (let line = 0; line < 9; ++line) {
        for (let col = 0; col < 9; ++col) {
            // insert the hints around the mine
            if (cellMatrix[line][col].isMine === true) {
                checkHintSubMatrix(line, col);
            } 
        }
    }
}

function checkHintSubMatrix(line, col) {
    // find startLine and endline of the sub-matrix
    var startLine = getStartCell(line);
    var endLine = getEndCell(line);

    // find startCol and endCol of the sub-matrix
    var startCol = getStartCell(col);
    var endCol = getEndCell(col);

    // increment hint cell
    for (let i = startLine; i <= endLine; ++i) {
        for (let j = startCol; j <= endCol; ++j) {
            if (cellMatrix[i][j].isMine === false) {
                cellMatrix[i][j].isHint += 1;
            }
        }
    }
}

function getStartCell(lineOrCol) {
    var startCell;
    // to avoid looping outside the matrix
    if (lineOrCol >= 1) {
        startCell = lineOrCol - 1;
    } else {
        startCell = lineOrCol;
    }
    return startCell;
}

function getEndCell(lineOrCol) {
    var endCell;
    // to avoid looping outside the matrix
    if (lineOrCol <= 7) {
        endCell = lineOrCol + 1;
    } else {
        endCell = lineOrCol;
    }
    return endCell;
}

insertHints();

function getAdjacentCells(line, col) {
    const sLine = getStartCell(line);
    const sCol = getStartCell(col);
    const eLine = getEndCell(line);
    const eCol = getEndCell(col);
    let cells = [];
    for (let i = sLine; i <= eLine; ++i) {
        for (let j = sCol; j <= eCol; ++j) {
            if (cellMatrix[i][j].isHint === 0 && cellMatrix[i][j].isMine !== true) {
                changeColor("#CA955C", i, j);
                // cellMatrix[i][j].isRevealed = true;
                cellMatrix[i][j].line = i;
                cellMatrix[i][j].col = j;
            } 
            else if (cellMatrix[i][j].isHint > 0) {
                changeColor("#76BA99", i, j);
                cellMatrix[i][j].fillWithNumber();
                // cellMatrix[i][j].isRevealed = true;
            }
            cells.push(cellMatrix[i][j]);
        }
    }
    return cells;
}

function revealCell(line, col) {
    var subMatrix = getAdjacentCells(line, col);

    subMatrix.forEach(element => {
        setTimeout(() => {
            if (element.line != undefined || element.col != undefined) {
                if (cellMatrix[element.line][element.col].isMine === false && cellMatrix[element.line][element.col].isRevealed === false) {
                    cellMatrix[element.line][element.col].isRevealed = true;
                    revealCell(element.line, element.col);
                }
            }
        }, 40);
    });

}

// mouse click coordinates
let mouseClick = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function(event) {
    event.preventDefault()
    mouseClick.x = event.offsetX;
    mouseClick.y = event.offsetY;
    
    if (mouseClick.x >= 0 && mouseClick.y >= 0 && mouseClick.y <= 360 && mouseClick.x <= 360) {
        for (let line = 0; line < 9; ++line) {
            for (let col = 0; col < 9; ++col) {
                if (cellMatrix[line][col].isMine && isCurrentCellClicked(line, col)) {
                    // reveal mine cell - game over
                    changeColor("red", line, col);
                    ctx.beginPath();
                    ctx.arc(cellMatrix[line][col].x + 20, cellMatrix[line][col].y + 20, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = "black";
                    ctx.fill();
                    ctx.stroke();
                    break;
                } else if (cellMatrix[line][col].isHint == 0 && isCurrentCellClicked(line, col)) {
                    // reveal empty cell 
                    revealCell(line, col);
                    break;
                } else if (cellMatrix[line][col].isHint > 0 && isCurrentCellClicked(line, col)) {
                    // reveal hint cell
                    changeColor("#76BA99", line, col);
                    cellMatrix[line][col].fillWithNumber();
                    break;
                }
            }
        }
    }
    event.preventDefault()
});

let flagsLeft = 10;

canvas.addEventListener('contextmenu', function(event) {
    mouseClick.x = event.offsetX;
    mouseClick.y = event.offsetY;

    let flagIcon = new Image();
    flagIcon.src = "flag.png";

    let flagScore = document.getElementsByTagName("span")[0];

    if (mouseClick.x >= 0 && mouseClick.y >= 0 && mouseClick.y <= 360 && mouseClick.x <= 360) {
        for (let line = 0; line < 9; ++line) {
            for (let col = 0; col < 9; ++col) {
                if (cellMatrix[line][col].color == "#59A608" && isCurrentCellClicked(line, col) && cellMatrix[line][col].isFlagged == false) {
                    ctx.drawImage(flagIcon, cellMatrix[line][col].x + 8, cellMatrix[line][col].y + 8, 25, 25);
                    --flagsLeft;
                    flagScore.textContent = flagsLeft;
                    cellMatrix[line][col].isFlagged = true;
                    break;
                } else if (cellMatrix[line][col].color == "#59A608" && isCurrentCellClicked(line, col) && cellMatrix[line][col].isFlagged) {
                    changeColor("#59A608", line, col);
                    ++flagsLeft;
                    flagScore.textContent = flagsLeft;
                    cellMatrix[line][col].isFlagged = false;
                    break;
                }
            }
        }
    }

});

function changeColor(color, line, col) {
    cellMatrix[line][col].color = color;
    cellMatrix[line][col].fillWithColor();
}

function isCurrentCellClicked (line, col) {
    if ((mouseClick.x >= cellMatrix[line][col].x && mouseClick.x <= cellMatrix[line][col].x + cellMatrix[line][col].width) &&
        (mouseClick.y >= cellMatrix[line][col].y && mouseClick.y <= cellMatrix[line][col].y + cellMatrix[line][col].width)) {
        return true;
    }
}
