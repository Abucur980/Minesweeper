const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = "363"
canvas.height = "363"

let col = 1;
let line = 1;
let gridItems = 0;
while (gridItems < 81) {
    console.log(col, line);
    if (gridItems % 2 === 0) {
        ctx.fillStyle = '#59A608';
    } else {
        ctx.fillStyle = '#836539';
    }
    
    ctx.fillRect(col, line, 40, 40);
    if (col < 300) {
        col += 40;
    } else {
        col = 1;
        line += 40;
    }
    ++gridItems;
}