var lines = [];
var w;
var h;

var cnv = document.getElementById("defaultCanvas0");

class Wavy_line {
    constructor() {
        // this.line_color;
        this.variation = (Math.random() + 2) * 50;
        this.offset = float(Math.random() * 2 * 3.14);
    }

    display() {
        stroke(255);
        var ystart = h / 2;
        for (var x = 0; x < w; x++) {
            var x_val = x;
            var y_val = ystart + 50000.0 * this.variation * cos(x / this.variation + this.offset) / (pow(x - w / 2, 2) + 50000.0);

            point(x_val, y_val);
        }
    }
}

function setup() {

    w = windowWidth;
    h = windowHeight;

    console.log("width", w);
    console.log("height", h);

    cnv = createCanvas(w, h);
    cnv.parent("p5canvas");
    cnv.position(0, 0);

    background(7, 7, 45);

    var i = 0;
    while (i < 10) {
        lines.push(new Wavy_line());
        i++;
    }

    for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        l.display();
    }
}


function draw() {

    w = windowWidth;
    h = windowHeight;

    console.log("width", w);
    console.log("height", h);

    cnv = createCanvas(w, h);
    cnv.parent("p5canvas");
    cnv.position(0, 0);

    background(7, 7, 45);

    for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        l.display();
    }
}
