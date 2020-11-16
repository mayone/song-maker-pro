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

define(['data/Colors', 'data/Config'], function(Colors, Config) {

	var tileMargin = Config.tileMargin;

	var Tile = function(x, y, hover) {

		this.x = x;
		this.y = y;

		this._hovered = hover || false;
	};

	Tile.prototype.draw = function(context, width, height, activeColumn) {

		//get the note and color
		var margin = tileMargin;
		var note = Config.notes[this.y];
		context.fillStyle = Colors[note];
		context.beginPath();
		context.fillRect(this.x * width + tileMargin, this.y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
		if (this._hovered || this.x === activeColumn) {
			context.fillStyle = 'rgba(255, 255, 255, 0.4)';
			context.beginPath();
			context.fillRect(this.x * width + tileMargin, this.y * height + tileMargin, width - tileMargin * 2, height - tileMargin * 2);
		}
	};

	Tile.prototype.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Tile.prototype.hover = function() {
		this._hovered = true;
	};

	Tile.prototype.unhover = function() {
		this._hovered = false;
	};

	Tile.prototype.isHovered = function() {
		return this._hovered;
	};

	return Tile;
});
