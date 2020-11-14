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

define(["jquery", "data/Notes", "teoria", "data/Parts", "Tone/core/Tone", "data/Colors"], 
	function ($, Notes, teoria, PartsData, Tone, Colors) {

	/**
	 *  compute the lowest and highest note
	 */
	var highestNote = -Infinity;
	var lowestNote = Infinity;
	for (var chordName in Notes.major){
		var chord = Notes.major[chordName];
		for (var i = 0; i < chord.length; i++){
			if (chord[i] > highestNote){
				highestNote = chord[i];
			} 
			if (chord[i] < lowestNote){
				lowestNote = chord[i];	
			}
		}
	}

	var IndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	/**
	 *  A Note object
	 */
	var Note = function(container, time, degree, duration){

		this.container = container;

		this.element = $("<div>", {
			"class" : "Note"
		}).appendTo(container);

		this.highlight = $("<div>", {
			"id" : "Highlight"
		}).appendTo(this.element);

		this.time = time;

		this.degree = degree;

		this.duration = duration;

		var loopDuration = this.toSeconds(PartsData.loopDuration);

		this.resize();
		$(window).resize(this.resize.bind(this));
	};

	Tone.extend(Note);

	Note.prototype.setChord = function(chord) {
		//get this notes degree from the chord
		var note = chord[this.degree];
		//set the new position
		var position = (note - lowestNote + 2) / (highestNote - lowestNote);
		var height = this.container.height();
		position *= height;
		this.element.css("top", height - position);
		//get the notes color
		var octaveIndex = teoria.note.fromMIDI(note).chroma();
		var noteName = IndexToNote[octaveIndex];
		var color = Colors[noteName];
		this.element.css("background-color", color);
	};

	Note.prototype.resize = function() {
		setTimeout(function(){
			var loopDuration = this.toSeconds(PartsData.loopDuration);
			var width = this.container.width() - parseFloat(this.element.css("margin-left")) - parseFloat(this.element.css("margin-right"));
			this.element.width((this.toSeconds(this.duration) / loopDuration) * width);
			this.element.css("left", (this.toSeconds(this.time) / loopDuration) * width);
		}.bind(this), 200);
	};

	Note.prototype.play = function(duration){
		//add a class for the duration of the note
		this.highlight.addClass("Active");
		setTimeout(function(){
			this.highlight.removeClass("Active");
		}.bind(this), duration * 1000);
	};

	return Note;
});