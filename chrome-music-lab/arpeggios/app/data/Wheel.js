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

define(["data/Colors", "data/Notes"], function (Colors, Notes) {

	var majorOrder = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
	var minorOrder = ["A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D"];

	var Wheel = {
		"minor" : [],
		"major" : [],
	};

	var note, i;
	for (i = 0; i < majorOrder.length; i++){
		note = majorOrder[i];
		Wheel.major.push({
			"scale" : "major",
			"color" : Colors[note],
			"name" : note,
			"notes" : Notes.major[note],
			"value" : 1
		});
	}

	for (i = 0; i < minorOrder.length; i++){
		note = minorOrder[i];
		//the minor are lower case
		Wheel.minor.push({
			"scale" : "minor",
			"color" : Colors[note],
			"name" : note.toLowerCase(),
			"notes" : Notes.minor[note],
			"value" : 1
		});
	}

	return Wheel;
});