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

define(["teoria", "Tone/source/MultiPlayer"], 
function (teoria, MultiPlayer) {

	var Sampler = function(){

		this._player = new MultiPlayer().toMaster();

		//the onset time
		this._onset = 0;
	};

	Sampler.prototype.setBuffer = function(buffer, duration, onset){
		var tmpBuffer = this._player.context.createBuffer(1, this._player.context.sampleRate * buffer.duration, this._player.context.sampleRate);
		var targetArray = tmpBuffer.getChannelData(0);
		var copyArray = buffer.getChannelData(0);
		for (var i = 0; i < copyArray.length; i++){
			targetArray[i] = copyArray[i];
		}
		this._onset = onset;
		this._player.addBuffer("buffer", tmpBuffer);
	};

	Sampler.prototype.releaseAll = function(){
		this._player.stopAll();
	};

	Sampler.prototype.triggerAttackRelease = function(note, duration, time, velocity){
		var semitones = teoria.Interval.between(teoria.note("C3"), teoria.note(note)).semitones();
		this._player.start("buffer", time, {
			"playbackRate" : this._player.intervalToFrequencyRatio(semitones),
			"duration" : duration,
			"gain" : velocity,
			"offset" : this._onset
		});
	};

	return Sampler;
});