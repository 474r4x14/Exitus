import Point from '../utils/Point';
import PolyEdge from './PolyEdge';
import PolyNode from "./PolyNode";

export default class PolyPath{
	constructor() {
        this.polyItems = []; // PolyItem array

        this.nodes = [];	// PolyEdge array

        this.nodeStart = null; // PolyEdge
        this.nodeFinish = null; // PolyEdge

        this.polyStart = null; // PolyItem
        this.polyFinish = null; // PolyItem
    }

    clear()
	{
		//console.log('fn:PolyPath clear()');
		this.polyItems = [];
        this.nodes = [];	// PolyEdge array
	}

	addPoly(poly){ // poly:PolyItem
		poly.process();

		var nodes = poly.edges;	// PolyEdge array

		var i,j;

		for (i = 0; i < nodes.length; i++) {

			var create = true;

			// Loop through the edges to find existing duplicates
			for (j=0; j< this.nodes.length;j++) {
				if (
					(
						nodes[i]._startX === this.nodes[j]._startX &&
						nodes[i]._startY === this.nodes[j]._startY &&
						nodes[i]._endX === this.nodes[j]._endX &&
						nodes[i]._endY === this.nodes[j]._endY
					) ||
					(
						nodes[i]._startX === this.nodes[j]._endX &&
						nodes[i]._startY === this.nodes[j]._endY &&
						nodes[i]._endX === this.nodes[j]._startX &&
						nodes[i]._endY === this.nodes[j]._startY
					)
				) {
					create = false;
					this.nodes[j].addPoly(poly);
					break;
				}
			}
			// It's unique, let's add it
			if (create === true) {
				nodes[i].addPoly(poly);
				this.nodes.push(nodes[i]);
			}
		}
		this.polyItems.push(poly);
	};




	process()
	{
		// Loop through all the PolyEdges
		for (var i = 0; i < this.nodes.length; i++) {
			// Loop through all the PolyItems
			for (var j = 0; j < this.nodes[i]._polys.length; j++) {
				for (var k = 0; k < this.nodes[i]._polys[j].edges.length; k++) {
					this.nodes[i].node(this.nodes[i]._polys[j].edges[k]);
				}
			}
		}
	};



	solve( startingNode, finishNode)
	{
		/*
http://robotics.caltech.edu/wiki/images/e/e0/Astar.pdf
*/

		if (finishNode === undefined) {
			console.log('finish is undefined!');
		}
		//initialize the open list
		var open = [];	// new Vector.<PolyEdge>();
		//initialize the closed list
		var closed = []; // new Vector.<PolyEdge>();
		//put the starting node on the open list (you can leave its f at zero)
		open.push( startingNode );

		startingNode.parentNode = null;
		startingNode.g = 0;
		startingNode.f = 0;
		startingNode.h = finishNode.dist( startingNode );

		// while the open list is not empty
		while ( open.length > 0 )
		{
			// Get node n off the OPEN list with the lowest f(n)
			var l = null; var index = 0;
			for (var i = 0; i < open.length; ++i)
			{
				if (l === null || l.f > open[i].f) {
					l = open[i];
					index = i;
				}
			}

			// Add n to the CLOSED list
			closed.push(open.splice(index, 1)[0]);

			// IF n is the same as node_goal
			if (l === finishNode) {
				// we have found the solution; return Solution(n)
				return l;
			} else {
				// ELSE: Generate each successor node n' of n

                var successor; // PolyEdge

                // for each successor node n' of n
                for (i = 0; i < l._siblings.length; ++i) {
                    successor = l._siblings[i];

                    var closedIndex = closed.indexOf(successor);
                    var openIndex = open.indexOf(successor);

                    // if n' is on the OPEN list and the existing one is as good or better then discard n' and continue
                    // if n' is on the CLOSED list and the existing one is as good or better then discard n' and continue
                    // Remove occurrences of n' from OPEN and CLOSED
                    if (closedIndex >= 0 || openIndex >= 0) {
                        continue;
                    }

                    // Set the parent of n' to n
                    successor.parentNode = l;

                    // Set g(n') to be g(n) plus the cost to get to n' from n
                    successor.g = l.g + l.dist(successor);

                    // Set h(n') to be the heuristically estimate distance to node_goal
                    successor.h = this.nodeFinish.dist(successor);

                    // Set f(n') to be g(n') plus h(n')
                    successor.f = successor.g + successor.h;

                    // Add n' to the OPEN list
                    open.push(successor);
                }
            }
		}
		return null;
	};


	clickCheck(startX,startY, endX,endY) {
		var path = []; // PolyEdge array

		this.polyStart = null;
		this.polyFinish = null;
		this.nodeStart = new PolyNode();
		this.nodeFinish = new PolyNode();

		var j;
		// just loop through and test both start & end point in polys
		for (var i=0; i < this.polyItems.length; i++) {
			if (
				this.polyStart === null &&
				this.polyItems[i].pointInPolygon(new Point(startX,startY))
			) {
				this.polyStart = this.polyItems[i];
				this.nodeStart = new PolyEdge(startX,startY,startX,startY);
				this.nodeStart.addPoly(this.polyStart);
				for (j=0; j<this.polyStart.edges.length;j++ ) {
					this.nodeStart.node(this.polyStart.edges[j]);
				}
			}

			if (
				this.polyFinish === null &&
				this.polyItems[i].pointInPolygon(new Point(endX,endY))
			) {
				this.polyFinish = this.polyItems[i];
				this.nodeFinish = new PolyEdge(endX,endY,endX,endY);
				this.nodeFinish.addPoly(this.polyFinish);
				for (j=0; j<this.polyFinish.edges.length;j++ ) {
					this.nodeFinish.node(this.polyFinish.edges[j]);
				}
			}

		}

		if (this.polyStart === null) {
			console.log('polyStart is null?');
		}


		//TODO need to add a failsafe incase a start / end poly check fails
		if (this.polyStart === this.polyFinish) {
			this.nodeFinish.node(this.nodeStart);
		}

		// A Star algorithm
		var c = this.solve( this.nodeStart, this.nodeFinish, false);


		if ( c === null ) {
			console.log("\nFailed. no path was found, try again");
        } else {
			// reverse path -----


			path.push( c );

			var cpath = c.x+','+c.y + " -> ";

			var skipPrevious = false;
			while ( c.parentNode )
			{
				c = c.parentNode;


				/**
				 * If the previous edge is only sitting on one polygon and it's not the first
				 * or last point of the path, then it can be removed. We do the previous edge
				 * so we don't remove the final destination
				 */
				if (skipPrevious) {
					skipPrevious = false;
					path.pop();
				}
				if (
					path.length != 0 &&
					c._polys.length === 1
				) {
					skipPrevious = true;
				}

				path.push( c );

				//cpath += c.toString();
				cpath += c.x+','+c.y;

				if( c.parentNode )
					cpath += " -> ";
			}
			// reverse path end -----
			c = null;
		}


		return path.reverse();
	}
};
