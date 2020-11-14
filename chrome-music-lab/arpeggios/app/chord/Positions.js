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

define(function () {


	function polarToCartesian(theta, radius){
		return {
			x : radius * Math.cos(theta),
			y : radius * Math.sin(theta)
		};
	}

	var innerRadius = 0.66;

	var majorOrder = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
	var minorOrder = ["A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D"];

	var majorCoords = {};

	var minorCoords = {};

	var thresh = 0.01;
	//draw all of the majors first
	var arcSize = Math.PI * 2 / majorOrder.length;
	var startAngle = 0 - arcSize / 2 - Math.PI / 2;

	for (var i = 0; i < majorOrder.length; i++){
		var coord = {
			startAngle : startAngle - thresh,
			endAngle : startAngle + arcSize + thresh,
			innerRadius : innerRadius,
			outerRadius : 1,
		};
		coord.center = polarToCartesian((coord.endAngle + coord.startAngle)/2, 
				(coord.outerRadius + coord.innerRadius) / 2);
		majorCoords[majorOrder[i]] = coord;
		startAngle += arcSize;
	}

	for (var k = 0; k < minorOrder.length; k++){
		 var minCoord = {
			startAngle : startAngle - thresh,
			endAngle : startAngle + arcSize + thresh,
			innerRadius : 0,
			outerRadius : innerRadius
		};
		minCoord.center = polarToCartesian((minCoord.endAngle + minCoord.startAngle)/2, 
				minCoord.outerRadius * 3 / 4);
		minorCoords[minorOrder[k]] = minCoord;
		startAngle += arcSize;
	}

	return {
		major : majorCoords,
		minor: minorCoords,
		majorOrder : majorOrder,
		minorOrder : minorOrder,
		innerRadius : innerRadius
	};
});