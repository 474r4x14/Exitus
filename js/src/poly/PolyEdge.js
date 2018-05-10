import Point from '../utils/Point';
export default class PolyEdge
{
	constructor(startX, startY, endX, endY) {
		this._startX = startX;
		this._startY = startY;
		this._endX = endX;
		this._endY = endY;

        this._siblings = [];   // PolyEdge array
        this._polys = []; // PolyItem array
    }

	addPoly(poly)
	{
		this._polys.push(poly);
	};



	node( c ) // c:PolyEdge
	{
		var double = false;

		for (var i = 0; i < this._siblings.length; ++i) {
			if (this._siblings[i] == c) {
				double = true;
			}
		}
		if (!double) {
			this._siblings.push(c);
			c.node(this);
		}
	};


	get centre()
	{
		var point = new Point();
		if (this._startX < this._endX) {
			point.x = ((this._endX-this._startX)/2)+this._startX;
		}else {
			point.x = ((this._startX-this._endX)/2)+this._endX;
		}
		if (this._startY < this._endY) {
			point.y = ((this._endY-this._startY)/2)+this._startY;
		}else {
			point.y = ((this._startY-this._endY)/2)+this._endY;
		}
		return point;
	};

	dist( c ) // c:PolyEdge
	{
		var dx = c.centre.x - this.centre.x;
		var dy = c.centre.y - this.centre.y;
		return Math.sqrt(dx*dx + dy*dy);
	};
};

