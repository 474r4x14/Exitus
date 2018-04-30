import Tile from './Tile.js';
export default class City
{
	constructor()
	{
		// Array of all the tiles
		/** @type {Tile[][]} */
		this.tiles = [];

		// Visual display of the map
		//this.map:Sprite = new Sprite;

		// Width of the map to create
		this.width = 50;
		// Height of the map
		this.height = 50;

		// minimum length of a building
		this.buildingMin = 5;
		// maximum length of a building
		this.buildingMax = 10;

		// Exit points, can be predefined or randomly generated
		this.exitPoints = {
			// 'north':[10,20,30,40],
			'north':[],
			'south':[],
			'east':[],
			'west':[]
		};

		// The current side we're building up
		// Let's start from the top
		this.activeSide = City.SIDE_NORTH;

		// The level away from the boundary
		this.activeLevel = 0;

		// Array containing the buildings details
		this.buildings = [];

		// Let's generate a map
		this.generate();

	}

	generate()
	{
		this.cleanUp();
		this.createMap();
		this.checkExits();
		this.process();
	}

	createMap()
	{
		// Creates a map of empty tiles based on the width / height
		for (let i = 0; i < this.height; i++) {
			this.tiles.push([]);
			for (let j = 0; j < this.width; j++) {
				let tile = new Tile(Tile.TYPE_EMPTY);
				tile.x = j*4;
				tile.y = i*4;
				this.tiles[i].push(tile);
			}
		}
	}

	// Checks to see if exits exist and randomly generates any missing
	checkExits()
	{
		// Randomly generate the exits if they weren't predefined
		if (!this.exitPoints['north']) {
			this.exitPoints['north'] = this.generateExits(this.width);
		}
		if (!this.exitPoints['south']) {
			this.exitPoints['south'] = this.generateExits(this.width);
		}
		if (!this.exitPoints['east']) {
			this.exitPoints['east'] = this.generateExits(this.height);
		}
		if (!this.exitPoints['west']) {
			this.exitPoints['west'] = this.generateExits(this.height);
		}

		// Draw the exits on the map
		let i;
		for(i=0;i<this.exitPoints['north'].length;i++) {
			this.tiles[0][this.exitPoints['north'][i]].type = Tile.TYPE_ROAD;
		}
		for(i=0;i<this.exitPoints['south'].length;i++) {
			this.tiles[this.height-1][this.exitPoints['south'][i]].type = Tile.TYPE_ROAD;
		}
		for(i=0;i<this.exitPoints['east'].length;i++) {
			this.tiles[this.exitPoints['east'][i]][this.width-1].type = Tile.TYPE_ROAD;
		}
		for(i=0;i<this.exitPoints['west'].length;i++) {
			this.tiles[this.exitPoints['west'][i]][0].type = Tile.TYPE_ROAD;
		}
	}

	// Function to randomly generate the exits
	generateExits(length)
	{
		let arrReturn = [];
		let tmpLoc = 0;
		while (tmpLoc < length) {
			tmpLoc += Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
			if (tmpLoc < length-3) {
				arrReturn.push(tmpLoc);
			}
		}
		return arrReturn;
	}

	// Function to rotate around the boundary on an inwards spiral
	process()
	{
		let count = 4;
		while (count > 0) {
			// Scan the row and create buildings if needed
			this.scanSide();

			// Switch the active side once we reach the edge
			switch (this.activeSide) {
				case City.SIDE_NORTH:
					this.activeSide = City.SIDE_EAST;
					break;
				case City.SIDE_EAST:
					this.activeSide = City.SIDE_SOUTH;
					break;
				case City.SIDE_SOUTH:
					this.activeSide = City.SIDE_WEST;
					break;
				case City.SIDE_WEST:
					this.activeSide = City.SIDE_NORTH;
					break;
			}
			count--;

			// If we've covered all four sides, let's move in a level
			if (
				count === 0 &&
				this.activeLevel < (this.height/2)-2 &&
				this.activeLevel < (this.width/2)-2
			) {
				this.activeLevel++;
				count = 4;
			}

		}
	}

