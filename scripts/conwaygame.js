let rows, cols, resolution
let cells
let w, h

let cnv = document.getElementById("defaultCanvas0")

function setup() {
    w = window.screen.width
    h = window.screen.height

    cnv = createCanvas(w, h)
    cnv.parent("p5canvas")
    cnv.position(0, 0)

    resolution = 10

    rows = w / resolution
    cols = h / resolution

    cells = []

    for (let i = 0; i < rows; i++) {
        cells[i] = []
        for (let j = 0; j < cols; j++) {
            cells[i][j] = Math.round(Math.random() * 0.59)
        }
    }
}

function draw() {
    frameRate(10);
    background(77); // even though this is specified in the css file, it also has to be declared here so that things work right. (trust me, i tested it)

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (cells[i][j] == 1) {
                fill(100)
                rect(i * resolution, j * resolution, resolution, resolution)
            }
        }
    }

    cells = generate_next_generation(cells)
}

function generate_next_generation(list = [[]]) {
    let next_gen = []

    for (let i = 0; i < rows; i++) {
        next_gen[i] = []
        for (let j = 0; j < cols; j++) {
            const alive_neighbors = calculate_alive_neighbors(list, i, j)
            if (list[i][j] == 1) { // is the current cell alive? then we employ conway's rules of life.
                next_gen[i][j] = (alive_neighbors == 2 || alive_neighbors == 3) ? 1 : 0; // a very unusual syntax that was suggested by chatgpt (not copied)
            }
            else { // cell[i][j] wasn't originally alive, so we might resurrect it.
                next_gen[i][j] = (alive_neighbors == 3) ? 1 : 0 // a simple if{} else{} condition can be simplified into a conditional assignment, denoted by ?, with syntax ~~~ value_when_true : value_when_false
            }
        }
    }
    return next_gen
}

function calculate_alive_neighbors(list = [[]], x, y) { // a function to calculate a cell's alive neighbors, so that the generate_next_generation function is cleaner
    let len = list.length
    return list[mod((x - 1), len)][mod((y - 1), len)] + list[mod((x), len)][mod((y - 1), len)] + list[mod((x + 1), len)][mod((y - 1), len)] +
        list[mod((x - 1), len)][mod((y), len)] + list[mod((x + 1), len)][mod((y), len)] +
        list[mod((x - 1), len)][mod((y + 1), len)] + list[mod((x), len)][mod((y + 1), len)] + list[mod((x + 1), len)][mod((y + 1), len)];
}

function mod(a, b) {
    a = Math.floor(Math.abs(a));
    b = Math.floor(Math.abs(b));
    return (a - (b * Math.floor(a / b))); // found online yay
}