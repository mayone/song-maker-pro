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

define(["jquery", "sound.scss", "sound/Metronome"], function ($, soundStyle, Metronome) {

	var pianoHarp = $("<div>", {
		"id" : "PianoHarp",
		"class" : "Button icon-svg_harp"
	}).appendTo("body")
		.on("click", function(e){
			e.preventDefault();
			if (pianoHarp.hasClass("icon-svg_piano")){
				pianoHarp.removeClass("icon-svg_piano");
				pianoHarp.addClass("icon-svg_harp");
				Interface.onharp();
			} else {
				pianoHarp.removeClass("icon-svg_harp");
				pianoHarp.addClass("icon-svg_piano");
				Interface.onpiano();
			}
		});

	Metronome.onopen = function(){
		Interface.onmetroopen();
	};

	Metronome.onclose = function(){
		Interface.onmetroclose();
	};

	var Interface = {
		onpiano : function(){},
		onharp : function(){},
		onmetroopen : function(){},
		onmetroclose : function(){}
	};

	return Interface;
});