	// Finds empty tiles & populates with a building
	scanSide()
	{
		let xLoc;
		let yLoc;
		switch (this.activeSide) {
			case City.SIDE_NORTH:
				for (xLoc=0;xLoc<this.width;xLoc++) {
					if (this.tiles[this.activeLevel][xLoc].type === Tile.TYPE_EMPTY ) {
						this.createBuilding(xLoc,this.activeLevel);
					}
				}
				break;

			case City.SIDE_EAST:
				for (yLoc=0;yLoc<this.height;yLoc++) {
					if (this.tiles[yLoc][this.width-1-this.activeLevel].type === Tile.TYPE_EMPTY ) {
						this.createBuilding(this.width-1-this.activeLevel,yLoc);
					}
				}
				break;

			case City.SIDE_SOUTH:
				for (xLoc=this.width-1;xLoc>=0;xLoc--) {
					if (this.tiles[this.height-1-this.activeLevel][xLoc].type === Tile.TYPE_EMPTY ) {
						this.createBuilding(xLoc,this.height-1-this.activeLevel);
					}
				}
				break;

			case City.SIDE_WEST:
				for (yLoc=(this.height-1);yLoc>=0;yLoc--) {
					if (this.tiles[yLoc][this.activeLevel].type === Tile.TYPE_EMPTY ) {
						this.createBuilding(this.activeLevel,yLoc);
					}
				}
				break;
		}
	}

