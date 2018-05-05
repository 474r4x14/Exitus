import PolyItem from "./poly/PolyItem";
import City from "./City";
import Tile from "./Tile";

export default class Road{
    constructor(start, end, worldLoc)
    {
        this.start = start;
        this.end = end;
        this.worldLoc = worldLoc;
        this.poly = new PolyItem();

        let left = (this.start.x*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let top = (this.start.y*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);
        let right = ((this.end.x+1)*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let bottom = ((this.end.y+1)*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);

        this.poly.addNode(left, top);
        this.poly.addNode(right, top);
        this.poly.addNode(right, bottom);
        this.poly.addNode(left, bottom);
        City.polyPath.addPoly(this.poly);
        this.poly.process();
    }

    draw(context)
    {
        this.poly.draw(context);
    }
}