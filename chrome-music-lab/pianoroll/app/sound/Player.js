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

define(["sound/Piano", "sound/Sampler", "sound/Synth"], 
function (Piano, Sampler, Synth) {

	var Player = function(){

		//instances of all three instruments
		this._synth = new Synth();

		this._piano = new Piano();

		this._sampler = new Sampler();

		this._currentInstrument = this._synth;
	};

	Player.prototype.setInstrument = function(inst, buffer){
		this.releaseAll();
		switch(inst){
			case "piano" : 
				this._piano.load();
				this._currentInstrument = this._piano;
				break;
			case "synth" : 
				this._currentInstrument = this._synth;
				break;
			case "sampler" : 
				this._currentInstrument = this._sampler;
				break;
		}
	};

	Player.prototype.setBuffer = function(buffer, duration, onset){
		this._sampler.setBuffer(buffer, duration, onset);
	};

	Player.prototype.triggerAttackRelease = function(note, duration, time, velocity){
		//make it quieter and randomize the velocity slightly
		velocity = velocity * 0.5 + Math.random() * 0.5;
		velocity *= 0.5;
		this._currentInstrument.triggerAttackRelease(note, duration, time, velocity);
	};

	Player.prototype.releaseAll = function(){
		//release all
		this._currentInstrument.releaseAll();
	};

	return Player;
});