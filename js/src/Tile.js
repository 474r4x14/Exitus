import City from './City';
import Spriteset from './Spriteset';
import Point from "./utils/Point";
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

        /** {Object<Tile>} */
        this.neighbours = {
            north:undefined,
            south:undefined,
            east:undefined,
            west:undefined
        }
        this.roadId = 0;
        this.roadProcessed = false;
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
        if (this.neighbours.north !== undefined && this.neighbours.north.type === Tile.TYPE_ROAD) {
            this.roadId += 1;
        }
        if (this.neighbours.east !== undefined && this.neighbours.east.type === Tile.TYPE_ROAD) {
            this.roadId += 2;
        }
        if (this.neighbours.south !== undefined && this.neighbours.south.type === Tile.TYPE_ROAD) {
            this.roadId += 4;
        }
        if (this.neighbours.west !== undefined && this.neighbours.west.type === Tile.TYPE_ROAD) {
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



    // Follows a straight section of road
    followRoad(fromTile=null)
    {
        let returnPoint = new Point(this.x,this.y);
        if (this.roadProcessed) {
            return returnPoint;
        }
        this.roadProcessed = true;
        if (
            (
                fromTile === null ||
                (
                    this.neighbours.north !== undefined &&
                    this.neighbours.north === fromTile
                )
            ) &&
            (
                this.neighbours.south !== undefined &&
                (
                    this.neighbours.south.roadId === 5 ||
                    this.neighbours.south.roadId === 4
                ) &&
                !this.neighbours.south.roadProcessed
            )
        ) {
            // moving south
            return this.neighbours.south.followRoad(this);
        } else if (
            (
                fromTile === null ||
                (
                    this.neighbours.south !== undefined &&
                    this.neighbours.south === fromTile
                )
            ) &&
            (
                this.neighbours.north !== undefined &&
                (
                    this.neighbours.north.roadId === 5 ||
                    this.neighbours.north.roadId === 1
                ) &&
                !this.neighbours.north.roadProcessed
            )
        ) {
            // moving north
            return this.neighbours.north.followRoad(this);
        } else if (
            (
                fromTile === null ||
                (
                    this.neighbours.west !== undefined &&
                    this.neighbours.west === fromTile
                )
            ) &&
            (
                this.neighbours.east !== undefined &&
                (
                    this.neighbours.east.roadId === 10 ||
                    this.neighbours.east.roadId === 2
                ) &&
                !this.neighbours.east.roadProcessed
            )
        ) {
            // moving east
            return this.neighbours.east.followRoad(this);
        } else if (
            (
                fromTile === null ||
                (
                    this.neighbours.east !== undefined &&
                    this.neighbours.east === fromTile
                )
            ) &&
            (
                this.neighbours.west !== undefined &&
                (
                    this.neighbours.west.roadId === 10 ||
                    this.neighbours.west.roadId === 8
                ) &&
                !this.neighbours.west.roadProcessed
            )
        ) {
            // moving west
            return this.neighbours.west.followRoad(this);
        }
        return returnPoint;
    }
};
Tile.TYPE_EMPTY = 0;
Tile.TYPE_BUILDING = 1;
Tile.TYPE_ROAD = 2;
Tile.SIZE = 64;