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
		//console.log('addPoly');
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
					//console.log('found a duped PolyEdge ['+nodes[i]._startX+','+nodes[i]._startY+'] -> ['+nodes[i]._endX+','+nodes[i]._endY+']');
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



	solve( startingNode, finishNode, debugTrace) //( startingNode:PolyEdge, finishNode:PolyEdge , debugTrace:Boolean = true)
	{
		if (typeof debugTrace != 'boolean') {
			debugTrace = true;
		}
		// http://web.mit.edu/eranki/www/tutorials/search/

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

		if( debugTrace ) console.log("Solve begin", "tStartingNode:", 1, startingNode);

		// while the open list is not empty
		while ( open.length > 0 )
		{
			if( debugTrace ) console.log("While", "open list is not empty", 2, open);

			// find the node with the least f on the open list, call it "q"
			//var q:PolyEdge = null; var index:int = 0;
			var q = null; var index = 0;
			for (var i = 0; i < open.length; ++i)
			{
				//graphics.moveTo(
				if ( q == null ) q = open[i];
				else { if ( q.f > open[i].f )
				{
					q = open[i];
					index = i;
				} }
			}

			if( debugTrace ) console.log("Node search", "found node 'q["+q.toString()+"]' with the least f on the open list", 2, q);

			if( debugTrace ) console.log("Pop 'q["+q.toString()+"]' off the open list nad add to the closed list");

			// Pop q from the open list and add to the closed list
			closed.push( open.splice(index, 1)[0] );

			if( debugTrace ) console.log("Trace", "Lists", 2, open, closed);

			var successor; // PolyEdge

			if( debugTrace ) console.log("loop begin - generate q["+q.toString()+"]'s successors and set their parents to q["+q.toString()+"]");

			//generate q's successors and set their parents to q
			for ( i = 0; i < q._siblings.length; ++i)
			{
				successor = q._siblings[ i ];

				if( debugTrace ) console.log("Read", "successor", 3, successor);

				var successorClosedIndex = closed.indexOf( successor );
				var successorOpenIndex = open.indexOf( successor );

				// Edit : Check if it's in the closed list, if so skip this successor
				if ( successorClosedIndex >= 0 || successorOpenIndex >= 0)
				{
					if( debugTrace ) console.log("successor was found in the closed list or in the open list, continue loop");
					continue;
				}


				if( debugTrace ) console.log("successor wasn't found in the closed list");

				successor.parentNode = q;

				if( debugTrace ) console.log("successor[" + successor.toString() + "] parent was set to q[" + q.toString() + "]");

				// if successor is the goal, stop the search
				if ( successor == finishNode )
				{
					if( debugTrace ) console.log("successor is the finish node, stop search, return successor");

					return successor;
				}

				if( debugTrace ) console.log("Trace successor", "before change", 3, successor);

				// G - distance of the current node to the starting node

				// successor.g = q.g + distance between successor and q
				successor.g = q.g + q.dist( successor );

				// H - linear distance to the goal ( approximation )

				//  successor.h = distance from goal to successor
				successor.h = this.nodeFinish.dist( successor );

				// F - force ( sum of h and g )

				successor.f = successor.g + successor.h;

				if( debugTrace ) console.log("Trace successor", "after change", 3, successor);

				// if a node with the same position as successor is in the OPEN
				// list which has a lower f than successor, skip this successor

				// ...

				// if a node with the same position as successor is in the CLOSED
				// list which has a lower f than successor, skip this successor

				// ...

				// otherwise, add the node to the open list
				open.push( successor );
			}
		}

		if( debugTrace ) console.log("Solve end", "[ no path was found]", 1, open, closed);

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
				this.polyStart == null &&
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
				this.polyFinish == null &&
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

		if (this.polyStart == null) {
			console.log('polyStart is null?');
		}


		//TODO need to add a failsafe incase a start / end poly check fails
		if (this.polyStart == this.polyFinish) {
			this.nodeFinish.node(this.nodeStart);
		}

		// A Star algorithm
		var c = this.solve( this.nodeStart, this.nodeFinish, false);

		//t = getTimer() - t;

		if ( c == null ) console.log("\nFailed. no path was found, try again");

		else {
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
					c._polys.length == 1
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
