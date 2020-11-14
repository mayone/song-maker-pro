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

define(["style/interface.scss", "data/Scores", "Tone/core/Transport", "interface/Loader"],
	function (interfaceStyle, Scores, Transport, Loader) {

		var PlayButton = function (container) {

			//the play button
			this._playButton = document.createElement("div");
			this._playButton.id = "PlayPause";
			this._playButton.classList.add("Button");
			container.appendChild(this._playButton);
			this._playButton.addEventListener("click", this._play.bind(this));

			//the midi file title
			this._midiButton = document.createElement("div");
			this._midiButton.id = "Midi";
			this._midiButton.classList.add("TextButton");
			var xSpan = document.createElement("span");
			var textSpan = document.createElement("span");
			xSpan.innerHTML = "×";
			textSpan.classList.add("Text");
			textSpan.innerHTML = "testfile.mid";
			this._midiButton.appendChild(xSpan);
			this._midiButton.appendChild(textSpan);
			container.appendChild(this._midiButton);
			this._midiButton.addEventListener("click", this._clearMidiFile.bind(this));

			//the prev button
			this._prevButton = document.createElement("div");
			this._prevButton.id = "Previous";
			this._prevButton.classList.add("Button");
			this._prevButton.classList.add("ScoreButton");
			this._prevButton.classList.add("icon-svg_left_arrow");
			container.appendChild(this._prevButton);
			this._prevButton.addEventListener("click", this._selectScore.bind(this, -1));

			//the next button
			this._nextButton = document.createElement("div");
			this._nextButton.id = "Next";
			this._nextButton.classList.add("Button");
			this._nextButton.classList.add("ScoreButton");
			this._nextButton.classList.add("icon-svg_right_arrow");
			container.appendChild(this._nextButton);
			this._nextButton.addEventListener("click", this._selectScore.bind(this, 1));

			this._scoreIndex = 0;
			this._setScoreControls();

			//the callbacks
			this.onPlay = function () { };
			this.onScore = function () { };

			this._setPlayIcon();

			//load the first score
			// this._loadScore();
		};

		PlayButton.prototype._clearMidiFile = function () {
			document.getElementById('PlayPause').classList.remove('Shifted');
			document.querySelectorAll('#Previous, #Next').forEach(function (n) { n.classList.remove('Hidden') });
			document.getElementById('Midi').classList.remove('Active');
			this._loadScore();
			this.onPlay(false);
			this.stop();
		};

		PlayButton.prototype._selectScore = function (move) {
			this._setPlayIcon();
			this._scoreIndex += move;
			this._setScoreControls();
			this._loadScore(Scores[this._scoreIndex]);
		};

		PlayButton.prototype.stop = function (move) {
			this._setPlayIcon();
		};

		PlayButton.prototype._play = function () {
			if (Transport.state === "started") {
				Transport.stop();
				this._setPlayIcon();
				this.onPlay(false);
			} else {
				this._setPauseIcon();
				Transport.start();
				this.onPlay(true);
			}
		};

		PlayButton.prototype._setPlayIcon = function () {
			this._playButton.classList.remove("icon-svg_pause");
			this._playButton.classList.add("icon-svg_play");
			this._playButton.classList.remove("Active");
		};

		PlayButton.prototype._setPauseIcon = function () {
			this._playButton.classList.add("icon-svg_pause");
			this._playButton.classList.remove("icon-svg_play");
			this._playButton.classList.add("Active");

		};

		PlayButton.prototype._loadScore = function () {
			//pause before the score
			Transport.stop();
			this.onPlay(false);
			var name = Scores[this._scoreIndex];
			var loader = new Loader("score");
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "./midi/" + name + ".json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var json = JSON.parse(xhr.responseText);
						loader.resolve();
						this.onScore(json);
					} else {
						console.log('Error: ' + xhr.status); // An error occurred during the request.
					}
				}
			}.bind(this);
			xhr.send(null);
		};

		PlayButton.prototype._setScoreControls = function () {
			if (this._scoreIndex === 0) {
				this._prevButton.classList.add("Disabled");
			} else {
				this._prevButton.classList.remove("Disabled");
			}

			if (this._scoreIndex === Scores.length - 1) {
				this._nextButton.classList.add("Disabled");
			} else {
				this._nextButton.classList.remove("Disabled");
			}
		};

		return PlayButton;
	});