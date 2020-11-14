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

define([], function () {

	var waveformHeight = 200;

	/**
	 *  draws a waveform
	 *  and let's you select the start position
	 */
	var Waveform = function(container, buffer){

		/**
		 *  the waveform container
		 */
		this.element = document.createElement("DIV");
		this.element.id = "WaveformContainer";
		container.appendChild(this.element);

		/**
		 *  the waveform canvas
		 */
		this.canvas = document.createElement("canvas");
		this.element.appendChild(this.canvas);

		/**
		 *  the playhead
		 */
		this.playhead = document.createElement("div");
		this.playhead.id = "Playhead";
		this.element.appendChild(this.playhead);

		/**
		 *  the drawing context
		 */
		this.context = this.canvas.getContext("2d");

		this.width = window.innerWidth * 2;
		this.height = waveformHeight * 2;

		//size it
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;

		/**
		 *  the last drawn position
		 */
		this.lastPosition = 0;

		/**
		 *  the amplitudes
		 */
		this.amplitudes = [];
	};

	/**
	 *  Add a value to the waveform at a specific position
	 */
	Waveform.prototype.add = function(value, position) {
		//draw a rectange at that position
		if (position - this.lastPosition > 0){
			this.context.clearRect(0, 0, this.width, this.height);
			// this.context.fillStyle = "rgb(204, 204, 204)";
			this.context.fillStyle = "blue";
			this.context.lineJoin = "round";
			this.amplitudes.push({
				position : position,
				value : Math.pow(value, 0.8)
			});
			var lastPosition = 0;
			this.context.beginPath();
			var sample, height, currentPosition;
			this.context.moveTo(0, (this.height) / 2);
			for (var i = 0; i < this.amplitudes.length; i++){
				sample = this.amplitudes[i];
				height = Math.max(Math.round(this.height * sample.value), 1);
				currentPosition = Math.round(sample.position * this.width);
				this.context.lineTo(currentPosition, (this.height - height) / 2);
			}
			//draw the line down to the current position on the bottom side
			for (var j = this.amplitudes.length - 1; j >= 0; j--){
				sample = this.amplitudes[j];
				height = Math.max(Math.round(this.height * sample.value), 1);
				currentPosition = Math.round(sample.position * this.width);
				this.context.lineTo(currentPosition, (this.height + height) / 2);
			}
			this.context.lineTo(0, (this.height) / 2);
			this.context.closePath();
			this.context.fill();
			// var height = Math.max(Math.round(this.height * value), 1);
			// var currentPosition = Math.round(position * this.width);
			// var lastPosition = Math.round(this.lastPosition * this.width);
			// this.context.fillRect(lastPosition, (this.height - height) / 2, currentPosition - lastPosition, height);

		}
		this.setHead(position);
		this.lastPosition = position;
	};

	Waveform.prototype.draw = function(array, position){
		this.playhead.style.left = (position * 100).toFixed(1) + "%";
		// var array = buffer.getChannelData(0);		
		var context = this.context;
		context.clearRect(0, 0, this.width, this.height);
		context.fillStyle = "rgb(204, 204, 204)";
		var len = array.length;
		var height = this.height;
		var chunkSize = len / this.width;
		var chunkWidth = 2;
		var halfHeight = this.height / 2;
		var lastSample = 0;
		for (var x = 0; x < this.width * position; x+=chunkWidth){
			var y = Math.abs(array[Math.floor(x * chunkSize)]);
			y = Math.pow(y, 0.5);
			y = Math.max(lastSample * 0.9, y);
			lastSample = y;
			y *= halfHeight;
			context.fillRect(x, halfHeight - y/2, chunkWidth * 3, y);
		}
	};

	/**
	 *  move the playhead. position value should be normalized 0-1.
	 */
	Waveform.prototype.setHead = function(position) {

	};

	/**
	 *  start the waveform recording
	 */
	Waveform.prototype.start = function() {
		this.clear();
		this.lastPosition = 0;
	};

	/**
	 *  start the waveform recording
	 */
	Waveform.prototype.clear = function() {
		this.setHead(0);
		this.amplitudes = [];
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.fillStyle = "black";
		this.playhead.style.left = "0px";
	};

	return Waveform;
});