import City from './City';
import Spriteset from "./Spriteset";
import Point from "./utils/Point";

var isSpriteLoaded = false;
var city1 = new City();
var city2 = new City(1,0);
city1.generate();
city2.generate();
// Let's draw the map
let ctx;
var spriteset;

let startClick = null;
let path = [];

window.onload = function(e) {

    let canvas = document.getElementById("exitus");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete

    spriteset = new Spriteset(spriteLoaded);

    var mouseDown = false;
    var startX = 0;
    var startY = 0;
    let mouseDownLoc = new Point();

    canvas.onmousedown = function(e)
    {
        mouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        mouseDownLoc.x = e.clientX;
        mouseDownLoc.y = e.clientY;
    };

    canvas.onmouseup = function(e)
    {
        mouseDown = false;
        if (mouseDownLoc.x === startX && mouseDownLoc.y === startY) {
            if (startClick === null) {
                path = [];
                startClick = new Point(e.clientX-City.transX, e.clientY-City.transY);
            } else {
                let pathNodes = City.polyPath.clickCheck(startClick.x,startClick.y,e.clientX-City.transX, e.clientY-City.transY);
                if (pathNodes) {
                    for (var x = 0; x < pathNodes.length; x++) {
                        path.push(pathNodes[x].centre);
                    }
                }
                startClick = null;
            }
        }
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
    if (path.length > 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        ctx.moveTo(path[0].x+City.transX, path[0].y+City.transY);
        for (var i=1; i < path.length;i++) {
            ctx.lineTo(path[i].x+City.transX, path[i].y+City.transY);
        }

        ctx.stroke();
    }
    requestAnimationFrame(redraw);
}

