import City from './City.js';
export default class Tile
{
    /**
     *
     * @param x {int}
     * @param y {int}
     * @param type {int}
     * @param loc {Point}
     */
    constructor(x, y, type, loc)
    {
        this.x = x;
        this.y = y;
        this.type = type;
        this.loc = loc;
    }

    draw(context)
    {
        context.fillStyle = "#FF0000";
        if (this.type === Tile.TYPE_BUILDING) {
            context.fillStyle = "#00FF00";
        }
        // console.log(size*x,size*y,(size*x)+size,(size*y)+size);
        context.fillRect((this.loc.x*50*Tile.SIZE)+(Tile.SIZE * this.x) + City.transX, (this.loc.y*50*Tile.SIZE)+(Tile.SIZE * this.y) + City.transY, (Tile.SIZE * this.x) + Tile.SIZE + City.transX, (Tile.SIZE * this.y) + Tile.SIZE + City.transY);

    }
};
Tile.TYPE_EMPTY = 0;
Tile.TYPE_BUILDING = 1;
Tile.TYPE_ROAD = 2;
Tile.SIZE = 5;