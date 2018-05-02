export default class Spriteset {
    constructor(callback) {
        Spriteset.img = new Image;
        Spriteset.img.onload = function () {
            callback();
        };
        Spriteset.img.src = './images/spriteset.png';
    }
}
Spriteset.img = null;
