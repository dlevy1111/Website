let rows, cols, resolution
var cells, bottom_cells

var cnv = document.getElementById("defaultCanvas0")

var vertical_length_of_everything

var dropX, dropY

let dripping = false


function setup() {
    w = window.screen.width

    // my new favorite function. much love to .getBoundingClientRect()
    vertical_length_of_everything = document.getElementById("page_wrapper").getBoundingClientRect()

    // console.log(Math.round(vertical_length_of_everything.height) + "px")
    h = (Math.round(vertical_length_of_everything.height))

    cnv = createCanvas(w, h)
    cnv.parent("p5canvas")
    cnv.position(0, 0)

    resolution = 10

    rows = Math.ceil(w / resolution)
    cols = Math.ceil(h / resolution / 2)

    cells = []
    bottom_cells = []
    dropX = w / 2
    dropY = 0

    noiseDetail(8, 0.7)

    for (var i = 0; i < rows; i++) { // initially setting all cells to 0
        cells[i] = []
        bottom_cells[i] = []
        for (var j = 0; j < cols; j++) {
            cells[i][j] = 0
            bottom_cells[i][j] = 0
        }
    }

    for (var i = 0; i < rows; i++) { // creating floor and ceiling outline
        let noisevar_upper = 17 * noise(i / 20.0)
        let noisevar_lower = 17 * noise(i / 20.0 + 1000000.0)

        cells[i][constrain(round(noisevar_upper), 6, cols / 2 + 5)] = 1
        bottom_cells[i][constrain(cols - round(noisevar_lower) + 5, cols / 2 - 5, cols - 2)] = 1
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
            if (bottom_cells[i][j - 1] != 1) {
                bottom_cells[i][j] = 1
            }
            else {
                bottom_cells[i][j] = 1
                break
            }
        }
    }

    for (var i = 0; i < bottom_cells.length; i++) {
        bottom_cells[i] = reverse(bottom_cells[i])
    }
}


function draw() {
    frameRate(24)
    background(100)

    w = window.screen.width

    vertical_length_of_everything = document.getElementById("page_wrapper").getBoundingClientRect()
    h = (Math.round(vertical_length_of_everything.height) + 300)

    cnv = createCanvas(w, h)
    cnv.parent("p5canvas")
    cnv.position(0, 0)

    cnv.style.zIndex = -1

    fill(100, 100, 175)
    rect(dropX, dropY, resolution, resolution)

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {

            if (cells[i][j] == 1) {
                fill(110)
                rect(i * resolution, j * resolution, resolution, resolution)
            }

            if (bottom_cells[i][j] == 1) {
                fill(110);
                rect(i * resolution, (height / resolution - j) * resolution, resolution, resolution);
                //print((height/resolution/2-j)*resolution, " ");
            }
        }
    }

    if (dropY > h - 1) {
        dripping = false;
    }

    if (dripping == false) {
        var temp_location = resetDroplet(cells)
        dropX = temp_location[0]
        dropY = temp_location[1]
        dripping = true
    }

    dropY = dropY + 10;
}

function resetDroplet(list = [[]]) {
    var droplet_location_x
    var droplet_location_y = 0

    var droplet_in_apt_location = false // is the droplet in a position where it actually makes sense for it to drip?
    var droplet_placement_counter = 0

    while (droplet_in_apt_location == false) { // iteratively placing a droplet, moving it down to a stalagtite, and then removing it if said said stalagtite isn't sharp enough
        droplet_location_x = round(random(1, window.innerWidth / resolution - 2))

        for (var j = 0; j < cols / 2; j++) { // moving water droplet down to the edge of the ceiling
            if (list[droplet_location_x][j + 1] === 1) {
                continue
            }
            else {
                list[droplet_location_x][j + 1] = 2
                droplet_location_y = j + 1
                break
            }
        }

        if (droplet_placement_counter > list.length - 1) { //if we have tried adding droplets more times than spots for droplets to form, stop and just put it somewhere anyway.
            list[droplet_location_x][droplet_location_y] = 1
            break
        }

        if (list[droplet_location_x - 1][droplet_location_y] == 1 || list[droplet_location_x + 1][droplet_location_y] == 1) {
            continue
        }

        else {
            droplet_in_apt_location = true
        }
        droplet_placement_counter += 1
    }
    return [droplet_location_x * resolution, droplet_location_y]
}