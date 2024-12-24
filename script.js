let size = 8
let percentage = 1 / size * 100

let cells = document.querySelectorAll(".cell")
let text_area = document.getElementById('text')
let letters_left = document.getElementById('letters_left')
let original_text = letters_left.innerText


let color_map = getMapFromCookie('color_map')
if (color_map.size == 0) {
    console.log("once and no more")
    color_map.set(0, '#ed333b')
    color_map.set(11, '#3584e4')
    color_map.set(1, '#2ec27e')
    color_map.set(10, '#813d9c')
}

update_text(getStringCookie('text'))

text_area.addEventListener('input', (e) => {
    if (text_area.value.length == 0) {
        letters_left.innerText = original_text
    } else {
        letters_left.innerText = `you have ${16 - text_area.value.length} left`
    }

    fill_grid(cells, text_area.value, color_map)
    setStringCookie('text', text_area.value)
})

document.getElementById('title').addEventListener('mouseover', (e) => {
    e.target.innerText = 'bill cipher'

    setTimeout(() => {
        e.target.innerText = "ben cipher";
    }, 200);
})

setup_color_listeners()
setup_download_dialog()
generate_ascii_table()
fill_grid(cells, text_area.value, color_map)


