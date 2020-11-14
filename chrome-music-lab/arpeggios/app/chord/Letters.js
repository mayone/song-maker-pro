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

	var ChordLetters = function(container){
		this.element = $("<div>", {
			"id" : "Letters"
		}).appendTo(container);

		this.resize();
		$(window).resize(this.resize.bind(this));
	};

	ChordLetters.prototype.resize = function() {
		this.element.html("");
		var size = Math.min(this.element.width(), this.element.height());
		this.center = {
			x : this.element.width() / 2,
			y : this.element.height() / 2
		};

		var letterCoords, shownLetter, letter;
		for (var majLetter in Positions.major){
			letterCoords = Positions.major[majLetter].center;
			shownLetter = majLetter.replace("#", "<span>#</span>");
			letter = $("<div>", {
				"class" : "Letter Major",
				"html" : shownLetter
			}).appendTo(this.element);
			letter.css({
				"left" : letterCoords.x * this.center.x + this.center.x,
				"top" : letterCoords.y * this.center.y + this.center.y,
			});
		}

		for (var minLetter in Positions.minor){
			letterCoords = Positions.minor[minLetter].center;
			shownLetter = minLetter.replace("#", "<span>#</span>");
			letter = $("<div>", {
				"class" : "Letter Minor",
				"html" : shownLetter
			}).appendTo(this.element);
			letter.css({
				"left" : letterCoords.x * this.center.x + this.center.x,
				"top" : letterCoords.y * this.center.y + this.center.y,
			});
		}
	};

	return ChordLetters;
});