function svg(content, width, height) {
    return `
    <svg width="${width}" height="${height}"  
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg">${content}
    </svg>`
}


function rect(color, stroke, stroke_width, id, width, height, x, y) {
    return `
      <rect
        style="fill:${color};stroke:${stroke};stroke-width:${stroke_width};"
        id="rect${id}"
        width="${width}%"
        height="${height}%"
        x="${x}%"
        y="${y}%" />`
}

function grid(size, color_map, stroke, stroke_width, cipher_grid) {
    let grid = ""
    let percentage = 1 / size * 100
    let i = 0
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            grid += rect(
                color_map.get(cipher_grid[y][x]),
                stroke, stroke_width,
                i++,
                percentage, percentage,
                x * percentage, y * percentage)
        }
    }

    return grid
}

function create_svg(color_map, cipher_grid) {
    return svg(
        grid(8, color_map, 'rgb(0, 38, 41)', 2.5, cipher_grid)
        + rect('#00000000', 'rgb(0, 38, 41)',
            5,
            'Frame',
            100, 100,
            0, 0),
        500, 500)
}
