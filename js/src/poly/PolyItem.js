import PolyNode from './PolyNode';
import PolyEdge from './PolyEdge';
import Point from '../utils/Point';
import City from "../City";
export default class PolyItem{
	constructor() {
        this._nodes = [];
        this.edges = [];
        this.drawn = false;
    }

	/**
	 * Add a node, nodes are the room corners, edges are generated from them.
	 * @param x int
	 * @param y int
	 * @returns {PolyNode}
     */
	//
	addNode(x,y)
	{
		var node = new PolyNode();
		node.x = x;
		node.y = y;
		this._nodes.push(node);
		return node;
	};


	/**
	 * populated the edges array and draws to the canvas
	 */
	process() {

		// Add the first nade as the last to complete the polygon
		var endNode = new PolyNode();
		endNode.x = this._nodes[0].x;
		endNode.y = this._nodes[0].y;
		this._nodes.push(endNode);
		for (var i=1; i < this._nodes.length;i++) {
			var node = new PolyEdge(this._nodes[i-1].x,this._nodes[i-1].y,this._nodes[i].x,this._nodes[i].y);
			this.edges.push(node);
		}
	};

	draw(context, color = null)
	{
        if (context !== undefined && this._nodes.length > 0) {
        	if (color === null) {
                context.strokeStyle = '#00ff00';
            } else {
                context.strokeStyle = 'rgb('+color.r+','+color.g+','+color.b+')';
			}
            context.lineWidth = 2;
            if (color === null) {
                context.fillStyle = "rgba(0, 255, 0, 0.3)";
            } else {
                context.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+',0.3)';
			}
            context.beginPath();
            context.moveTo(this._nodes[0].x+City.transX, this._nodes[0].y+City.transY);
            for (var i=1; i < this._nodes.length;i++) {
				context.lineTo(this._nodes[i].x+City.transX, this._nodes[i].y+City.transY);
            }
            context.closePath();
            context.stroke();
            context.fill();
            this.drawn = true;
        }
	}


	pointInPolygon(p) // p:Point
	{
		//Loop through vertices, check if point is left of each line.
		//If it is, check if it line intersects with horizontal ray from point p
		var n = this._nodes.length;
		var j;
		var v1, v2; // Points
		var count = 0;
		for (var i = 0; i < n; i++)
		{
			j = i + 1 == n ? 0: i + 1;
			v1 = new Point( this._nodes[i].x,this._nodes[i].y);
			v2 = new Point( this._nodes[j].x,this._nodes[j].y);
			//does point lay to the left of the line?
			if (this.isLeft(p,v1,v2))
			{
				if ((p.y > v1.y && p.y <= v2.y) || (p.y > v2.y && p.y <= v1.y))
				{
					count++;
				}
			}
		}
		return (count % 2 != 0);
	};


	// Used by PointInPolygon
	isLeft(p, v1, v2) // all Points
	{
		if (v1.x == v2.x){
			return (p.x <= v1.x);
		}else{
			var m = (v2.y - v1.y) / (v2.x - v1.x);
			var x2 = (p.y - v1.y) / m + v1.x;
			return (p.x <= x2);
		}
	}

	intersects(poly)
	{
		let i;
		for (i = 0; i < this._nodes.length; i++) {
			if (poly.pointInPolygon(this._nodes[i])) {
				return true;
			}
		}
		for (i = 0; i < poly._nodes.length; i++) {
			if (this.pointInPolygon(poly._nodes[i])) {
				return true;
			}
		}
	}
};
