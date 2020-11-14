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

define(["style/interface.scss", "./SoundSelection", "./PlayButton", "mic/Microphone"], 
function (interfaceStyle, SoundSelection, PlayButton, Microphone) {

	var Interface = function(container){

		this._interface = document.createElement("div");
		this._interface.id = "SongControls";
		container.appendChild(this._interface);

		this._soundButtons = new SoundSelection(this._interface);

		this._playButton = new PlayButton(this._interface);

		this._microphone = new Microphone(this._interface, this._soundButtons.microphone);

		this._microphone.onstart = this._startRec.bind(this);
		this._microphone.onstop = this._stopRec.bind(this);
		this._microphone.oncancel = this._recCanceled.bind(this);

		this._onRec = function(){};
	};

	Interface.prototype.onPlay = function(cb){
		this._playButton.onPlay = cb;
	};

	Interface.prototype.onInstrument = function(cb){
		this._soundButtons.onSelect = cb;
	};

	Interface.prototype.onScore = function(cb){
		this._playButton.onScore = cb;
	};

	Interface.prototype.onRecord = function(cb){
		this._onRec = cb;
	};

	Interface.prototype.onBuffer = function(cb){
		this._microphone.onbuffer = cb;
	};

	Interface.prototype._startRec = function(){
		this._soundButtons.recording(true);
		this._onRec(true);
	};

	Interface.prototype._stopRec = function(){
		this._soundButtons.recording(false);
		this._onRec(false);
	};

	Interface.prototype._recCanceled = function(){
		this._soundButtons.recording(false);
		this._soundButtons.previous();
		this._onRec(false);
	};

	//force it to a stop
	Interface.prototype.stop = function(){
		this._playButton.stop();
	};

	return Interface;
});