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

define(["sound/Player", "data/Notes", "Tone/core/Type", "Tone/core/Master", "sound/Interface", "Tone/core/Transport", "jquery"], 
	function (Player, Notes, Tone, Master, Interface, Transport, $) {


	var harp = new Player("harp");

	var piano = new Player("piano");

	var currentInstrument = harp;

	//load the harp

	Interface.onpiano = function(){
		if (!piano.isLoaded()){
			piano.load();
		}
		currentInstrument = piano;
	};

	Interface.onharp = function(){
		if (!harp.isLoaded()){
			harp.load();
		}
		currentInstrument = harp;
	};

	var muted = false;

	Interface.onmetroopen = function(){
		if (Transport.state === "stopped"){
			muted = true;
			$("body").addClass("MetronomeOpen");
			Transport.start();
		}
	};

	Interface.onmetroclose = function(){
		if (muted){
			$("body").removeClass("MetronomeOpen");
			Transport.stop();
			muted = false;
		}
	};

	var startNote = 48;
	var noteGap = 4;

	return {
		strum : function(key, mode){
			var chord = Notes[mode][key];
			var now = Tone.context.currentTime + Tone.prototype.blockTime;
			var wait = 0.05;
			for (var i = 0; i < 4; i++){
				this.play(chord[i], now + wait * i, 0.5);
			}
		},
		play : function(midi, time, duration){

			if (!muted){
				var note = Tone.prototype.midiToNote(midi);
				currentInstrument.play(note, duration, time);
			}
		},
		load : function(callback){
			//load the harp initially
			harp.load(callback);
		}
	};
});