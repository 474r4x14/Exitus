import PolyItem from "./poly/PolyItem";
import City from "./City";
import Tile from "./Tile";

export default class Road{
    constructor(start, end, entrances, worldLoc)
    {
        this.start = start;
        this.end = end;
        this.worldLoc = worldLoc;
        this.poly = new PolyItem();

        let left = (this.start.x*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let top = (this.start.y*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);
        let right = ((this.end.x+1)*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let bottom = ((this.end.y+1)*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);


        // let's sort the entrances into the correct order
        let doors = {north:[],south:[],east:[],west:[]};
        let i;
        for (i = 0; i < entrances.length; i++) {
            let entrance = entrances[i];
            if (entrance.side === City.SIDE_NORTH) {
                doors.north.push(entrance);
            }
            if (entrance.side === City.SIDE_SOUTH) {
                doors.south.push(entrance);
            }
            if (entrance.side === City.SIDE_EAST) {
                doors.east.push(entrance);
            }
            if (entrance.side === City.SIDE_WEST) {
                doors.west.push(entrance);
            }
        }
        doors.north.sort(function (a, b) {
            return a.x - b.x;
        });
        doors.south.sort(function (b, a) {
            return a.x - b.x;
        });
        doors.east.sort(function (a, b) {
            return a.y - b.y;
        });
        doors.west.sort(function (b, a) {
            return a.y - b.y;
        });

        this.poly.addNode(left, top);

        for (i = 0; i < doors.north.length; i++) {
            // console.log('doing a north foor');
            this.poly.addNode((doors.north[i].x*Tile.SIZE)+City.transX+8, top);
            this.poly.addNode((doors.north[i].x*Tile.SIZE)+8+City.transX+8, top);
        }

        this.poly.addNode(right, top);

        for (i = 0; i < doors.east.length; i++) {
            this.poly.addNode(right, (doors.east[i].y*Tile.SIZE)+City.transY+8);
            this.poly.addNode(right, (doors.east[i].y*Tile.SIZE)+8+City.transY+8);
        }

        this.poly.addNode(right, bottom);

        for (i = 0; i < doors.south.length; i++) {
            this.poly.addNode((doors.south[i].x*Tile.SIZE)+8+City.transX+8, bottom);
            this.poly.addNode((doors.south[i].x*Tile.SIZE)+City.transX+8, bottom);
        }




        this.poly.addNode(left, bottom);
        for (i = 0; i < doors.west.length; i++) {
            this.poly.addNode(left, (doors.west[i].y*Tile.SIZE)+8+City.transY+8);
            this.poly.addNode(left, (doors.west[i].y*Tile.SIZE)+City.transY+8);
        }
        City.polyPath.addPoly(this.poly);
        this.poly.process();
    }

    draw(context)
    {
        this.poly.draw(context);
    }
}