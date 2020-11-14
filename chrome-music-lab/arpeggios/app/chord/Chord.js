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

define(["chord.scss", "jquery", "chord/Wheel", "chord/Letters", 
	"chord/Interface", "sound/Sound", "part/Parts", "data/Notes", 
	"Tone/core/Transport", "part/PlayButton"], 
	function (chordStyle, $, ChordWheel, ChordLetters, ChordInteractions, 
		Sound, Parts, Notes, Transport, PlayButton) {

	var chordContainer = $("<div>", {
		"id" : "Chord"
	}).appendTo("body");

	function size(){
		//set the width the same as the height
		var margin = 15	;
		var dim = Math.min(chordContainer.width(), chordContainer.height());
		dim -= margin * 2;
		// var dim = chordContainer.width();
		wheelContainer.width(dim);
		wheelContainer.height(dim);

		//center it in the container
		wheelContainer.css({
			"margin-left" : -dim/2,
			"margin-top" : -dim/2,
		});
	}

	var wheelContainer = $("<div>", {
		"id" : "Wheel"
	}).appendTo(chordContainer);

	//size it initially
	$(window).on("resize", size);
	size();

	var wheel = new ChordWheel(wheelContainer);

	var letters = new ChordLetters(wheelContainer);

	var interaction = new ChordInteractions(wheelContainer);


	//interactions
	interaction.onstart = function(letter, key){
		currentLetter = letter;
		currentKey = key;
		wheel.draw(letter, key);
		if (Transport.state === "started"){

		} else {
			Sound.strum(letter, key);
		}
		Parts.setChord(Notes[key][letter]);
	};
	interaction.onend = function(){
		// wheel.draw();
	};

	//set the chord to C initially
	interaction.onstart("C", "major");

	//create the play button
	PlayButton(wheelContainer);
});