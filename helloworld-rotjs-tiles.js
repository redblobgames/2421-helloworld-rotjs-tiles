/*!
 * From redblobgames/2421-helloworld-rotjs-tiles/
 * Copyright 2024 Red Blob Games <redblobgames@gmail.com>
 * @license MIT
 */

let tmxXml = await (await fetch("kenney_1-bit-pack/Tilemap/sample_fantasy.tmx")).text();
let tmxParsed = (new DOMParser()).parseFromString(tmxXml, 'text/xml');
let csv = tmxParsed.querySelector("data").textContent;

const kenneyArt = document.createElement("img");
kenneyArt.src = "kenney_1-bit-pack/Tilesheet/colored.png";
kenneyArt.onload = redraw;

// From Tilesheet.txt
const TILESHEET_COLS = 49;
const TILESHEET_ROWS = 22;
const TILE_SIZE = 16;
const TILE_MARGIN = 1;
const TILE_SPACING = TILE_SIZE + TILE_MARGIN;

// Set up name tile_{col}_{row} to point to the tile at col,row
const tileMap = {};
for (let col = 0; col < TILESHEET_COLS; col++) {
    for (let row = 0; row < TILESHEET_ROWS; row++) {
        tileMap[`tile_${col}_${row}`] = [col * TILE_SPACING, row * TILE_SPACING];
    }
}

const options = {
    layout: 'tile',
    tileWidth: TILE_SIZE,
    tileHeight: TILE_SIZE,
    tileSet: kenneyArt,
    tileMap: tileMap,
    bg: 'transparent',
    width: 40,
    height: 20,
};

const display = new ROT.Display(options);
document.body.append(display.getContainer());


function redraw() {
    // quick&dirty: parse the tmx csv assuming no special characters
    let lines = csv.split("\n");
    for (let y = 0; y < lines.length; y++) {
        let ids = lines[y].split(",").map(parseFloat);
        for (let x = 0; x < ids.length; x++) {
            let id = ids[x] & 0xffffff;
            // TODO: the flags above 0xffffff are for flipping the tile, but
            // I don't know how to do that in rotjs
            id -= 1; // firstgid = 1 in tmx
            if (id < 0) continue;
            let col = id % 32;
            let row = Math.floor(id / 32);
            console.log(x, y, col, row, id)
            display.draw(x, y, `tile_${col}_${row}`);
        }
    }
}

