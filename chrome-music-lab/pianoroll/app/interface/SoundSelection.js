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

define(["style/interface.scss"], function (interfaceStyle) {

	var SoundSelection = function(container){

		this._buttons = document.createElement("DIV");
		this._buttons.id = "SynthControls";
		container.appendChild(this._buttons);

		this._piano = document.createElement("DIV");
		this._piano.id = "Piano";
		this._piano.classList.add("Button");
		this._piano.classList.add("icon-svg_piano");
		this._piano.addEventListener("click", this._clicked.bind(this, "piano"));
		this._buttons.appendChild(this._piano);

		this._synth = document.createElement("DIV");
		this._synth.id = "Synth";
		this._synth.classList.add("Button");
		this._synth.classList.add("icon-svg_wave_form");
		this._synth.addEventListener("click", this._clicked.bind(this, "synth"));
		this._buttons.appendChild(this._synth);

		this.microphone = document.createElement("DIV");
		this.microphone.id = "Sampler";
		this.microphone.classList.add("Button");
		this.microphone.classList.add("icon-svg_record");
		this.microphone.addEventListener("click", this._clicked.bind(this, "sampler"));
		this._buttons.appendChild(this.microphone);

		//the currently active element
		this._currentInstrument = "synth";
		this.setInstrument(this._currentInstrument);

		this._lastInstrument = null;

		this.onSelect = function(){};
	};

	SoundSelection.prototype._clicked = function(which, e){
		this.onSelect(which);
		this.setInstrument(which);
	};

	SoundSelection.prototype.recording = function(isRec){
		if (isRec){
			this._buttons.classList.add("Recording");
		} else {
			this._buttons.classList.remove("Recording");
		}
	};

	//return to the previously selected button
	SoundSelection.prototype.previous = function(){
		if (this._lastInstrument){
			this._clicked(this._lastInstrument);
		}
	};

	SoundSelection.prototype.setInstrument = function(inst){
		this._lastInstrument = this._currentInstrument;
		this._currentInstrument = inst;
		//remove the currently active element
		var activeEl = this._buttons.querySelector(".Active");
		if (activeEl){
			activeEl.classList.remove("Active");
		}
		switch(inst){
			case "synth" :
				this._synth.classList.add("Active");
				break;
			case "piano" :
				this._piano.classList.add("Active");
				break;
			case "sampler" :
				this.microphone.classList.add("Active");
				break;
		}
	};

	return SoundSelection;
});