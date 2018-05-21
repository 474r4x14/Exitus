import City from "./City";
import Tile from "./Tile";
import PolyItem from "./poly/PolyItem";
import Point from "./utils/Point";
import Room from "./Room";

export default class Building{
    constructor(x, y, width, height, worldLoc)
    {
        this.left = x;
        this.top = y;
        this.width = width;
        this.height = height;
        this.right = x+width;
        this.bottom = y+height;
        this.worldLoc = worldLoc;
        this.rooms = [];

        this.poly = new PolyItem();
        this.roomPolys = [];

        let topLeft = new Point();
        topLeft.x = (this.left*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);
        topLeft.y = (this.top*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);
        let bottomRight = new Point();
        bottomRight.x = ((this.right+this.width+1)*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);
        bottomRight.y = ((this.bottom+this.height+1)*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);

        this.poly.addNode(topLeft.x, topLeft.y);
        this.poly.addNode(bottomRight.x, topLeft.y);
        this.poly.addNode(bottomRight.x, bottomRight.y);
        this.poly.addNode(topLeft.x, bottomRight.y);
        City.polyPath.addPoly(this.poly);
        this.poly.process();
        this.buildRooms();
    }

    buildRooms()
    {
        for (let y = this.top; y <= this.bottom; y++) {
            for (let x = this.left; x <= this.right; x++) {
                var width = (Math.floor(Math.random() * (this.width - (x-this.left)))) + 1;
                var height = (Math.floor(Math.random() * (this.height - (y-this.top)))) + 1;
                // We've got the staring x/y & width/height, let's go through each room block to make sure it's available
                let roomCheck = new Point(x, y);
                if (!this.roomTaken(roomCheck)) {
                    let xChecked = false;

                    for (roomCheck.y = y; roomCheck.y < y + height; roomCheck.y++) {
                        for (roomCheck.x = x; roomCheck.x < x + width; roomCheck.x++) {
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

                    var room = new Room(x, y, width, height);
                    this.rooms.push(room);
                }
            }
        }
        this.poly._nodes = [];
        let doors = [];
        for (let i = 0; i < this.rooms.length; i++) {
            let top = (this.rooms[i].top*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);
            let left = (this.rooms[i].left*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);
            let bottom = (this.rooms[i].bottom*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);
            let right = (this.rooms[i].right*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);
            let topPad = top+8;
            let leftPad = left+8;
            let bottomPad = bottom-8;
            let rightPad = right-8;

            // Let's move the outer walls in a bit for walls
            top += 8;
            left += 8;
            if (this.rooms[i].top === this.top) {
                if (Math.floor(Math.random()*5) === 0) {
                    this.rooms[i].doors.north = true;
                }
            }
            if (this.rooms[i].bottom-1 === this.bottom) {
                bottom -= 8;
                if (Math.floor(Math.random()*5) === 0) {
                    this.rooms[i].doors.south = true;
                }
            }
            if (this.rooms[i].left === this.left) {
                if (Math.floor(Math.random()*5) === 0) {
                    this.rooms[i].doors.west = true;
                }
            }
            if (this.rooms[i].right-1 === this.right) {
                right -= 8;

                if (Math.floor(Math.random()*5) === 0) {
                    this.rooms[i].doors.east = true;
                }
            }

            // Create internal doors
            if (this.rooms[i].bottom-1 !== this.bottom) {
                this.rooms[i].doors.north = true;
            }
            if (this.rooms[i].right-1 !== this.right) {
                this.rooms[i].doors.west = true;
            }

            let doorPoly;

            // Let's add the doors
            if (this.rooms[i].doors.north) {
                doorPoly = new PolyItem();
                doorPoly.addNode(leftPad, topPad-8);
                doorPoly.addNode(leftPad+8, topPad-8);
                doorPoly.addNode(leftPad+8, topPad);
                doorPoly.addNode(leftPad, topPad);
                City.polyPath.addPoly(doorPoly);
                doorPoly.process();
                this.roomPolys.push(doorPoly);
                doors.push(doorPoly);
            }

            if (this.rooms[i].doors.east) {
                doorPoly = new PolyItem();
                doorPoly.addNode(rightPad, topPad);
                doorPoly.addNode(rightPad+8, topPad);
                doorPoly.addNode(rightPad+8, topPad+8);
                doorPoly.addNode(rightPad, topPad+8);
                City.polyPath.addPoly(doorPoly);
                doorPoly.process();
                this.roomPolys.push(doorPoly);
                doors.push(doorPoly);
            }

            if (this.rooms[i].doors.south) {
                doorPoly = new PolyItem();
                doorPoly.addNode(leftPad, bottomPad);
                doorPoly.addNode(leftPad+8, bottomPad);
                doorPoly.addNode(leftPad+8, bottomPad+8);
                doorPoly.addNode(leftPad, bottomPad+8);
                City.polyPath.addPoly(doorPoly);
                doorPoly.process();
                this.roomPolys.push(doorPoly);
                doors.push(doorPoly);
            }

            if (this.rooms[i].doors.west) {
                doorPoly = new PolyItem();
                doorPoly.addNode(leftPad, topPad);
                doorPoly.addNode(leftPad-8, topPad);
                doorPoly.addNode(leftPad-8, topPad+8);
                doorPoly.addNode(leftPad, topPad+8);
                City.polyPath.addPoly(doorPoly);
                doorPoly.process();
                this.roomPolys.push(doorPoly);
                doors.push(doorPoly);
            }
        }

        // loop through again to get the door nodes
        let poly;
        for (let i = 0; i < this.rooms.length; i++) {
            
            let top = (this.rooms[i].top*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);
            let left = (this.rooms[i].left*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);
            let bottom = (this.rooms[i].bottom*Tile.SIZE) + (this.worldLoc.y * City.height * Tile.SIZE);
            let right = (this.rooms[i].right*Tile.SIZE) + (this.worldLoc.x * City.width * Tile.SIZE);

            // Let's move the outer walls in a bit for walls
            top += 8;
            left += 8;
            if (this.rooms[i].bottom-1 === this.bottom) {
                bottom -= 8;
            }
            if (this.rooms[i].right-1 === this.right) {
                right -= 8;
            }

            poly = new PolyItem();
            let e;
            let f;
            // Top Left corner
            poly.addNode(left, top);

            // Check the internal doors between top left & top right
            let doorNodes = [];
            for (e = 0; e < doors.length; e++) {
                for (f = 0; f < doors[e]._nodes.length; f++) {
                    let node = doors[e]._nodes[f];
                    if (node.y === top && node.x > left && node.x < right) {
                        doorNodes.push(node);

                    }
                }
            }
            if (doorNodes.length > 0) {
                doorNodes.sort(function (a, b) {
                    return a.x - b.x;
                });
                for (e = 0; e < doorNodes.length; e++) {
                    poly.addNode(doorNodes[e].x, doorNodes[e].y);
                }
            }

            // Top Right corner
            poly.addNode(right, top);

            // Check the internal doors between top right & bottom right
            doorNodes = [];
            for (e = 0; e < doors.length; e++) {
                for (f = 0; f < doors[e]._nodes.length; f++) {
                    let node = doors[e]._nodes[f];
                    if (node.x === right && node.y > top && node.y < bottom) {
                        doorNodes.push(node);
                    }
                }
            }
            if (doorNodes.length > 0) {
                doorNodes.sort(function (a, b) {
                    return a.y - b.y;
                });
                for (e = 0; e < doorNodes.length; e++) {
                    poly.addNode(doorNodes[e].x, doorNodes[e].y);
                }
            }

            // Bottom Right corner
            poly.addNode(right, bottom);

            // Check the internal doors between bottom right and bottom left
            doorNodes = [];
            for (e = 0; e < doors.length; e++) {
                for (f = 0; f < doors[e]._nodes.length; f++) {
                    let node = doors[e]._nodes[f];
                    if (node.y === bottom && node.x > left && node.x < right) {
                        doorNodes.push(node);
                    }
                }
            }
            if (doorNodes.length > 0) {
                doorNodes.sort(function (b, a) {
                    return a.x - b.x;
                });
                for (e = 0; e < doorNodes.length; e++) {
                    poly.addNode(doorNodes[e].x, doorNodes[e].y);
                }
            }

            // Bottom Left corner
            poly.addNode(left, bottom);

            // Check the internal doors between bottom left and top left
            doorNodes = [];
            for (e = 0; e < doors.length; e++) {
                for (f = 0; f < doors[e]._nodes.length; f++) {
                    let node = doors[e]._nodes[f];
                    if (node.x === left && node.y > top && node.y < bottom) {
                        doorNodes.push(node);
                    }
                }
            }
            if (doorNodes.length > 0) {
                doorNodes.sort(function (b, a) {
                    return a.y - b.y;
                });
                for (e = 0; e < doorNodes.length; e++) {
                    poly.addNode(doorNodes[e].x, doorNodes[e].y);
                }
            }

            City.polyPath.addPoly(poly);
            poly.process();
            this.roomPolys.push(poly);

        }
        Building.doRooms = false;
    }

    roomTaken(checkPoint)
    {
        if (this.rooms.length) {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].hasBlock(checkPoint)) {
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
                this.roomPolys[i].draw(context, {r: 0, g: 0, b: 255});
            }
        } else {
            this.poly.draw(context, {r: 255, g: 0, b: 0});
        }
    }
}
Building.doRooms = true;