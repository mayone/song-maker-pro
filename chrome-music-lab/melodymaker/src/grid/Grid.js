/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(['style/grid.scss', 'data/Config', 'data/Colors', 'grid/Tile', 'grid/AI', "tween.js"],
	function(gridStyle, Config, Colors, Tile, AI, TWEEN) {
	var Grid = function(container) {

		this.element = document.createElement('DIV');
		this.element.id = 'Grid';
		container.appendChild(this.element);

		this.bgCanvas = document.createElement('CANVAS');
		this.element.appendChild(this.bgCanvas);

		/**
		 * the background context
		 */
		this.bgContext = this.bgCanvas.getContext('2d');


		this.canvas = document.createElement('CANVAS');
		this.element.appendChild(this.canvas);

		/**
		 * the drawing context
		 */
		this.context = this.canvas.getContext('2d');

		/**
		 * the canvas size
		 */
		this.width = 0;
		this.height = 0;

		this.tileWidth = 0;
		this.tileHeight = 0;

		/**
		 * the currently active column. -1 for nothing
		 */
		this._activeColumn = -1;

        /**
         * Track mouse drag events
         */
        this.mouseDrag = false;
        this.lastDragTile = {x: null, y: null};

		this._resize();
		window.addEventListener('resize', this._resize.bind(this));

		//do the drawing
		this.canvas.addEventListener('mousemove', this._hover.bind(this));
		this.canvas.addEventListener('mousedown', this._clicked.bind(this));
        this.canvas.addEventListener('mouseup', this._mouseUp.bind(this));

        this.canvas.addEventListener('touchmove', this._hover.bind(this));
        this.canvas.addEventListener('touchend', this._mouseUp.bind(this));
		this.canvas.addEventListener('touchstart', this._clicked.bind(this));

		/**
		 * all the tiles on the screen
		 */
		this._tiles = new Array(Config.gridWidth);

		//all of the AI on the screen
		this._ai = [];

		/**
		 * the x/y offset of the AI
		 */
		this._aiOffset = {
			x: 0,
			y: 0
		};

		/**
		 * flag if the drawing needs updating
		 */
		this._needsUpdate = false;

		/**
		 * the direction of the AI phasing
		 * "up"/"down"/"left"/"right"/"none"
		 */
		this._direction = 'none';

		/**
		 * counts the number of times
		 * that the loop has rotated
		 */
		this._iterationCounter = 0;

		this._boundDraw = this.draw.bind(this);
		this.draw();

		this.onNote = function() {};
	};

	Grid.prototype._resize = function() {
		this._needsUpdate = true;
		this.width = this.canvas.offsetWidth * 2;
		this.height = this.canvas.offsetHeight * 2;
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;
		this.bgContext.canvas.width = this.width;
		this.bgContext.canvas.height = this.height;
		this.tileWidth = this.width / Config.gridWidth;
		this.tileHeight = this.height / Config.gridHeight;
		this._drawLines();
	};

	Grid.prototype._tileAtPosition = function(x, y) {
		return {
			x: Math.floor(x / (this.tileWidth / 2)),
			y: Math.floor(y / (this.tileHeight / 2))
		};
	};

	Grid.prototype._clicked = function(e) {
        this.mouseDrag = true;

		e.preventDefault();
		//get the touch coord
		if (e.type === 'touchstart' || e.type === 'touchmove') {
			for (var i = 0; i < e.changedTouches.length; i++) {
				var touch = e.changedTouches[i];
				var touchTilePos = this._tileAtPosition(touch.clientX, touch.clientY);
				this._addTile(touchTilePos.x, touchTilePos.y);

                this.lastDragTile = touchTilePos;
			}
		} else {
			var tilePos = this._tileAtPosition(e.clientX, e.clientY);
			this._addTile(tilePos.x, tilePos.y, true);

            this.lastDragTile = tilePos;
		}
	};

	Grid.prototype._mouseUp = function(e) {
		e.preventDefault();

		// Reset drag variables
		this.mouseDrag = false;
        this.lastDragTile = {x: null, y: null};
	};

	Grid.prototype._hover = function(e) {
		// Mobile uses touches
		const x = e.clientX !== undefined ?
			e.clientX :
			(e.touches && e.touches[0].clientX);
		const y = e.clientY !== undefined ?
			e.clientY :
			(e.touches && e.touches[0].clientY);

		var tilePos = this._tileAtPosition(x, y);

		//get the tile at the pos
		var tile = this._tiles[tilePos.x];

		// Call click event on mousedrag
		if (this.mouseDrag && (tilePos.x !== this.lastDragTile.x || tilePos.y !== this.lastDragTile.y)) {
			this.lastDragTile = tilePos;
			this._clicked(e);
		}

		if (tile && !tile.isHovered()) {
			if (tilePos.y === tile.y) {
				this._needsUpdate = true;
				tile.hover();
			}
		}
		//go through the tiles, and unhover them
		for (var i = 0; i < this._tiles.length; i++) {
			var t = this._tiles[i];
			if (t && t.isHovered() && (t.x !== tilePos.x || t.y !== tilePos.y)) {
				this._needsUpdate = true;
				t.unhover();
			}
		}
	};

	Grid.prototype._addTile = function(x, y, hover) {
		this._needsUpdate = true;
		//if there's a tile already in that column
		if (this._tiles[x]) {
			var tile = this._tiles[x];
			//and row, remove it
			if (tile.y == y) {
				this._removeTile(x, y, tile);
			} else {
				//otherwise remove it
				this._removeTile(x, y, tile);
				this._addTile(x, y, hover);
			}
		} else {
			var t = new Tile(x, y, hover);
			this.onNote(y);
			var ai = new AI(t, this);
			this._tiles[x] = t;
			this._ai.push(ai);
		}
	};

	Grid.prototype._removeTile = function(x, y, tile) {
		//remove the AI associated with that tile
		for (var i = 0; i < this._ai.length; i++) {
			var ai = this._ai[i];
			if (ai.tile === tile) {
				ai.dispose();
				this._ai.splice(i, 1);
				break;
			}
		}
		this._tiles[x] = null;
		this._needsUpdate = true;
	};

	/**
	 * Drawing
	 */
	Grid.prototype.draw = function() {
		requestAnimationFrame(this._boundDraw);
		if (this._needsUpdate){
			this._needsUpdate = false;
			this.context.clearRect(0, 0, this.width, this.height);
			//draw the active column
			if (this._activeColumn !== -1) {
				this.context.fillStyle = 'rgba(22, 168, 240, .08)';
				this.context.fillRect(this._activeColumn * this.tileWidth, 0, this.tileWidth, this.height);
			}
			this._drawAI();
			this._drawTiles();
			TWEEN.update();
		}
	};

	Grid.prototype._drawLines = function() {
		var gridWidth = Config.gridWidth;
		var gridHeight = Config.gridHeight;
		this.bgContext.strokeStyle = 'rgba(22, 168, 240, 0.4)';
		this.bgContext.lineWidth = 1;
		for (var x = 0; x < gridWidth; x++) {
		  for (var y = 0; y < gridHeight; y++) {
				//draw tile with border
				this.bgContext.beginPath();
				this.bgContext.strokeRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
		  }
		}
	};

	Grid.prototype._drawTiles = function() {
		for (var i = 0; i < this._tiles.length; i++) {
			var tile = this._tiles[i];
			if (tile) {
				tile.draw(this.context, this.tileWidth, this.tileHeight, this._activeColumn);
			}
		}
	};

	Grid.prototype._drawAI = function() {
		for (var i = 0; i < this._ai.length; i++) {
			this._ai[i].draw(this.context, this.tileWidth, this.tileHeight, this._activeColumn, this._aiOffset, this._direction);
		}
	};

	/**
	 * select a column
	 */
	Grid.prototype.select = function(column) {
		this._needsUpdate = true;
		//get all of the tiles in that column
		this._activeColumn = column;
		//returns all the active notes in that column
		var ret = {
			melody: -1,
			harmony: -1,
		};
		if (this._tiles[column]) {
			ret.melody = (this._tiles[column].y);
		}
		for (var i = 0; i < this._ai.length; i++) {
			var ai = this._ai[i];
			if (ai.isInColumn(column)) {
				//if it's not already in there
				var row = ai.getRow();
				if (ret.melody !== row) {
					ret.harmony = row;
				}
			}
		}
		/*if (column === Config.gridWidth - 1){
			if (this._iterationCounter > 0 && this._iterationCounter % 2 === 0){
				//increment all the ghosts
				this._moveAI();
			}
			this._iterationCounter++;
		}*/
		return ret;
	};

	Grid.prototype._moveAI = function() {
		this._needsUpdate = true;
		//if it's a new direciton, do it twice
		switch (this._direction) {
			case 'down' :
				this._aiOffset.y = (this._aiOffset.y + 2) % Config.gridHeight;
				break;
			case 'up' :
				this._aiOffset.y -= 2;
				if (this._aiOffset.y < 0) {
					this._aiOffset.y = Config.gridHeight - 2;
				}
				break;
			case 'left' :
				this._aiOffset.x -= 2;
				if (this._aiOffset.x < 0) {
					this._aiOffset.x = Config.gridWidth - 2;
				}
				break;
			case 'right' :
				this._aiOffset.x = (this._aiOffset.x + 2) % Config.gridWidth;
				break;
			case 'none' : 
				this._aiOffset.x = 0;
				this._aiOffset.y = 0;
				break;
		}
		for (var i = 0; i < this._ai.length; i++) {
			this._ai[i].move(this._aiOffset.x, this._aiOffset.y, this._direction);
		}
	};

	/**
	 * select a column
	 */
	Grid.prototype.setDirection = function(direction) {
		this._needsUpdate = true;
		//if it's early in the loop
		if (this._activeColumn < 2) {
			this._iterationCounter = 1;
		} else {
			this._iterationCounter = 0;
		}

		this._direction = direction;

		//remove all the ai's
		for (var i = 0; i < this._ai.length; i++) {
			this._ai[i].dispose();
		}
		this._ai = [];
		//add them back
		for (var j = 0; j < this._tiles.length; j++) {
			var tile = this._tiles[j];
			if (tile) {
				var ai = new AI(tile, this);
				this._ai.push(ai);
			}
		}

		//reset the offset
		this._aiOffset = {
			x: 0,
			y: 0
		};

		//move the AI initially
		//if it's a new direction, do it twice
		this._moveAI();
	};

	return Grid;
});
