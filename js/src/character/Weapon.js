import Bullet from './Bullet';
import Character from "./Character";
import City from "../City";
export default class Weapon{
    constructor(owner){
        this.rateOfFire = 1000;
        this.damage = 20;
        this.range = 150;
        this.attackInterval;
        this.isAttacking = false;
        this.accuracy = 100;
        this.owner = owner;
    }

    attack(){
        if (this.owner !== undefined && this.owner.target instanceof Character) {
            var dx = this.owner.target.x - this.owner.x;
            var dy = this.owner.target.y - this.owner.y;
            var bullet = Bullet.findFreeBullet();
            bullet.state = Bullet.STATE_ACTIVE;
            bullet.x = this.owner.x+City.transX;
            bullet.y = this.owner.y+City.transY;
            var radians = Math.atan2(dy, dx);
            bullet.rotation = radians * 180 / Math.PI;
        } else {
            this.stopAttack();
        }
    };

    startAttack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.attack();
            this.attackInterval = setInterval(() => this.attack(), this.rateOfFire);
        }
    };

    stopAttack() {
        if (this.isAttacking) {
            this.isAttacking = false;
            clearInterval(this.attackInterval);
        }
    }
};