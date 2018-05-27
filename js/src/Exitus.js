import Tile from './Tile';
import City from './City';
import Spriteset from "./Spriteset";
import Point from "./utils/Point";
import Character from "./character/Character";

var isSpriteLoaded = false;
City.blocks.center = new City();
City.blocks.center.generate();

City.blocks.north = new City(0,-1);
City.blocks.north.exitPoints.south = City.blocks.center.exitPoints.north;
City.blocks.north.generate();

City.blocks.east = new City(1,0);
City.blocks.east.exitPoints.west = City.blocks.center.exitPoints.east;
City.blocks.east.generate();

City.blocks.south = new City(0,1);
City.blocks.south.exitPoints.north = City.blocks.center.exitPoints.south;
City.blocks.south.generate();

City.blocks.west = new City(-1,0);
City.blocks.west.exitPoints.east = City.blocks.center.exitPoints.west;
City.blocks.west.generate();

City.blocks.northEast = new City(1,-1);
City.blocks.northEast.exitPoints.west = City.blocks.north.exitPoints.east;
City.blocks.northEast.exitPoints.south = City.blocks.east.exitPoints.north;
City.blocks.northEast.generate();

City.blocks.southEast = new City(1,1);
City.blocks.southEast.exitPoints.west = City.blocks.south.exitPoints.east;
City.blocks.southEast.exitPoints.north = City.blocks.east.exitPoints.north;
City.blocks.southEast.generate();

City.blocks.northWest = new City(-1,-1);
City.blocks.northWest.exitPoints.east = City.blocks.north.exitPoints.west;
City.blocks.northWest.exitPoints.south = City.blocks.west.exitPoints.north;
City.blocks.northWest.generate();

City.blocks.southWest = new City(-1,1);
City.blocks.southWest.exitPoints.east = City.blocks.south.exitPoints.west;
City.blocks.southWest.exitPoints.north = City.blocks.west.exitPoints.north;
City.blocks.southWest.generate();

// Let's pick a random road as a starting position for the character
let randRoad = City.blocks.center.roads[Math.floor(Math.random()*City.blocks.center.roads.length)];
let character = new Character((randRoad.start.x*Tile.SIZE)+Tile.SIZE/2,(randRoad.start.y*Tile.SIZE)+Tile.SIZE/2, Character.TYPE_PLAYER);
let characters = [];
characters.push(character);
randRoad = City.blocks.center.roads[Math.floor(Math.random()*City.blocks.center.roads.length)];
character = new Character((randRoad.start.x*Tile.SIZE)+Tile.SIZE/2,(randRoad.start.y*Tile.SIZE)+Tile.SIZE/2, Character.TYPE_PLAYER);
characters.push(character);

randRoad = City.blocks.center.roads[Math.floor(Math.random()*City.blocks.center.roads.length)];
character = new Character((randRoad.start.x*Tile.SIZE)+Tile.SIZE/2,(randRoad.start.y*Tile.SIZE)+Tile.SIZE/2, Character.TYPE_ENEMY);
characters.push(character);

let selectedCharacter;

let ctx;
var spriteset;

let center = new Point();


