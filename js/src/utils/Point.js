export default class Point
{
    constructor(x = 0,y = 0)
    {
        this.x = x;
        this.y = y;
    }

    distance(x,y)
    {
        let dx = x - this.x;
        let dy = y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
}

