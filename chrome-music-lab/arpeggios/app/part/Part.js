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

define(["Tone/event/Part", "part/Note", "jquery", "sound/Sound"], 
function (Part, Note, $, Sound) {

	var ArpPart = function(container, notes){

		this.element = $("<div>", {
			"class" : "Part"
		}).appendTo(container);

		this.notes = [];
		//make each of the notes in the part
		var i;
		for (i = 0; i < notes.length; i++){
			this.notes.push([notes[i].time, new Note(this.element, notes[i].time, notes[i].degree, notes[i].duration)]);
		}

		this.part = new Part(this.onnote.bind(this), this.notes).start(0);

		this.enabled = true;

	};

	ArpPart.prototype.onnote = function(time, note) {
		if (this.enabled){
			// console.log(note.note)
			var duration = this.part.toSeconds(note.duration);
			note.play(duration);
			Sound.play(this.chord[note.degree], time, duration);
		}
	};

	ArpPart.prototype.enable = function(enabled) {
		this.enabled = enabled;
		if (enabled){
			this.setChord(this.chord);	
		} 
	};

	/**
	 *  Reset the current chord
	 */
	ArpPart.prototype.initChord = function() {
		var notes = this.chord;
		this.notes.forEach(function(note){
			note[1].setChord(notes);
		});
	};

	/**
	 *  The array of midi note numbers
	 */
	ArpPart.prototype.setChord = function(notes) {
		if (this.enabled){
			this.notes.forEach(function(note){
				note[1].setChord(notes);
			});
		}
		this.chord = notes;
	};

	return ArpPart;
});