import City from './City.js';
import Tile from "./Tile.js";
window.onload = function(e) {
    var city = new City();

    // Let's draw the map
    let size = 5;
    let canvas = document.getElementById("exitus");
    let ctx = canvas.getContext("2d");
    for (let y = 0; y < city.tiles.length; y++) {
        for (let x = 0; x < city.tiles[0].length; x++) {
            ctx.fillStyle = "#FF0000";
            if (city.tiles[y][x].type === Tile.TYPE_BUILDING) {
                ctx.fillStyle = "#00FF00";
            }
            console.log(size*x,size*y,(size*x)+size,(size*y)+size);
            ctx.fillRect(size*x,size*y,(size*x)+size,(size*y)+size);

        }
    }
};
