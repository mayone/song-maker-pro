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

define(["mic.scss", "./Recorder", "./Waveform", "Tone/instrument/SimpleSynth"], 
	function (micStyle, Recorder, Waveform, SimpleSynth) {

	var MicOverlay = function(container, meterButton){

		this._element = document.createElement("DIV");
		this._element.id = "MicOverlay";
		container.appendChild(this._element);

		this._closeButton = document.createElement("DIV");
		this._closeButton.id = "Cancel";
		this._closeButton.classList.add("Button");
		this._closeButton.classList.add("icon-svg_close-button");
		this._element.appendChild(this._closeButton);
		this._closeButton.addEventListener("click", this.cancel.bind(this));

		/**
		 *  if the thing is recording now
		 *  @type  {Boolean}
		 */
		this.isRecording = false;

		/**
		 *  the element to scale with the meter
		 */
		this._meterButton = meterButton;

		/**
		 *  the buffer recorder
		 */
		this._recorder = new Recorder();
		this._recorder.onended = this.close.bind(this);

		/**
		 *  The waveform drawer
		 *  @type  {Waveform}
		 */
		this._waveform = new Waveform(this._element, this._recorder.audioBuffer);


		/**
		 *  the onclose event
		 */
		this.onclose = function(){};


		/**
		 *  called when cancel is hit
		 */
		this.oncancel = function(){};

		/**
		 *  called when the mic is denied
		 */
		this.ondenied = function(){};

		/**
		 *  the animation frame id;
		 */
		this._animationFrame = -1;

		/**
		 *  the duration of the sample
		 */
		this.duration = 0;

		/**
		 *  the recorded buffer
		 */
		this.buffer = this._recorder.audioBuffer;

		/**
		 *  the onset of the start of the recorded buffer
		 */
		this.onset = 0;

		/**
		 *  the countdown interval
		 */
		this._countDownNumber = 0;

		/**
		 *  metronome tick sound
		 */
		this._countDownSynth = new SimpleSynth().toMaster().set("envelope.release", 0.1);

	};

	MicOverlay.prototype.activateMicrophone = function() {
		//start the microphone
		this._recorder.activate();
	};

	MicOverlay.prototype.open = function() {
		//start the microphone
		this._waveform.clear();
		this._element.classList.add("Visible");
		this._recorder.open(function(){
			this.meter();
			this._countDownNumber = 0;
			this.countDown();
		}.bind(this), function(){
			this.close();
			this.ondenied();
		}.bind(this));
	};

	MicOverlay.prototype.countDown = function(){
		if (this._countDownNumber === 0){
			this._countDownSynth.triggerAttackRelease("C5", 0.05);
			this._countDownSynth.triggerAttackRelease("C6", 0.125, "+0.125");
			this._countDownTimeout = setTimeout(this.start.bind(this), 500);
		} 
		this._countDownNumber--;
	};

	MicOverlay.prototype.close = function() {
		this.stop();
		this._element.classList.remove("Visible");
		cancelAnimationFrame(this._animationFrame);
		clearTimeout(this._countDownTimeout);
		this._waveform.clear();
		this.onclose();
	};

	MicOverlay.prototype.cancel = function() {
		this.stop();
		this._element.classList.remove("Visible");
		cancelAnimationFrame(this._animationFrame);
		clearTimeout(this._countDownTimeout);
		this._waveform.clear();
		this.oncancel();
	};

	MicOverlay.prototype.meter = function() {
		this._animationFrame = requestAnimationFrame(this.meter.bind(this));
		var meterVal = this._recorder.meter;
		var transformString = "scale("+(1 + meterVal * 2).toString()+")";
		this._meterButton.style.transform = transformString;
		this._meterButton.style.webkitTransform = transformString;
		if (this.isRecording){
			this._waveform.draw(this._recorder.bufferArray, this._recorder.head);
		}
	};

	MicOverlay.prototype.start = function() {
		this.isRecording = true;
		this._recorder.start(function(){
			this._waveform.start();
		}.bind(this));
	};

	MicOverlay.prototype.stop = function() {
		this.isRecording = false;
		// this.recordButton.classList.remove("Active");
		this._recorder.stop();
		//get the duration
		this.duration = this._recorder.duration;
		this.onset = this._recorder.onset;
	};

	MicOverlay.prototype.closeMic = function() {
		this._recorder.close();
	};

	return MicOverlay;
});