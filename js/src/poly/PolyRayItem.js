import PolyItem from "./PolyItem";
import Point from "../utils/Point";
import City from '../City';

export default class PolyRayItem extends PolyItem{
    constructor()
    {
        super();
        // console.log('PolyRay');
    }


    addRay(originX, originY, destX, destY)
    {
        // Get the rotation
        var dx = destX - originX;
        var dy = destY - originY;
        var radians = Math.atan2(dy, dx);
        var rotation = radians * 180 / Math.PI;

        let ray = new Point(originX,originY);
        let working = true;
        let vx, vy, i;
        while (ray.distance(destX,destY) > 6 && working) {
            // Check along rotation path

            vx = Math.cos(rotation*Math.PI/180)*(6);
            vy = Math.sin(rotation*Math.PI/180)*(6);
            // console.log(City.polyPath);
            let hit = false;
            for (i = 0; i < City.polyPath.polyItems.length; i++) {
                if (City.polyPath.polyItems[i].edges[0]._startY+City.transY > 0 &&
                    City.polyPath.polyItems[i].edges[0]._endY+City.transY < 2000 &&
                    City.polyPath.polyItems[i].edges[0]._startX+City.transX > 0 &&
                    City.polyPath.polyItems[i].edges[0]._endX+City.transX < 2000) {
                    if (City.polyPath.polyItems[i].pointInPolygon(new Point(ray.x + vx, ray.y + vy))) {
                        hit = true;
                        continue;
                    }
                }
            }
            if (!hit) {
                working = false;
            }
            ray.x += vx;
            ray.y += vy;
        }
        this.addNode(ray.x, ray.y);
    }
}
