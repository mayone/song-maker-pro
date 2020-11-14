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

	var chromatic = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

	var respelling = {"Db" : "C#", "Eb" : "D#", "Gb" : "F#", "Ab" : "G#", "Bb" : "A#"};

	var splitRegexp = /(-?\d+)/;

	return {
		getNotes : function(start, end){
			var startOctave = parseInt(start.split(splitRegexp)[1]);
			var startNote = start.split(splitRegexp)[0];
			startNote = chromatic.indexOf(startNote);
			var endOctave = parseInt(end.split(splitRegexp)[1]);
			var endNote = end.split(splitRegexp)[0];
			endNote = chromatic.indexOf(endNote);

			var currentNote = startNote;
			var currentOctave = startOctave;

			var retNotes = [];

			while(!(currentNote === endNote && currentOctave === endOctave)){
				retNotes.push(chromatic[currentNote] + currentOctave);

				currentNote++;

				if (currentNote >= chromatic.length){
					currentNote = 0;
					currentOctave++;
				}
			}

			return retNotes;
		},
		getRespelling : function(note){
			var pitch = note.split(splitRegexp)[0];
			var octave = parseInt(note.split(splitRegexp)[1]);
			if (respelling.hasOwnProperty(pitch)){
				return respelling[pitch] + octave.toString();
			} else {
				return null;
			}
		}
	};
});