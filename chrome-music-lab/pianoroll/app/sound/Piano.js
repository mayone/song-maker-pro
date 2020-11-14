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

define(["Tone/core/Buffer", "interface/Loader", "Tone/core/Transport", "fileplayer/Player"], 
function (Buffer, Loader, Transport, MultiPlayer) {

	var Piano = function(){

		this._piano = new MultiPlayer("https://gweb-musiclab-site.appspot.com/static/sound/piano", "A0", "C8", 3);

		this._allLoaded = false;

		this._transportWasStarted = false;

		Buffer.on("load", this._onload.bind(this));

		this._loader = null;
	};

	Piano.prototype.triggerAttackRelease = function(note, duration, time, vel){
		if (this._allLoaded){
			this._piano.triggerAttackRelease(note, duration, time, vel);
		}
	};

	Piano.prototype.releaseAll = function(){
		this._piano.releaseAll();
	};

	Piano.prototype.load = function(){
		if (!this._allLoaded){
			this._loader = new Loader("piano");
			this._piano.load();
			this._transportWasStarted = Transport.state === "started";
			if (this._transportWasStarted){
				Transport.pause();
			}
		}
	};

	Piano.prototype._onload = function(){
		this._allLoaded = true;
		this._loader.resolve();
		if (this._transportWasStarted){
			Transport.start();
			this._transportWasStarted = false;
		}
	};

	return Piano;

});