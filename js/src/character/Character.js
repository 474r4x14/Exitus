import RotationObject from '../utils/RotationObject';
import Point from "../utils/Point";
import City from "../City";
import PolyItem from "../poly/PolyItem";
import Tile from "../Tile";
import PolyRayItem from "../poly/PolyRayItem";
import Weapon from "./Weapon";
export default class Character extends RotationObject
{
    constructor(x,y,type){
        super(x,y);
        this.lookingRotation = 0;
        this.path = [];
        this.speed = 1;
        if (type === Character.TYPE_ENEMY) {
            this.speed = .25;
        }
        this.target = null;
        this.targetLastLocation = new Point();
        this.type = type;
        this.active = false;
        this.weapon = new Weapon(this);

        this.fov = new PolyRayItem();
        let pos = new Point(this.x+City.transX,this.y+City.transY);
        let vx, vy;
        vx = Math.cos((this.lookingRotation-20)*Math.PI/180)*(50);
        vy = Math.sin((this.lookingRotation-20)*Math.PI/180)*(50);
        this.fov.addNode(pos.x,pos.y);
        this.fov.addNode(pos.x+vx,pos.y+vy);
        vx = Math.cos((this.lookingRotation+20)*Math.PI/180)*(50);
        vy = Math.sin((this.lookingRotation+20)*Math.PI/180)*(50);
        this.fov.addNode(pos.x+vx,pos.y+vy);
        this.action = Character.ACTION_IDLE;
        if (this.type === Character.TYPE_ENEMY) {
            this.enemyIdleDestination();
        }
        this.isTarget = false;

        this.fovTile = this.worldTilePos;

        this.fovPolys = [];
    };


    enemyIdleDestination()
    {
        let randTile = City.randomTile();
        let pathNodes = City.polyPath.clickCheck(this.x, this.y, (randTile.x*Tile.SIZE) + (Tile.SIZE/2) - City.transX, (randTile.y*Tile.SIZE) + (Tile.SIZE/2) - City.transY);
        if (pathNodes) {
            this.path = [];
            for (var x = 0; x < pathNodes.length; x++) {
                this.path.push(pathNodes[x].centre);
            }
        }
    }

    chase()
    {
        // If line of sight, just move towards target else use path finding
        if (this.target instanceof Character) {
            // Can we see the target?
            if (this.fov.pointInPolygon(this.target)) {
                this.targetLastLocation.x = this.target.x;
                this.targetLastLocation.y = this.target.y;
                this.path.length = 0;
                var dx = this.target.x - this.x;
                var dy = this.target.y - this.y;
                var radians = Math.atan2(dy, dx);
                this.rotation = radians * 180 / Math.PI;
                this.lookingRotation = this.rotation;
                this.move();
            } else {
                // can't see the target, let's go to their last known location
                this.action = Character.ACTION_IDLE;
                let pathNodes = City.polyPath.clickCheck(this.x, this.y, this.targetLastLocation.x, this.targetLastLocation.y);
                if (pathNodes) {
                    this.path = [];
                    for (var x = 0; x < pathNodes.length; x++) {
                        this.path.push(pathNodes[x].centre);
                    }
                }
            }
        }
    }

    frame()
    {
        if (this.target instanceof Character) {
            if (
                this.type === Character.TYPE_PLAYER &&
                this.target instanceof Character &&
                this.distance(this.target.x,this.target.y) < this.weapon.range &&
                !this.weapon.isAttacking
            ) {
                this.weapon.startAttack(this);
            }
        } else if(this.weapon.isAttacking) {
            this.weapon.stopAttack();
        }
    }

    draw(context)
    {
        if (this.path.length > 0) {
            var pathZero = this.path[0];

            var dx = pathZero.x - this.x;
            var dy = pathZero.y - this.y;
            var radians = Math.atan2(dy, dx);
            this.rotation = radians * 180 / Math.PI;

            if (this.type === Character.TYPE_ENEMY && this.action === Character.ACTION_IDLE) {
                this.lookingRotation = this.rotation;
            }

            this.move();

            dx = pathZero.x - this.x;
            dy = pathZero.y - this.y;
            var dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 2) {
                this.path.shift();
            }
        } else if (this.type === Character.TYPE_ENEMY && this.action === Character.ACTION_IDLE) {
            this.enemyIdleDestination();
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
            if (this.isTarget) {
                context.strokeStyle = '#FFFFFF';
            } else if (this.active) {
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

        this.updateFOV();
        this.fov.draw(context,{r:255,g:0,b:0});
    }

    updateFOV()
    {
        let pos,vx,vy, poly;
        pos = new Point(this.x,this.y);
        // build a poly cone to reduce the polys used in the real FOV
        poly = new PolyItem();
        poly.addNode(pos.x,pos.y);
        vx = Math.cos((this.lookingRotation-20)*Math.PI/180)*(200);
        vy = Math.sin((this.lookingRotation-20)*Math.PI/180)*(200);
        poly.addNode(pos.x+vx, pos.y+vy);
        vx = Math.cos((this.lookingRotation+20)*Math.PI/180)*(200);
        vy = Math.sin((this.lookingRotation+20)*Math.PI/180)*(200);
        poly.addNode(pos.x+vx, pos.y+vy);
        poly.process();
        vx = Math.cos((this.lookingRotation)*Math.PI/180)*(50);
        vy = Math.sin((this.lookingRotation)*Math.PI/180)*(50);
        poly.addNode(pos.x+vx, pos.y+vy);

        // The non-blocking polys
        let y,x,z;


        this.fovPolys = [];
        for (y = this.worldTilePos.y - 5; y <= this.worldTilePos.y + 5; y++) {
            for (x = this.worldTilePos.x - 5; x <= this.worldTilePos.x + 5; x++) {
                if (City.worldTiles[y][x].polys.length > 0) {
                    for (z = 0; z < City.worldTiles[y][x].polys.length; z++) {
                        if (City.worldTiles[y][x].polys[z].intersects(poly)) {
                            this.fovPolys.push(City.worldTiles[y][x].polys[z]);
                        }
                    }
                }
            }
        }

        this.fov._nodes = [];
        this.fov.addNode(pos.x,pos.y);
        for (let i = -20; i <= 20; i+=5) {
            vx = Math.cos((this.lookingRotation+i)*Math.PI/180)*(200);
            vy = Math.sin((this.lookingRotation+i)*Math.PI/180)*(200);
            this.fov.addRay(pos.x,pos.y,pos.x+vx, pos.y+vy, this.fovPolys);
        }
    }

    lookAt(location)
    {
        var dx = location.x - this.x-City.transX;
        var dy = location.y - this.y-City.transY;
        var radians = Math.atan2(dy, dx);
        this.lookingRotation = radians * 180 / Math.PI;
    }

    get worldTilePos()
    {
        return new Point(Math.floor(this.x/Tile.SIZE),Math.floor(this.y/Tile.SIZE));
    }
};
Character.TYPE_PLAYER = 1;
Character.TYPE_ENEMY = 2;
Character.ACTION_IDLE = 0;
Character.ACTION_CHASING = 1;
