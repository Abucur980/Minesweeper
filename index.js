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

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, width, height);
    }
}

let cellArray = [];

function generateGrid(x, y, width, height, cells, color1, color2) {
    for (let i = 0; i < cells; ++i) {
        // create object
        cellArray.push(new Cell(x, y, width, height));
        // create object coordinates
        if (x < canvas.width - (width + height / 2)) {
            x += 40;
        } else {
            x = 0;
            y += 40;
        }
        // pick colors for grid cells
        if (i % 2 === 0) {
            cellArray[i].color = color1;
        } else {
            cellArray[i].color = color2;
        }
        if(cellArray[i].isMine === true) {
            cellArray[i].color = "red";
        }
        cellArray[i].draw();
    }
}

generateGrid(0, 0, 40, 40, 81, '#59A608', '#5BB318');

function isMine(cells) {
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
    
    for (let i = 0; i < cells.length; ++i) {
        if (mines.includes(i)) {
            cells[i].isMine = true;
        }
    }
}

isMine(cellArray);

let mouseClick = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function(event) {
    mouseClick.x = event.offsetX;
    mouseClick.y = event.offsetY;
    if (mouseClick.x >= 0 && mouseClick.y >= 0 && mouseClick.y <= 360 && mouseClick.x <= 360) {
        for(let i = 0; i < cellArray.length; ++i){
        // console.log(cellArray[cell]);
            if (cellArray[i].isMine == true && (mouseClick.x >= cellArray[i].x && mouseClick.x <= cellArray[i].x + cellArray[i].width) && (mouseClick.y >= cellArray[i].y && mouseClick.y <= cellArray[i].y + cellArray[i].width)) {
                cellArray[i].color = "red";
                cellArray[i].draw();
                break;
            }
        }
    }
    console.log(mouseClick.x, mouseClick.y);
});
