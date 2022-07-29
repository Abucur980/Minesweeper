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

    this.draw = function(i, j) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, width, height);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.strokeRect(x, y, width, height)
        ctx.fillText((i + "," + j), x + 6, y + 25);
    }
}

let cellMatrix = new Array(9);

for (let i = 0; i < cellMatrix.length; ++i) {
    cellMatrix[i] = new Array(9);
}

function generateGrid(x, y, width, height, color1, color2) {
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
            cellMatrix[line][col].color = color1;
            cellMatrix[line][col].draw(line, col);
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



let mouseClick = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function(event) {
    mouseClick.x = event.offsetX;
    mouseClick.y = event.offsetY;
    if (mouseClick.x >= 0 && mouseClick.y >= 0 && mouseClick.y <= 360 && mouseClick.x <= 360) {
// reveal mine
        for (let line = 0; line < 9; ++line) {
            for (let col = 0; col < 9; ++col) {
                if (cellMatrix[line][col].isMine === true &&
                    (mouseClick.x >= cellMatrix[line][col].x && mouseClick.x <= cellMatrix[line][col].x + cellMatrix[line][col].width) &&
                    (mouseClick.y >= cellMatrix[line][col].y && mouseClick.y <= cellMatrix[line][col].y + cellMatrix[line][col].width)) {
                    cellMatrix[line][col].x += 40;
                    cellMatrix[line][col].color = "red";
                    cellMatrix[line][col].draw(line, col);
                    break;
                }
            }
        }
    }
    // console.log(mouseClick.x, mouseClick.y);
});
