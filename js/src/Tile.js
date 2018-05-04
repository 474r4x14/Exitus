import City from './City';
import Spriteset from './Spriteset';
export default class Tile
{
    /**
     *
     * @param x {int}
     * @param y {int}
     * @param type {int}
     * @param loc {Point}
     */
    constructor(x=0, y=0, type=0, loc=null)
    {
        this.x = x;
        this.y = y;
        this.type = type;
        this.loc = loc;

        this.neighbours = {
            north:null,
            south:null,
            east:null,
            west:null
        }
        this.roadId = 0;
    }

    // These are used to know what the neighbouring tiles are
    set north(tile)
    {
        this.neighbours.north = tile;
        tile.neighbours.south = this;
    }

    set south(tile)
    {
        this.neighbours.south = tile;
        tile.neighbours.north = this;
    }

    set east(tile)
    {
        this.neighbours.east = tile;
        tile.neighbours.west = this;
    }

    set west(tile)
    {
        this.neighbours.west = tile;
        tile.neighbours.east = this;
    }

    setRoadType()
    {
            if (this.neighbours.north !== null && this.neighbours.north.type === Tile.TYPE_ROAD) {
            this.roadId += 1;
            }
            if (this.neighbours.east !== null && this.neighbours.east.type === Tile.TYPE_ROAD) {
            this.roadId += 2;
            }
            if (this.neighbours.south !== null && this.neighbours.south.type === Tile.TYPE_ROAD) {
            this.roadId += 4;
            }
            if (this.neighbours.west !== null && this.neighbours.west.type === Tile.TYPE_ROAD) {
            this.roadId += 8;
            }
    }

    draw(context)
    {
        let spriteSize = 64;
        if (this.type === Tile.TYPE_BUILDING) {
            context.drawImage(Spriteset.img, spriteSize*2,spriteSize,spriteSize,spriteSize, (this.loc.x*50*Tile.SIZE)+(Tile.SIZE * this.x) + City.transX, (this.loc.y*50*Tile.SIZE)+(Tile.SIZE * this.y) + City.transY, Tile.SIZE, Tile.SIZE);
        } else {

            let spriteX = this.roadId%4;
            let spriteY = ((this.roadId-spriteX)/4);
            context.drawImage(Spriteset.img, (spriteX)*spriteSize,(spriteY)*spriteSize,spriteSize,spriteSize, (this.loc.x*50*Tile.SIZE)+(Tile.SIZE * this.x) + City.transX, (this.loc.y*50*Tile.SIZE)+(Tile.SIZE * this.y) + City.transY, Tile.SIZE, Tile.SIZE);
        }
    }
};
Tile.TYPE_EMPTY = 0;
Tile.TYPE_BUILDING = 1;
Tile.TYPE_ROAD = 2;
Tile.SIZE = 64;