window.onload = function(e) {

    let canvas = document.getElementById("exitus");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete

    center.x = (document.body.clientWidth/2) - ((Tile.SIZE*City.width)/2);
    center.y = (document.body.clientHeight/2) - ((Tile.SIZE*City.height)/2);

    City.transX = center.x;
    City.transY = center.y;

    spriteset = new Spriteset(spriteLoaded);

    var mouseDown = false;
    var startX = 0;
    var startY = 0;
    let mouseDownLoc = new Point();

    canvas.onmousedown = inputDown;
    canvas.ontouchstart = inputDown;

    canvas.onmouseup = inputUp;
    canvas.ontouchend = inputUp;

    function inputDown(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.touches[0].clientX;
            point.y = e.touches[0].clientY;
        }
        mouseDown = true;
        startX = point.x;
        startY = point.y;
        mouseDownLoc.x = point.x;
        mouseDownLoc.y = point.y;
    }

    function inputMove(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.touches[0].clientX;
            point.y = e.touches[0].clientY;
        }
        if (mouseDown === true) {
            City.transX += point.x - startX;
            City.transY += point.y - startY;
            startX = point.x;
            startY = point.y;
        } else {
            for (let i = 0; i < characters.length; i++) {
                if (characters[i].type === Character.TYPE_PLAYER) {
                    characters[i].lookAt(point);
                }
            }
        }
        // The world location, used to move to a new block
        let worldLoc = new Point();
        worldLoc.x = Math.floor((-City.transX+center.x+((Tile.SIZE*City.width)/2)) / (Tile.SIZE*City.width));
        worldLoc.y = Math.floor((-City.transY+center.y+((Tile.SIZE*City.height)/2)) / (Tile.SIZE*City.height));

        // Shift world East
        if (worldLoc.x > City.worldLoc.x) {
            City.worldLoc.x++;

            City.blocks.west = City.blocks.center;
            City.blocks.center = City.blocks.east;
            City.blocks.east = new City(City.blocks.center.worldLoc.x+1,City.blocks.center.worldLoc.y);
            City.blocks.east.exitPoints.west = City.blocks.center.exitPoints.east;
            City.blocks.east.generate();

            City.blocks.southWest = City.blocks.south;
            City.blocks.south = City.blocks.southEast;
            City.blocks.southEast = new City(City.blocks.south.worldLoc.x+1,City.blocks.south.worldLoc.y);
            City.blocks.southEast.exitPoints.west = City.blocks.south.exitPoints.east;
            City.blocks.southEast.exitPoints.north = City.blocks.east.exitPoints.north;
            City.blocks.southEast.generate();

            City.blocks.northWest = City.blocks.north;
            City.blocks.north = City.blocks.northEast;
            City.blocks.northEast = new City(City.blocks.north.worldLoc.x+1,City.blocks.north.worldLoc.y);
            City.blocks.northEast.exitPoints.west = City.blocks.north.exitPoints.east;
            City.blocks.northEast.exitPoints.south = City.blocks.east.exitPoints.north;
            City.blocks.northEast.generate();
        }

        // Shift world West
        if (worldLoc.x < City.worldLoc.x) {
            City.worldLoc.x--;
            City.blocks.east = City.blocks.center;
            City.blocks.center = City.blocks.west;
            City.blocks.west = new City(City.blocks.center.worldLoc.x-1,City.blocks.center.worldLoc.y);
            City.blocks.west.exitPoints.east = City.blocks.center.exitPoints.west;
            City.blocks.west.generate();

            City.blocks.northEast = City.blocks.north;
            City.blocks.north = City.blocks.northWest;
            City.blocks.northWest = new City(City.blocks.north.worldLoc.x-1,City.blocks.north.worldLoc.y);
            City.blocks.northWest.exitPoints.east = City.blocks.north.exitPoints.west;
            City.blocks.northWest.exitPoints.south = City.blocks.west.exitPoints.north;
            City.blocks.northWest.generate();

            City.blocks.southEast = City.blocks.south;
            City.blocks.south = City.blocks.southWest;
            City.blocks.southWest = new City(City.blocks.south.worldLoc.x-1,City.blocks.south.worldLoc.y);
            City.blocks.southWest.exitPoints.east = City.blocks.south.exitPoints.west;
            City.blocks.southWest.exitPoints.north = City.blocks.west.exitPoints.north;
            City.blocks.southWest.generate();
        }


        // Shift world South
        if (worldLoc.y > City.worldLoc.y) {
            City.worldLoc.y++;
            City.blocks.north = City.blocks.center;
            City.blocks.center = City.blocks.south;
            City.blocks.south = new City(City.blocks.center.worldLoc.x,City.blocks.center.worldLoc.y+1);
            City.blocks.south.exitPoints.north = City.blocks.center.exitPoints.south;
            City.blocks.south.generate();

            City.blocks.northEast = City.blocks.east;
            City.blocks.east = City.blocks.southEast;
            City.blocks.southEast = new City(City.blocks.east.worldLoc.x,City.blocks.east.worldLoc.y+1);
            City.blocks.southEast.exitPoints.west = City.blocks.south.exitPoints.east;
            City.blocks.southEast.exitPoints.north = City.blocks.east.exitPoints.north;
            City.blocks.southEast.generate();

            City.blocks.northWest = City.blocks.west;
            City.blocks.west = City.blocks.southWest;
            City.blocks.southWest = new City(City.blocks.west.worldLoc.x,City.blocks.west.worldLoc.y+1);
            City.blocks.southWest.exitPoints.east = City.blocks.south.exitPoints.west;
            City.blocks.southWest.exitPoints.north = City.blocks.west.exitPoints.north;
            City.blocks.southWest.generate();
        }
        // Shift world North
        if (worldLoc.y < City.worldLoc.y) {
            City.worldLoc.y--;
            City.blocks.south = City.blocks.center;
            City.blocks.center = City.blocks.north;
            City.blocks.north = new City(City.blocks.center.worldLoc.x,City.blocks.center.worldLoc.y-1);
            City.blocks.north.exitPoints.south = City.blocks.center.exitPoints.north;
            City.blocks.north.generate();

            City.blocks.southEast = City.blocks.east;
            City.blocks.east = City.blocks.northEast;
            City.blocks.northEast = new City(City.blocks.east.worldLoc.x,City.blocks.east.worldLoc.y-1);
            City.blocks.northEast.exitPoints.west = City.blocks.north.exitPoints.east;
            City.blocks.northEast.exitPoints.south = City.blocks.east.exitPoints.north;
            City.blocks.northEast.generate();

            City.blocks.southWest = City.blocks.west;
            City.blocks.west = City.blocks.northWest;
            City.blocks.northWest = new City(City.blocks.west.worldLoc.x,City.blocks.west.worldLoc.y-1);
            City.blocks.northWest.exitPoints.east = City.blocks.north.exitPoints.west;
            City.blocks.northWest.exitPoints.south = City.blocks.west.exitPoints.north;
            City.blocks.northWest.generate();
        }
    }

    function inputUp(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.changedTouches[0].clientX;
            point.y = e.changedTouches[0].clientY;
        }
        mouseDown = false;

        let selectedNewCharacter = false;
        let i,j;
        for (i = 0; i < characters.length; i++) {
            if (characters[i].type === Character.TYPE_PLAYER &&
                point.x > characters[i].x-10+City.transX && point.x < characters[i].x+10+City.transX &&
                point.y > characters[i].y-10+City.transY && point.y < characters[i].y+10+City.transY
            ) {
                for (j = 0; j < characters.length; j++) {
                    characters[j].active = false;
                }
                console.log('selected char ' + i);
                characters[i].active = true;
                selectedCharacter = characters[i];
                selectedNewCharacter = true;
                break;
            }
        }


        if (mouseDownLoc.x === startX && mouseDownLoc.y === startY) {
            if (selectedCharacter instanceof Character && !selectedNewCharacter) {
                let pathNodes = City.polyPath.clickCheck(selectedCharacter.x, selectedCharacter.y, point.x - City.transX, point.y - City.transY);
                if (pathNodes) {
                    selectedCharacter.path = [];
                    for (var x = 0; x < pathNodes.length; x++) {
                        selectedCharacter.path.push(pathNodes[x].centre);
                    }
                }
            }
        }
    }
    

    canvas.ontouchmove = inputMove;
    canvas.onmousemove = inputMove;

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

    if (City.blocks.center !== undefined) {
        for (let y = 0; y < City.blocks.center.tiles.length; y++) {
            for (let x = 0; x < City.blocks.center.tiles[0].length; x++) {
                City.blocks.center.tiles[y][x].draw(ctx);
            }
        }
        for (let y = 0; y < City.blocks.center.buildings.length; y++) {
            City.blocks.center.buildings[y].draw(ctx);
        }
        for (let y = 0; y < City.blocks.center.roads.length; y++) {
            City.blocks.center.roads[y].draw(ctx);
        }
    }
    if (City.blocks.east !== undefined) {
        for (let y = 0; y < City.blocks.east.tiles.length; y++) {
            for (let x = 0; x < City.blocks.east.tiles[0].length; x++) {
                City.blocks.east.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.west !== undefined) {
        for (let y = 0; y < City.blocks.west.tiles.length; y++) {
            for (let x = 0; x < City.blocks.west.tiles[0].length; x++) {
                City.blocks.west.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.south !== undefined) {
        for (let y = 0; y < City.blocks.south.tiles.length; y++) {
            for (let x = 0; x < City.blocks.south.tiles[0].length; x++) {
                City.blocks.south.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.north !== undefined) {
        for (let y = 0; y < City.blocks.north.tiles.length; y++) {
            for (let x = 0; x < City.blocks.north.tiles[0].length; x++) {
                City.blocks.north.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.northWest !== undefined) {
        for (let y = 0; y < City.blocks.northWest.tiles.length; y++) {
            for (let x = 0; x < City.blocks.northWest.tiles[0].length; x++) {
                City.blocks.northWest.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.northEast !== undefined) {
        for (let y = 0; y < City.blocks.northEast.tiles.length; y++) {
            for (let x = 0; x < City.blocks.northEast.tiles[0].length; x++) {
                City.blocks.northEast.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.southWest !== undefined) {
        for (let y = 0; y < City.blocks.southWest.tiles.length; y++) {
            for (let x = 0; x < City.blocks.southWest.tiles[0].length; x++) {
                City.blocks.southWest.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.southEast !== undefined) {
        for (let y = 0; y < City.blocks.southEast.tiles.length; y++) {
            for (let x = 0; x < City.blocks.southEast.tiles[0].length; x++) {
                City.blocks.southEast.tiles[y][x].draw(ctx);
            }
        }
    }


    if (selectedCharacter instanceof Character && selectedCharacter.path.length > 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        ctx.moveTo(selectedCharacter.path[0].x+City.transX, selectedCharacter.path[0].y+City.transY);
        for (var i=1; i < selectedCharacter.path.length;i++) {
            ctx.lineTo(selectedCharacter.path[i].x+City.transX, selectedCharacter.path[i].y+City.transY);
        }

        ctx.stroke();
    }
    let j;
    // Let's do some character based stuff here
    for (i=0; i< characters.length; i++) {
        characters[i].draw(ctx);
        // Is the character an enemy?
        if (characters[i].type === Character.TYPE_ENEMY) {
            // Let's loop through other characters
            for (j=0; j< characters.length; j++) {
                // Are there any player characters in the enemy's FOV?
                if (
                    characters[j].type === Character.TYPE_PLAYER &&
                    characters[j].distance(characters[i].x, characters[i].y) < 50 &&
                    characters[i].fov.pointInPolygon(characters[j]) &&
                    characters[i].action === Character.ACTION_IDLE
                ) {
                    // Set the player character as the enemy's target
                    characters[i].target = characters[j];
                }
            }
        }
    }

    requestAnimationFrame(redraw);
}

