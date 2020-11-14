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

define(["jquery", "data/Colors", "chord.scss", "chord/Positions", "tinycolor2"], 
	function ($, Colors, chordStyle, Positions, TinyColor) {

	/**
	 *  The drawing of the chord wheel. 
	 */
	var Wheel = function(container){

		this.canvas = $("<canvas>", {
			id : "Canvas"
		}).appendTo(container);

		//width and height
		this.radius = this.canvas.width();

		this.center = this.canvas.width();

		this.innerRadius = 0.66 * this.radius;

		this.currentLetter = "C";
		this.currentKey = "major";

		//the context
		this.context = this.canvas.get(0).getContext("2d");
		
		this.resize();
		$(window).on("resize", this.resize.bind(this));
	};

	var minorColors = {};

	for (var key in Colors){
		var color = TinyColor(Colors[key]);
		// color.lighten(12);
		color.darken(10);
		minorColors[key] = color.toRgbString();
	}

	Wheel.prototype.resize = function(){
		this.radius = Math.min(this.canvas.width(), this.canvas.height());
		this.center = this.radius;
		this.context.canvas.width = this.canvas.width() * 2;
		this.context.canvas.height = this.canvas.height() * 2;
		this.innerRadius = 0.66 * this.radius;
		this.draw(this.currentLetter, this.currentKey);
	};


	Wheel.prototype.draw = function(highlightLetter, major){
		this.currentLetter = highlightLetter;
		this.currentKey = major;
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		major = major === "major";
		var centerX = this.canvas.width();
		var centerY = this.canvas.height();
		//draw all of the majors first
		for (var majChordLetter in Positions.major){
			var majChord = Positions.major[majChordLetter];
			if (majChordLetter == highlightLetter && major){
				this.context.fillStyle = "black";
			} else {
				this.context.fillStyle = Colors[majChordLetter];
			}
			this.context.beginPath();
			this.context.moveTo(centerX, centerY);
			this.context.arc(centerX, centerY, 
					this.radius * majChord.outerRadius, 
					majChord.startAngle, majChord.endAngle, false);
			this.context.fill();
		}
		//then the minors
		for (var minChordLetter in Positions.minor){
			var minChord = Positions.minor[minChordLetter];
			if (minChordLetter == highlightLetter && !major){
				this.context.fillStyle = "black";
			} else {
				this.context.fillStyle = minorColors[minChordLetter];
			}
			this.context.beginPath();
			this.context.moveTo(centerX, centerY);
			this.context.arc(centerX, centerY, 
					this.radius * minChord.outerRadius, 
					minChord.startAngle, minChord.endAngle, false);
			this.context.fill();
		}
	};

	return Wheel;
});