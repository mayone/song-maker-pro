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

define(["Tone/core/Type", "sound/Loading", "fileplayer/Player"], 
function (Tone, Loading, MultiPlayer) {

	var Player = function(instrument, onload){

		this.loaded = false;

		this.instrument = instrument;

		this.player = new MultiPlayer("https://gweb-musiclab-site.appspot.com/static/sound/" + instrument, "C3", "Gb6", 3);

		this.player.onload = function(){
			console.log("here");
		};

	};

	Player.prototype.load = function(callback){
		Loading.load(this.instrument);
		this.player.load();
		this.player.onload = function(){
			if (callback){
				callback();
			}
			Loading.resolve();
		}.bind(this);
	};

	Player.prototype.play = function(note, duration, time){
		if(this.player.loaded){
			this.player.triggerAttackRelease(note, duration, time);
		}
	};

	Player.prototype.isLoaded = function(){
		return this.player.loaded;
	};

	return Player;
});