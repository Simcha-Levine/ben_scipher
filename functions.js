function get_cell(cells, x, y) {
    return cells[x + y * size]
}

function update_text(text) {
    document.getElementById('text').value = text
    setStringCookie('text', text)
}

function get_grid(text) {

    let left = 16 - text.length
    if (left > 0) {
        text = text + '\0'.repeat(left)
    }

    let grid = []

    let i = 0
    for (let y = 0; y < 8; y++) {
        let letter_bin = text.charCodeAt(i++).toString(2).padStart(8, '0')
        let row = []
        for (let x = 0; x < 8; x++) {
            if (letter_bin[x] == '0') {
                row.push(0)
            } else {
                row.push(10)
            }
        }
        grid.push(row)
    }

    for (let x = 0; x < 8; x++) {
        let letter_bin = text.charCodeAt(i++).toString(2).padStart(8, '0')
        for (let y = 0; y < 8; y++) {
            if (letter_bin[y] == '1') {
                grid[y][x] += 1
            }
        }
    }

    // for (row of grid) {
    //     let str = ""
    //     for (x of row) {
    //         str += `${x.toString().padStart(2, '0')},`
    //     }
    // }

    return grid
}

function fill_grid(cells, text, color_map) {
    let grid = get_grid(text)

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {

            get_cell(cells, x, y).dataset.colorType = grid[y][x]
        }
    }
    update_colors()
}

function unravel_grid(cells) {
    let i = 0
    let text = ""
    for (let y = 0; y < 8; y++) {
        let letter = ""
        for (let x = 0; x < 8; x++) {
            letter += Math.floor(parseInt(get_cell(cells, x, y).dataset.colorType, 10) / 10)
        }
        text += String.fromCharCode(parseInt(letter, 2))
    }

    for (let x = 0; x < 8; x++) {
        let letter = ""
        for (let y = 0; y < 8; y++) {
            letter += parseInt(get_cell(cells, x, y).dataset.colorType, 10) % 10
        }
        text += String.fromCharCode(parseInt(letter, 2))
    }

    return text
}

function make_row(char, dec, bin, hex) {
    return `
            <tr>
                <td>${char}</td>
                <td>${dec}</td>
                <td>${bin}</td>
                <td>${hex}</td>
            </tr>`
}

function generate_ascii_table() {
    let table = document.getElementById("table")

    for (let i = 33; i < 127; i++) {
        const char = String.fromCharCode(i)
        const decimal = i
        const binary = i.toString(2).padStart(8, '0');
        const hex = i.toString(16).toUpperCase()

        table.innerHTML += make_row(char, decimal, binary, hex)
    }
}

function update_colors() {
    document.querySelectorAll(`.color`).forEach((element) => {
        element.style.background = color_map.get(parseInt(element.dataset.colorType, 10))
    })
}

function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
}

function setup_download_dialog() {

    document.getElementById('download').addEventListener('click', (e) => {
        const name = document.getElementById('text').value
        document.getElementById('dialog').showModal()
        document.getElementById('preview').innerHTML = create_svg(color_map, get_grid(text_area.value))
        document.getElementById('preview_text').innerText = `'${name}.svg'`

    })

    document.getElementById('close').addEventListener('click', (e) => {
        document.getElementById('dialog').close()
    })

    document.getElementById('proceed').addEventListener('click', (e) => {
        const name = document.getElementById('text').value
        downloadString(create_svg(color_map, get_grid(text_area.value)), 'svg', `${name}.svg`)
        document.getElementById('dialog').close()
    })
}

function reset_holds() {
    last_cell.classList.remove('hold')
    document.getElementById('explain_00').classList.remove('hold')
    document.getElementById('explain_11').classList.remove('hold')
    document.getElementById('explain_01').classList.remove('hold')
    document.getElementById('explain_10').classList.remove('hold')
    last_cell = null
}

let last_color = 0
let last_cell = null
function setup_color_listeners() {

    document.getElementById('picker').addEventListener('change', (event) => {
        color_map.set(last_color, event.target.value)

        update_colors()
        setMapCookie('color_map', color_map, 7)

    })

    window.addEventListener('click', (event) => {


        if (last_cell != null) {
            if (event.target.classList.contains('explain_color')) {
                last_cell.dataset.colorType = event.target.dataset.colorType
                update_colors()
                update_text(unravel_grid(cells))
            }
            reset_holds()
        }
        else if (event.target.classList.contains('color_picker')) {

            document.getElementById(`picker`).showPicker()
            last_color = parseInt(event.target.dataset.colorType, 10)
        }
        else if (event.target.classList.contains('cell')) {
            last_cell = event.target;
            last_cell.classList.add('hold')
            document.getElementById('explain_00').classList.add('hold')
            document.getElementById('explain_11').classList.add('hold')
            document.getElementById('explain_01').classList.add('hold')
            document.getElementById('explain_10').classList.add('hold')
        }
    })
}