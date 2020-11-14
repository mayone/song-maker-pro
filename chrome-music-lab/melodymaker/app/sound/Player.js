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

define(['Tone/instrument/SimpleSynth', 'Tone/core/Master', 'data/Config', 'Tone/core/Transport', 'Tone/instrument/PolySynth'],
	function(SimpleSynth, Master, Config, Transport, PolySynth) {

	var Player = function() {

		// Transport._clock.lookAhead = 0.05;

		this.melodyPlayer = new PolySynth(3, SimpleSynth).set({
			'volume' : -4,
			'oscillator' : {
				'type' : 'triangle17',
				// 'partials' : [16, 8, 4, 2, 1, 0.5, 1, 2]
			},
			'envelope' : {
				'attack' : 0.01,
				'decay' : 0.1,
				'sustain' : 0.2,
				'release' : 1.7,
			}
		}).toMaster();

		this.melodyPlayer.stealVoices = false;


		this.harmonyPlayer = new PolySynth(2, SimpleSynth).set({
			'volume' : -8,
			'oscillator' : {
				'type' : 'triangle11'
			},
			'envelope' : {
				'attack' : 0.01,
				'decay' : 0.1,
				'sustain' : 0.2,
				'release' : 1.7,
			}
		}).toMaster();
	};

	Player.prototype.play = function(notes, time) {
		if (notes.melody !== -1) {
			var melNote = this._indexToNoteName(notes.melody);
			this.melodyPlayer.triggerAttackRelease(melNote, '8n', time, this._randomVelocity());
		}

		if (notes.harmony !== -1) {
			var harmNote = this._indexToNoteName(notes.harmony);
			this.harmonyPlayer.triggerAttackRelease(harmNote, '8n', time, this._randomVelocity());
		}
	};

	Player.prototype._indexToNoteName = function(index) {
		var noteIndex = Config.pitches.length - index - 1;
		var pitch = Config.pitches[noteIndex];
		return pitch;
	};

	Player.prototype._randomVelocity = function() {
		return (Math.random() * 0.5 + 0.5) * 0.8;
	};

	Player.prototype.tap = function(note) {
		if (Transport.state === 'stopped') {
			var noteIndex = Config.pitches.length - note - 1;
			var pitch = Config.pitches[noteIndex];
			this.melodyPlayer.triggerAttackRelease(pitch, '8t', '+0.01', this._randomVelocity());
		}
	};

	return Player;
});
