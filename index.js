const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = "360";
canvas.height = "360";

function generateGrid(x, y, width, height, cells, color1, color2) {
    for (let i = 0; i < cells; ++i) {
        if (i % 2 === 0) {
            ctx.fillStyle = color1;
        } else {
            ctx.fillStyle = color2;
        }
        ctx.fillRect(x, y, width, height);
        if (x < canvas.width - (width + height / 2)) {
            x += 40;
        } else {
            x = 0;
            y += 40;
        }
    }
}

generateGrid(0, 0, 40, 40, 81, '#59A608', '#836539');
