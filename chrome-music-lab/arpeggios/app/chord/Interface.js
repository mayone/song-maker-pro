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

define(["jquery", "chord/Positions"], function ($, Positions) {

	var Interface = function(container){

		this.element = $("<div>", {
			"id" : "Interaction"
		}).appendTo(container);

		this.element.on("mousedown", this.mousedown.bind(this));
		this.element.on("touchstart", this.touchstart.bind(this));
		this.element.on("touchend", this.mouseup.bind(this));
		this.element.on("mouseup", this.mouseup.bind(this));


		this.onstart = function(){};
		this.onend = function(){};
	};

	/**
	 *  Get the chord which is at the given position
	 */
	Interface.prototype.getChord = function(x, y){
		var twoPi = Math.PI * 2;
		var width = this.element.width();
		var height = this.element.height();
		x = ((x - width / 2) / width) * 2;
		y = ((y - height / 2) / height) * 2;
		var theta = Math.atan2(y, x);
		var radius = Math.sqrt(x*x + y*y);
		//could be optimized by checking radius first
		var index = 0;
		for (var letter in Positions.major){
			var coord = Positions.major[letter];
			if (theta > coord.startAngle && theta < coord.endAngle){
				break;
			} else if (theta + twoPi > coord.startAngle && theta + twoPi < coord.endAngle){
				break;
			}
			index++;
		}
		if (radius < Positions.innerRadius){
			return [Positions.minorOrder[index], "minor"];
		} else {
			return [Positions.majorOrder[index], "major"];
		}
	};

	Interface.prototype.mousedown = function(e) {
		e.preventDefault();
		e.stopPropagation();
		var res = this.getChord(e.offsetX, e.offsetY);
		this.onstart(res[0], res[1]);
	};

	Interface.prototype.touchstart = function(e) {
		e.preventDefault();
		e.stopPropagation();
		var touches = e.originalEvent.touches;
		var offset = this.element.offset();
		//just take the first touch
		if (touches.length > 0){
			var touch = touches[0];
			var res = this.getChord(touch.pageX - offset.left, touch.pageY - offset.top);
			this.onstart(res[0], res[1]);
		}
	};

	Interface.prototype.mouseup = function(e) {
		this.onend();	
	};


	return Interface;
});