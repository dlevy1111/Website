var lines = [];
const width = window.outerWidth;
const height = window.outerHeight;


function setup() {
    console.log("width", width);
    console.log("height", height);

    createCanvas(width, height);
    background(0, 0, 0);

    var i = 0;
    while (i < 10) {
        lines.push(new Wavy_line())
        i++;
    }

    for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        l.display();
    }
}



function draw() {


}

class Wavy_line {


    constructor() {
        // this.line_color;
        this.variation = (Math.random() + 2) * 50;
        this.offset = float(Math.random() * 1000);
    }

    display() {

        stroke(generate_pastel());
        var ystart = width / 2;
        for (var x = 0; x < width; x++) {
            var x_val = x;
            var y_val = ystart + 50000.0 * this.variation * cos(x / this.variation + this.offset) / (pow(x - width / 2, 2) + 50000.0);

            point(x_val, y_val);
        }

    }
}

function generate_pastel() {
    var r = random(150, 256);
    var g = random(150, 256);
    var b = random(150, 256);

    var pastel = (r, g, b);

    return pastel;
}
