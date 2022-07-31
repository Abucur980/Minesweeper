const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

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

    this.draw = function() {
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
    if (lineOrCol >= 1) {
        startCell = lineOrCol - 1;
    } else {
        startCell = lineOrCol;
    }
    return startCell;
}

function getEndCell(lineOrCol) {
    var endCell;
    if (lineOrCol <= 7) {
        endCell = lineOrCol + 1;
    } else {
        endCell = lineOrCol;
    }
    return endCell;
}

insertHints();

function revealEmptyCells() {

}

let mouseClick = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function(event) {
    mouseClick.x = event.offsetX;
    mouseClick.y = event.offsetY;
    if (mouseClick.x >= 0 && mouseClick.y >= 0 && mouseClick.y <= 360 && mouseClick.x <= 360) {
        for (let line = 0; line < 9; ++line) {
            for (let col = 0; col < 9; ++col) {
                if (cellMatrix[line][col].isMine && isCurrentCellClicked(line, col)) {
                    // mine cell
                    changeColor("red", line, col)
                    break;
                } else if (cellMatrix[line][col].isHint == 0 && isCurrentCellClicked(line, col)) {
                    // empty cell
                    changeColor("#CA955C", line, col);
                    break;
                } else if (cellMatrix[line][col].isHint > 0 && isCurrentCellClicked(line, col)) {
                    // hint cell
                    changeColor("#76BA99", line, col);
                    cellMatrix[line][col].fillWithNumber();
                    break;
                }
            }
        }
    }
    // console.log(mouseClick.x, mouseClick.y);
});

function changeColor(color, line, col) {
    cellMatrix[line][col].color = color;
    cellMatrix[line][col].draw();
}

function isCurrentCellClicked (line, col) {
    if ((mouseClick.x >= cellMatrix[line][col].x && mouseClick.x <= cellMatrix[line][col].x + cellMatrix[line][col].width) &&
        (mouseClick.y >= cellMatrix[line][col].y && mouseClick.y <= cellMatrix[line][col].y + cellMatrix[line][col].width)) {
        return true;
    }
}