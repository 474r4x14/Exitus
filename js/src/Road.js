import PolyItem from "./poly/PolyItem";
import City from "./City";
import Tile from "./Tile";

export default class Road{
    constructor(start, end, worldLoc)
    {
        this.start = start;
        this.end = end;
        this.worldLoc = worldLoc;
    }


    draw(context)
    {
        let poly = new PolyItem();
        let left = (this.start.x*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let top = (this.start.y*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);
        let right = ((this.end.x+1)*Tile.SIZE)+City.transX + (this.worldLoc.x * 50 * Tile.SIZE);
        let bottom = ((this.end.y+1)*Tile.SIZE)+City.transY + (this.worldLoc.y * 50 * Tile.SIZE);

        poly.addNode(left, top);
        poly.addNode(right, top);
        poly.addNode(right, bottom);
        poly.addNode(left, bottom);
        if (!poly.drawn) {
            poly.process(context);
        }
    }


}