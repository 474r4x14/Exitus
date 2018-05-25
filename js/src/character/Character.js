import RotationObject from '../utils/RotationObject';
import Weapon from './Weapon';
import Point from "../utils/Point";
import City from "../City";
export default class Character extends RotationObject
{
constructor(x,y,type){
    super(x,y);
        this.lookingRotation = 0;
        this.path = [];
        this.speed = 1;
        this.target = null;
        this.type = type;
        this.active = false;
    };


    draw(context)
    {
        if (this.path.length > 0) {
            var pathZero = this.path[0];

            var dx = pathZero.x - this.x;
            var dy = pathZero.y - this.y;
            var radians = Math.atan2(dy, dx);
            this.rotation = radians * 180 / Math.PI;

            this.move();

            dx = pathZero.x - this.x;
            dy = pathZero.y - this.y;
            var dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 2) {
                this.path.shift();
            }
        }

        let pos = new Point(this.x+City.transX,this.y+City.transY);

        var radius = 8;
        // Character circle
        context.strokeStyle = '#000';
        context.beginPath();
        context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        if (this.type === Character.TYPE_ENEMY) {
            context.strokeStyle = '#ff0000';
        } else {
            if (this.active) {
                context.strokeStyle = '#00ff00';
            } else {
                context.strokeStyle = '#000000';
            }
        }
        context.stroke();
        // Character direction line
        var vx = Math.cos(this.lookingRotation*Math.PI/180)*(10);
        var vy = Math.sin(this.lookingRotation*Math.PI/180)*(10);
        context.moveTo(pos.x,pos.y);
        context.lineTo(pos.x+vx,pos.y+vy);
        context.stroke();
    }

    lookAt(location)
    {
        var dx = location.x - this.x-City.transX;
        var dy = location.y - this.y-City.transY;
        var radians = Math.atan2(dy, dx);
        this.lookingRotation = radians * 180 / Math.PI;
    }
};
Character.TYPE_PLAYER = 1;
Character.TYPE_ENEMY = 2;

