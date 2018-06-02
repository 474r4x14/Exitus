import RotationObject from '../utils/RotationObject';
export default class Bullet extends RotationObject
{
    constructor(x,y) {
        super();
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.rotation = 0;
        this.speed = 5;
        this.distanceTraveled = 0;
        this.state = Bullet.STATE_IDLE;
    }

    draw(context)
    {
        if (this.state === Bullet.STATE_IDLE) {
            return;
        }
        this.move();
        this.distanceTraveled += this.speed;

        if (this.distanceTraveled === 500) {
            this.state = Bullet.STATE_IDLE;
        }

        var radius = 2;
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        context.fillStyle = "#000";
        context.fill();
    };

    reset(x, y)
    {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.distanceTraveled = 0;
    }


    static findFreeBullet()
    {
        for (var i = 0; i < Bullet.bullets.length; i++) {
            if (Bullet.bullets[i].state === Bullet.STATE_IDLE) {

                return Bullet.bullets[i];
            }
        }
        var bullet = new Bullet();
        Bullet.bullets.push(bullet);
        return bullet;
    };


}
Bullet.STATE_IDLE = 0;
Bullet.STATE_ACTIVE = 1;
Bullet.bullets = [];