	// This tile is empty, let's create a building
	createBuilding(xLoc,yLoc)
	{
		let xPos = xLoc;
		let yPos = yLoc;

		// Let's check the first dimention

		while (this.isTileEmpty(xPos,yPos)) {
			if (this.activeSide === City.SIDE_NORTH) {
				xPos++;
			}else if (this.activeSide === City.SIDE_SOUTH) {
				xPos--;
			}else if (this.activeSide === City.SIDE_EAST) {
				yPos++;
			}else if (this.activeSide === City.SIDE_WEST) {
				yPos--;
			}
		}

		if (
			this.activeSide === City.SIDE_NORTH &&
			(xPos - xLoc) > 10
		) {
			xPos = xLoc + Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
		}else if (
			this.activeSide === City.SIDE_SOUTH &&
			(xLoc - xPos) > 10
		) {
			xPos = xLoc - Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
		}else if (
			this.activeSide === City.SIDE_EAST &&
			(yPos - yLoc) > 10
		) {
			yPos = yLoc + Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
		}else if (
			this.activeSide === City.SIDE_WEST &&
			(yLoc - yPos) > 10
		) {
			yPos = yLoc - Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
		}

		let tmpDimention;//:int;
		let direction;//:String;
		let length;//:int;

		if (xLoc !== xPos) {
			tmpDimention = xPos;
			if(xLoc < xPos){
				direction = 'right';
				length = xPos-xLoc;
			}else{
				direction = 'left';
				length = xLoc-xPos;
			}
		}else{
			tmpDimention = yPos;
			if(yLoc < yPos){
				direction = 'down';
				length = yPos-yLoc;
			}else{
				direction = 'up';
				length = yLoc-yPos;
			}
		}

		xPos = xLoc;
		yPos = yLoc;

		// Let's check the second dimention
		while (this.isLineEmpty(xPos, yPos, direction, length)) {
			if (this.activeSide === City.SIDE_NORTH) {
				yPos++;
			}else if (this.activeSide === City.SIDE_SOUTH) {
				yPos--;
			}else if (this.activeSide === City.SIDE_EAST) {
				xPos--;
			}else if (this.activeSide === City.SIDE_WEST) {
				xPos++;
			}
		}

		if (
			this.activeSide === City.SIDE_NORTH &&
			(yPos - yLoc) > 10
		) {
			yPos = yLoc + Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));

		}else if (
			this.activeSide === City.SIDE_SOUTH &&
			(yLoc - yPos) > 10
		) {
			yPos = yLoc - Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));

		}else if (
			this.activeSide === City.SIDE_EAST &&
			(xLoc - xPos) > 10
		) {
			xPos = xLoc - Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));

		}else if (
			this.activeSide === City.SIDE_WEST &&
			(xPos - xLoc) > 10

		) {
			xPos = xLoc + Math.floor( Math.random()*this.buildingMin+(this.buildingMax-this.buildingMin));
		}

		if (xLoc !== xPos) {
			yPos = tmpDimention;
		}else{
			xPos = tmpDimention;
		}

		let left,right,top,bottom;// ints

		// let's get the dimentions
		// Left / Right
		if (xPos > xLoc) {
			left = xLoc;
			right = xPos-1;
		}else{
			left = xPos+1;
			right = xLoc;
		}

		// Top / Bottom
		if (yPos > yLoc) {
			top = yLoc;
			bottom = yPos-1;
		}else{
			top = yPos+1;
			bottom = yLoc;
		}

		// check to see if all tiles within this area are empty
		let allEmpty = true;
		for(let y=top;y<=bottom;y++){
			for(let x=left;x<=right;x++){
				if (!this.isTileEmpty(x,y)) {
					allEmpty = false;
				}
			}
		}

		// if all the tiles aren't empty, let's quit out
		if (!allEmpty) {
			return;
		}

		this.buildings.push({'top':top,'right':right,'bottom':bottom,'left':left});

		// Let's change to building
		for(let y=top;y<=bottom;y++){
			for(let x=left;x<=right;x++){
				this.tiles[y][x].type = Tile.TYPE_BUILDING;

				// make the roads
				//LEFT
				if (x===left && (this.tiles[y][x-1]) !== undefined) {
					this.tiles[y][x-1].type = Tile.TYPE_ROAD;
				}
				//RIGHT
				if (x===right && (this.tiles[y][x+1]) !== undefined) {
					this.tiles[y][x+1].type = Tile.TYPE_ROAD;
				}
				//TOP
				if (y===top && (this.tiles[y-1]) !== undefined) {
					this.tiles[y-1][x].type = Tile.TYPE_ROAD;
				}
				//BOTTOM
				if (y===bottom && (this.tiles[y+1]) !== undefined) {
					this.tiles[y+1][x].type = Tile.TYPE_ROAD;
				}
				//TOP LEFT
				if (
					x===left && (this.tiles[y][x-1]) !== undefined &&
					y===top && (this.tiles[y-1])!== undefined
				) {
					this.tiles[y-1][x-1].type = Tile.TYPE_ROAD;
				}
				//TOP RIGHT
				if (
					x===right && (this.tiles[y][x+1]) !== undefined &&
					y===top && (this.tiles[y-1]) !== undefined
				) {
					this.tiles[y-1][x+1].type = Tile.TYPE_ROAD;
				}
				//BOTTOM LEFT
				if (
					x===left && (this.tiles[y][x-1]) !== undefined &&
					y===bottom && (this.tiles[y+1]) !== undefined
				) {
					this.tiles[y+1][x-1].type = Tile.TYPE_ROAD;
				}
				//BOTTOM RIGHT
				if (
					x===right && (this.tiles[y][x+1]) !== undefined &&
					y===bottom && (this.tiles[y+1]) !== undefined
				) {
					this.tiles[y+1][x+1].type = Tile.TYPE_ROAD;
				}
			}
		}
	}

	isTileEmpty(xLoc,yLoc)
	{
		return (
			this.tiles[yLoc] !== undefined &&
			this.tiles[yLoc][xLoc] !== undefined &&
			this.tiles[yLoc][xLoc].type === Tile.TYPE_EMPTY
		);
	}

	isLineEmpty(xLoc,yLoc,direction,length)//:Boolean
	{
		let xPos = xLoc;//int
		let yPos = yLoc;//int

		while (length > 0) {
			if(!this.isTileEmpty(xPos,yPos)){
				return false;
			}
			switch (direction) {
				case 'left':
					xPos--;
					break;
				case 'right':
					xPos++;
					break;
				case 'up':
					yPos--;
					break;
				case 'down':
					yPos++;
					break;
			}
			length--;
		}
		return true;
	}

	cleanUp()
	{
		// Array of all the tiles
		this.tiles = [];

		// Exit points, can be predefined or randomly generated
		this.exitPoints = {
			//'north':new Array(10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190),
			'north':[],
			'south':[],
			'east':[],
			'west':[]
		};

		// The level away from the boundary
		this.activeLevel = 0;

		// Array containing the buildings details
		this.buildings = [];
	}
};
City.SIDE_NORTH = 1;
City.SIDE_SOUTH = 2;
City.SIDE_EAST = 3;
City.SIDE_WEST = 4;
