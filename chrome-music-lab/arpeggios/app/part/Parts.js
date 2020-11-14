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

define(["jquery", "data/Parts", "part/Part", "part.scss", "data/Notes",
 "Tone/core/Transport", "part/SnapScroll", "part/TimelineIndicator"], 
	function ($, PartsData, Part, partStyle, Notes, Transport, SnapScroll, 
		TimelineIndicator) {

	var partsContainer = $("<div>", {
		"id" : "Parts"
	}).appendTo("body");

	//reset the chord when the parts container changes size
	$(window).on("resize", function(){
		Parts.setChord(currentNotes);
	});

	/**
	 *  THE PARTS
	 */
	var parts = [];
	var currentPart = 0;

	//setup
	for (var i = 0; i < PartsData.parts.length; i++){
		var part = new Part(partsContainer, PartsData.parts[i]);
		part.enabled = false;
		parts.push(part);
	}

	// the current notes
	var currentNotes = [];

	/**
	 * The return object
	 */
	var Parts = {
		setChord : function(notes){
			currentNotes = notes;
			parts.forEach(function(part){
				part.setChord(notes);
			});
		},
		initChord : function(){
			parts.forEach(function(part){
				part.initChord();
			});	
		},
		setPart : function(currentIndex, nextIndex){
			var lastPart = parts[currentIndex];
			lastPart.enable(false);
			//setup the new part
			currentPart = nextIndex;
			parts[nextIndex].enable(true);
		}
	};

	//initially just set it to C
	Parts.setChord(Notes.major.C);
	//and enable the first part
	parts[currentPart].enable(true);

	//and make the parts scrollable
	SnapScroll(partsContainer, Parts.setPart);

	//swap out the icons
	partsContainer.find(".slick-prev").addClass("icon-svg_left_arrow");
	partsContainer.find(".slick-next").addClass("icon-svg_right_arrow");

	//set the loop position of the transport
	Transport.loop = true;
	Transport.loopEnd = PartsData.loopDuration;

	//the timelint indicator
	TimelineIndicator(partsContainer);


	return Parts;
});