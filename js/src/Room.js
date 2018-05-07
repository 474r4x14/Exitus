
export default class Room
{
    constructor(x,y,width,height)
    {
        this.left = x;
        this.top = y;
        this.width = width;
        this.height = height;
        this.right = x+width;
        this.bottom = y+height;
    }

    hasBlock(point)
    {
        return point.x >= this.left && point.x < this.right && point.y >= this.top && point.y < this.bottom;
    }
}