import City from "./City";
import Tile from "./Tile";
import PolyItem from "./poly/PolyItem";
import Point from "./utils/Point";
import Room from "./Room";

export default class Building{
    constructor(x, y, width, height, worldLoc, doRooms = false)
    {
        this.left = x;
        this.top = y;
        this.width = width;
        this.height = height;
        this.right = x+width;
        this.bottom = y+height;
        this.worldLoc = worldLoc;
        this.rooms = [];
        // console.log('new buliding, w:'+width+' h:'+height);


        this.poly = new PolyItem();
        this.roomPolys = [];

        let topLeft = new Point();
        topLeft.x = (this.x*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        topLeft.y = (this.y*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);
        let bottomRight = new Point();
        bottomRight.x = ((this.x+this.width+1)*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        bottomRight.y = ((this.y+this.height+1)*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);

        this.poly.addNode(topLeft.x, topLeft.y);
        this.poly.addNode(bottomRight.x, topLeft.y);
        this.poly.addNode(bottomRight.x, bottomRight.y);
        this.poly.addNode(topLeft.x, bottomRight.y);
        City.polyPath.addPoly(this.poly);
        this.poly.process();
        if (doRooms) {
            this.buildRooms();
        }
    }

    buildRooms()
    {

        for (let y = this.top; y <= this.bottom; y++) {
            for (let x = this.left; x <= this.right; x++) {
                console.log('room x:' + x+' y:'+y);
                var width = (Math.floor(Math.random() * (this.width - x))) + 1;
                var height = (Math.floor(Math.random() * (this.height - y))) + 1;
                // We've got the staring x/y & width/height, let's go through each room block to make sure it's available
                let roomCheck = new Point(x, y);
                if (!this.roomTaken(roomCheck)) {
                    let xChecked = false;

                    for (roomCheck.y = y; roomCheck.y < y+height; roomCheck.y++) {
                        for (roomCheck.x = x; roomCheck.x < x+width; roomCheck.x++) {
                            if (this.roomTaken(roomCheck)) {
                                // x is fine, let's reduce Y
                                if (xChecked) {
                                    height = roomCheck.y - y;
                                } else {
                                    // reduce the x
                                    width = roomCheck.x - x;
                                }
                            }
                        }
                        xChecked = true;
                    }


                    console.log('build room left:' + x + ' top:' + y + ' right:' + (x + width) + '[' + this.width + '] bottom:' + (y + height) + '[' + this.height + ']');
                    var room = new Room(x, y, width, height);
                    this.rooms.push(room);
                }
            }
        }
        this.poly._nodes = [];
        let poly;
        for (let i = 0; i < this.rooms.length; i++) {
            console.log('adding ', this.rooms[i]);

            poly = new PolyItem();
            poly.addNode((this.rooms[i].left*Tile.SIZE)+City.transX, (this.rooms[i].top*Tile.SIZE)+City.transY);
            poly.addNode((this.rooms[i].right*Tile.SIZE)+City.transX, (this.rooms[i].top*Tile.SIZE)+City.transY);
            poly.addNode((this.rooms[i].right*Tile.SIZE)+City.transX, (this.rooms[i].bottom*Tile.SIZE)+City.transY);
            poly.addNode((this.rooms[i].left*Tile.SIZE)+City.transX, (this.rooms[i].bottom*Tile.SIZE)+City.transY);
            City.polyPath.addPoly(poly);
            poly.process();
            this.roomPolys.push(poly);

        }
        Building.doRooms = false;
    }

    roomTaken(checkPoint)
    {
        if (this.rooms.length) {
            // console.log('all rooms',this.rooms, checkPoint);
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].hasBlock(checkPoint)) {
                    console.log('roomTaken returning true');
                    return true;
                }
            }
        }
        return false;
    }

    draw(context)
    {
        if (this.roomPolys.length) {
            for (let i =0; i < this.roomPolys.length; i++) {
                //console.log('drawing a room');
                this.roomPolys[i].draw(context, {r: 0, g: 0, b: 255});
            }
        } else {
            this.poly.draw(context, {r: 255, g: 0, b: 0});
        }
    }
}
Building.doRooms = true;