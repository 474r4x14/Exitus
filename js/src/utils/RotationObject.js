import Point from './Point';
export default class RotationObject extends Point{
constructor(x,y){
super(x,y);
    this.rotation = 0;
    this.speed = 0;
    
}
    move(){
        var vx = Math.cos(this.rotation*Math.PI/180)*(this.speed);
        var vy = Math.sin(this.rotation*Math.PI/180)*(this.speed);
        this.x += vx;
        this.y += vy;
        return {x:vx,y:vy};
    }
};