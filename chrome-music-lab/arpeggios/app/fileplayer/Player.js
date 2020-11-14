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

define(["Tone/source/MultiPlayer", "./Notes", "Tone/core/Master", "Tone/core/Buffer"], function (MultiPlayer, Notes, Master, Buffer) {

	/**
	 * A sample player
	 * @param {String} folder      The folder where all the samples are contained
	 * @param {String} lowestNote 
	 * @param {String} highestNote
	 */
	var Player = function(folder, lowestNote, highestNote, steps){

		/**
		 * The multibuffer player
		 * @type {Tone.MultiPlayer}
		 * @private
		 */
		this._multiPlayer = new MultiPlayer().toMaster();

		/**
		 * the instrument folder
		 * @type {String}
		 * @private
		 */
		this._instrumentFolder = folder;

		/**
		 * The lowest note playable
		 * @type {String}
		 * @private
		 */
		this._lowestNote = lowestNote;

		/**
		 * The highest note playable
		 * @type {String}
		 * @private
		 */
		this._highestNote = highestNote;

		/**
		 * The number of chromaitc steps (up and down) which the sample 
		 * will be repitched
		 * @type {Number}
		 * @private
		 */
		this._stepSize = steps || 4;

		/**
		 * The number of buffers currently 
		 * loading.
		 * @type {Number}
		 * @private
		 */
		this._loadCount = 0;

		/**
		 * The sample lookup. Each note mapes to a buffer and a playbackRate
		 * @type {Object}
		 * @private
		 */
		this._notes = {};

		/**
		 * All the buffers
		 * @type {Object}
		 * @private
		 */
		this._buffers = {};

		/**
		 * The time it takes for the note to release
		 * @type {Number}
		 * @private
		 */
		this._releaseTime = 0.5;

		/**
		 * if all the samples are loaded
		 * @type {Boolean}
		 */
		this.loaded = false;

		//callback when loaded
		this.onload = function(){};
	};

	/**
	 * Load all the buffers
	 */
	Player.prototype.load = function(){
		//get all the samples between lowest and highest notes
		var allNotes = Notes.getNotes(this._lowestNote, this._highestNote);

		//get the samples to load
		for (var i = 0; i < allNotes.length; i+=this._stepSize * 2 + 1){
			var end = Math.max(this._stepSize * 2 + 1, allNotes.length);
			var bufferPitch = allNotes[i + this._stepSize];
			if (typeof bufferPitch !== "undefined"){
				//create the buffer
				this._loadCount+=1;
				var buff = new Buffer(this._instrumentFolder + "/" + bufferPitch + ".mp3", this._loadedBuffer.bind(this));
				// this._buffers[bufferPitch] = buff;
				this._multiPlayer.addBuffer(bufferPitch, buff);
				for (var j = i; j < end; j++){
					var note = allNotes[j];
					this._notes[note] = {
						"interval" : (j - i - this._stepSize),
						"buffer" : bufferPitch,
					};
					//and the respelling if it exists
					var respelling = Notes.getRespelling(note);
					if (respelling){
						this._notes[respelling] = this._notes[note];
					}	
				}
			}
		}
	};

	/**
	 * internal callback when a sample is loaded
	 * @private
	 */
	Player.prototype._loadedBuffer = function(){
		this._loadCount-=1;
		if (this._loadCount === 0){
			this.loaded = true;
			this.onload();
		}
	};

	/**
	 * Trigger the attack and release of the note
	 * @param  {String} note
	 * @param  {Number} duration The held duration in seconds
	 * @param  {Number} time     When the note should trigger
	 */
	Player.prototype.triggerAttackRelease = function(note, duration, time){
		var description = this._notes[note];
		this._multiPlayer.start(description.buffer, time, {
			playbackRate : this._multiPlayer.intervalToFrequencyRatio(description.interval),
			release : this._releaseTime,
			duration : duration,
			gain : 0.5
		});
	};

	/**
	 * Trigger the attack of the note
	 * @param  {String} note
	 * @param  {Number} time     When the note should trigger
	 */
	Player.prototype.triggerAttack = function(note, time){

		var description = this._notes[note];

		/*this._multiPlayer.start(description.buffer, time, {
			playbackRate : this._multiPlayer.intervalToFrequencyRatio(description.interval),
			release : this._releaseTime
		});*/

		// var buffer = this._buffers[description.buffer];

		/*time = toneInstance.toSeconds(time);

		var description = this._notes[note];
		var buffer = this._buffers[description.buffer];

		var amp = Tone.context.createGain();
		amp.connect(this._output);
		amp.gain.value = 1;
		var source = Tone.context.createBufferSource();
		source.connect(amp);
		source.buffer = buffer.get();
		source.playbackRate.value = toneInstance.intervalToFrequencyRatio(description.interval);
		source.start(time);
		this._activeNotes[note] = amp;*/
	};

	/**
	 * Release a note
	 * @param  {String} note
	 * @param  {Number} time     When the note should trigger
	 */
	Player.prototype.triggerRelease = function(note, time){
		var description = this._notes[note];
		console.log(description);
		this._multiPlayer.stop(description.buffer, time);
	};

	/**
	 * Release all of the notes currently playing.
	 */
	Player.prototype.releaseAll = function(){
		this._multiPlayer.stopAll();
		/*var now = toneInstance.now();
		var newOutput = toneInstance.context.createGain();
		newOutput.connect(toneInstance.context.destination);
		this._output.gain.setValueAtTime(1, now);
		this._output.gain.linearRampToValueAtTime(0, now + 0.01);
		this._output = newOutput;
		this._activeNotes = {};*/
	};

	/**
	 * clean up
	 */
	Player.prototype.dispose = function(){
		this.releaseAll();
		for (var buff in this._buffers){
			this._buffers[buff].dispose();
		}
		this._buffers = null;
		this._notes = null;
	};

	return Player;
});