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

define(["teoria", "chord/Positions"], function (teoria, Positions) {

	var Notes = {
		major : {},
		minor : {}
	};

	for (var i = 0; i < Positions.majorOrder.length; i++){
		var key = Positions.majorOrder[i];
		var major = teoria.note(key + "3").chord("major");
		var minor = teoria.note(key + "3").chord("minor");
		Notes.major[key] = [];
		Notes.minor[key] = [];
		var octaves = 3;
		for (var o = 0; o < octaves; o++){
			var majorNotes = major.notes();
			var minorNotes = minor.notes();
			for (var j = 0; j < majorNotes.length; j++){
				Notes.major[key].push(majorNotes[j].midi());
				Notes.minor[key].push(minorNotes[j].midi());
			}
			major.transpose(teoria.interval("P8"));
			minor.transpose(teoria.interval("P8"));
		}
	}

	return Notes;
});