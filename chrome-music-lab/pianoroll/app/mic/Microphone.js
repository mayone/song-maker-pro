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

define(["mic/Overlay", "Tone/source/Microphone"], 
function (Overlay, Mic) {

	var Microphone = function(container, micButton){

		this._container = container;

		this._micButton = micButton;

		this._meterRing = document.createElement("DIV");
		this._meterRing.id = "MeterRing";
		this._micButton.appendChild(this._meterRing);


		this._overlay = new Overlay(container, this._meterRing);
		this._overlay.onclose = this._doneRecording.bind(this);
		this._overlay.oncancel = this._wasCanceled.bind(this);
		this._overlay.ondenied = this._wasDenied.bind(this);

		this.onstart = function(){};
		this.onstop = function(){};
		this.oncancel = function(){};
		this.onbuffer = function(){};

		//check if the mic is supported
		if (!Mic.supported){
			this._micButton.classList.add("Unsupported");
			this._micButton.classList.remove("icon-svg_record");
			this._micButton.classList.add("icon-svg_no_record");
			this._micButton.addEventListener("click", this._unsupported.bind(this));
		} else {
			this._micButton.addEventListener("click", this._startRecording.bind(this));
		}
	};

	Microphone.prototype._startRecording = function(e){
		e.preventDefault();
		if (!this._overlay.isRecording){
			this._overlay.open();
			this._micButton.classList.add("Recording");
			this.onstart();
		} else {
			this._overlay.close();
		}
	};

	Microphone.prototype._doneRecording = function(){
		this.onstop();
		this._micButton.classList.remove("Recording");
		this.onbuffer(this._overlay.buffer, this._overlay.duration, this._overlay.onset);
	};

	Microphone.prototype._wasCanceled = function(){
		this.onstop();
		this._micButton.classList.remove("Recording");
		this.oncancel();
	};

	Microphone.prototype._wasDenied = function(){
		window.parent.postMessage("error3","*");
		this.oncancel();
	};

	Microphone.prototype._unsupported = function(){
		window.parent.postMessage("error2","*");
		this.oncancel();
	};


	return Microphone;
});