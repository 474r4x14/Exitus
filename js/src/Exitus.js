import City from './City';
import Spriteset from "./Spriteset";

var isSpriteLoaded = false;
var city1 = new City();
var city2 = new City(1,0);
city1.generate();
city2.generate();
// Let's draw the map
let ctx;
var spriteset;
window.onload = function(e) {

    let canvas = document.getElementById("exitus");

    spriteset = new Spriteset(spriteLoaded);

    var mouseDown = false;
    var startX = 0;
    var startY = 0;

    canvas.onmousedown = function(e)
    {
        mouseDown = true;
        console.log(e);
        startX = e.clientX;
        startY = e.clientY;
    };

    canvas.onmouseup = function(e)
    {
        mouseDown = false;
    };

    canvas.onmousemove = function(e)
    {
        if (mouseDown === true) {
            City.transX += e.clientX - startX;
            City.transY += e.clientY - startY;
            startX = e.clientX;
            startY = e.clientY;
        }
    }

    ctx = canvas.getContext("2d");
    requestAnimationFrame(redraw);

};

    function spriteLoaded() {
        isSpriteLoaded = true;
    }

function redraw()
{
    let canvas = document.getElementById("exitus");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < city1.tiles.length; y++) {
        for (let x = 0; x < city1.tiles[0].length; x++) {
            city1.tiles[y][x].draw(ctx);
        }
    }
    for (let y = 0; y < city1.roads.length; y++) {
        city1.roads[y].draw(ctx);
    }
    for (let y = 0; y < city2.tiles.length; y++) {
        for (let x = 0; x < city2.tiles[0].length; x++) {
            city2.tiles[y][x].draw(ctx);
        }
    }
        requestAnimationFrame(redraw);
}

