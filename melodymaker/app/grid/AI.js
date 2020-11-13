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

define(['data/Colors', 'data/Config', 'tween.js'], function(Colors, Config, TWEEN) {

	var tileMargin = Config.tileMargin;

	var AI = function(tile, GRID) {
		//a refernce to the tile
		this.tile = tile;

		this._offsetX = 0;
		this._offsetY = 0;

		this._currentX = 0;
		this._currentY = 0;

		this._tween = null;

		this.GRID = GRID;

	};

	AI.prototype.draw = function(context, width, height, activeColumn, offset, direction) {

		if (this._offsetX !== offset.x || this._offsetY !== offset.y) {
			this.move(offset.x, offset.y, direction);
		} 


		var x = (this.tile.x + this._currentX) % Config.gridWidth;
		var y = (this.tile.y + this._currentY) % Config.gridHeight;

		this._drawRect(context, x, y, width, height, activeColumn);

		if ((this.tile.y + this._currentY) > Config.gridHeight - 1 && (this.tile.y + this._currentY) < Config.gridHeight) {
			//draw another copy
			var remainerY = this._currentY % 1;
			remainerY -= 1;
			this._drawRect(context, x, remainerY, width, height, activeColumn);
		} else if ((this.tile.x + this._currentX) > Config.gridWidth - 1 && (this.tile.x + this._currentX) < Config.gridWidth) {
			var remainerX = this._currentX % 1;
			remainerX -= 1;
			this._drawRect(context, remainerX, y, width, height, activeColumn);
		}
	};

	AI.prototype._drawRect = function(context, x, y, width, height, activeColumn) {
		context.globalAlpha = 0.5;
		if ((this.tile.x + this._offsetX) % Config.gridWidth === activeColumn) {
			context.fillStyle = Colors.darkGrey;
		} else {
			context.fillStyle = Colors.grey;
		}
		context.beginPath();
		context.fillRect(x * width + tileMargin, y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
		context.globalAlpha = 1;
	};

	AI.prototype.move = function(toX, toY, direction) {

		var xAdder = 0;
		var yAdder = 0;

		var yRemainder = (this._currentY % 1);
		var xRemainder = (this._currentX % 1);

		if (direction === 'down' && this._offsetY === Config.gridHeight - 1 && toY === 0) {
			this._currentY = -1 - yRemainder;
		} else if (direction === 'up' && this._offsetY === 0 && toY === Config.gridHeight - 1) {
			this._currentY = Config.gridHeight + yRemainder;
		} else if (direction === 'up' && this._offsetY === 0) {
			this._currentY = Config.gridHeight + yRemainder;
		} else if (direction === 'left' && this._offsetX === 0) {
			this._currentX = Config.gridWidth + xRemainder;
		} else if (direction === 'right' && this._offsetX === Config.gridWidth - 1 && toX === 0) {
			this._currentX = -1 - xRemainder;
		}

		if (this._tween) {
			this._tween.stop();
		}

		var self = this;

		this._tween = new TWEEN.Tween({
				x: this._currentX,
				y: this._currentY,
			})
			.to({
				x: toX,
				y: toY,
			}, 200)
			.onUpdate(function() {
				self._currentX = this.x;
				self._currentY = this.y;
				self.GRID._needsUpdate = true;
			})
			.start()
			.easing(TWEEN.Easing.Quintic.InOut);

		this._offsetX = toX;
		this._offsetY = toY;

	};

	AI.prototype.isInColumn = function(column) {
		return ((this.tile.x + this._offsetX) % Config.gridWidth) === column;
	};

	AI.prototype.getRow = function() {
		return (this.tile.y + this._offsetY) % Config.gridHeight;
	};

	AI.prototype.dispose = function() {
		if (this._tween) {
			this._tween.stop();
		}
		this._tween = null;
		this.tile = null;
		this.GRID = null;
	};

	return AI;
});
