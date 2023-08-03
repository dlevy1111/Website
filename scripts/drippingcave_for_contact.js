let rows, cols, resolution
var cells

var cnv = document.getElementById("defaultCanvas0")


function setup() {

    w = window.screen.width
    // h = document.documentElement.scrollHeight
    // h = window.screen.height
    h = 2000;

    console.log(h)

    cnv = createCanvas(w, h)
    cnv.parent("p5canvas")
    cnv.position(0, 0)

    resolution = 10

    rows = w / resolution
    cols = h / resolution

    cells = []

    noiseDetail(8, 0.7)

    for (var i = 0; i < rows; i++) { //initially setting all cells to 0
        cells[i] = []
        for (var j = 0; j < cols; j++) {
            cells[i][j] = 0
        }
    }

    for (var i = 0; i < rows; i++) { // creating floor and ceiling outline
        let noisevar_upper = 17 * noise(i / 20.0)
        let noisevar_lower = 17 * noise(i / 20.0 + 1000000.0)

        cells[i][constrain(round(noisevar_upper), 6, cols / 2 + 5)] = 1
        cells[i][constrain(cols - round(noisevar_lower) + 5, cols / 2 - 5, cols - 2)] = 1
    }

    for (var i = 0; i < rows; i++) { // fixing above and below cave ceiling and floor
        for (var j = 0; j < cols / 2; j++) {
            if (cells[i][j + 1] != 1) {
                cells[i][j] = 1
            }
            else {
                cells[i][j] = 1
                break
            }
        }

        for (var j = cols - 1; j > cols / 2; j--) {
            if (cells[i][j - 1] != 1) {
                cells[i][j] = 1
            }
            else {
                cells[i][j] = 1
                break
            }
        }
    }
}

function draw() {
    frameRate(24)
    background(100)

    w = window.screen.width
    h = document.documentElement.scrollHeight

    cnv = createCanvas(w, h)
    cnv.parent("p5canvas")
    cnv.position(0, 0)

    cnv.style.zIndex = -1

    let dripping = false

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (cells[i][j] == 1) {
                fill(110)
                rect(i * resolution, j * resolution, resolution, resolution)
            }
            if (cells[i][j] == 2) {
                fill(100, 100, 175)
                rect(i * resolution, j * resolution, resolution, resolution)
                dripping = true //repurposing this loop to determine if any droplets are around:
            }
        }
    }

    if (dripping == false) {
        add_droplet(cells)
        dripping = true
    }

    cells = generate_next_generation(cells)
}

function add_droplet(list = [[]]) {
    let new_list = list

    var droplet_location_x
    var droplet_location_y = 0

    var droplet_in_apt_location = false // is the droplet in a position where it actually makes sense for it to drip?
    var droplet_placement_counter = 0

    while (droplet_in_apt_location == false) { // iteratively placing a droplet, moving it down to a stalagtite, and then removing it if said said stalagtite isn't sharp enough
        droplet_location_x = round(random(1, window.innerWidth / resolution - 2))

        for (var j = 0; j < cols / 2; j++) { // moving water droplet down to the edge of the ceiling
            if (cells[droplet_location_x][j + 1] == 1) {
                continue
            }
            else {
                cells[droplet_location_x][j + 1] = 2
                droplet_location_y = j + 1
                break
            }
        }

        if (droplet_placement_counter > list.length - 1) { //if we have tried adding droplets more times than spots for droplets to form, stop and just put it somewhere anyway.
            cells[droplet_location_x][droplet_location_y] = 1
            break
        }

        if (cells[droplet_location_x - 1][droplet_location_y] == 1 || cells[droplet_location_x + 1][droplet_location_y] == 1) {
            cells[droplet_location_x][droplet_location_y] = 0
            continue
        }
        else {
            droplet_in_apt_location = true
        }
        droplet_placement_counter += 1
    }

    return new_list
}

function generate_next_generation(list = [[]]) {
    let next_gen = list//new int[list.length][list[0].length];
    let stop_dripping = false

    for (var i = 0; i < rows; i++) {
        let break_flag = false
        for (var j = 0; j < cols; j++) {

            if (list[i][j] == 2) {
                break_flag = true
                if (list[i][j + 1] == 1) {
                    stop_dripping = true
                }

                next_gen[i][j] = 0
                next_gen[i][j + 1] = 2

                if (stop_dripping == true) {
                    next_gen[i][j + 1] = 1;
                    stop_dripping = false;
                }
                break;
            }
        }
        if (break_flag == true) {
            break;
        }
    }
    return next_gen;
}