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

define(['style/bottom.scss', 'interface/Slider', 'Tone', 'interface/Orientation'],
function(bottomStyle, Slider, Tone, Orientation) {


	var Bottom = function(container) {

		this._element = document.createElement('div');
		this._element.id = 'Bottom';
		container.appendChild(this._element);

		this._controlsContainer = document.createElement('div');
		this._controlsContainer.id = 'Controls';
		this._element.appendChild(this._controlsContainer);

		this._playButton = document.createElement('div');
		this._playButton.id = 'PlayButton';
		this._playButton.classList.add('Button');
		this._playButton.classList.add("icon-svg_play");
		this._controlsContainer.appendChild(this._playButton);
		this._playButton.addEventListener('click', this._playClicked.bind(this));

		this._harmony = document.createElement('div');
		this._harmony.id = 'Harmony';
		this._harmony.classList.add('Button');
		this._controlsContainer.appendChild(this._harmony);
		this._harmony.addEventListener('click', this._directionClicked.bind(this));

		// this._directions = ['none', 'up', 'down', 'right', 'left'];
		this._directions = ['none', 'right'];
		this._directionIndex = 0;

		this.slider = new Slider(this._controlsContainer);

		this.onDirection = function() {};

		this._orientation = new Orientation(this._rotated.bind(this));
	};

	Bottom.prototype._playClicked = function(e) {
		e.preventDefault();

		if (Tone.Transport.state === Tone.State.Started) {
			this._playButton.classList.remove('Playing');
			this._playButton.classList.add('icon-svg_play');
			this._playButton.classList.remove('icon-svg_pause');
			Tone.Transport.stop();
		} else {
			this._playButton.classList.add('Playing');
			this._playButton.classList.remove('icon-svg_play');
			this._playButton.classList.add('icon-svg_pause');
			Tone.Transport.start('+0.1');
		}
	};

	Bottom.prototype._rotated = function() {
		if (Tone.Transport.state === Tone.State.Started) {
			this._playButton.classList.remove('Playing');
			this._playButton.classList.add('icon-svg_play');
			this._playButton.classList.remove('icon-svg_pause');
			Tone.Transport.stop();
		}
	};


	Bottom.prototype._directionClicked = function(e) {
		e.preventDefault();
		var formerDir = this._directions[this._directionIndex];
		this._harmony.classList.remove(formerDir);
		this._directionIndex = (this._directionIndex + 1) % this._directions.length;
		var dir = this._directions[this._directionIndex];
		this._harmony.classList.add(dir);
		this.onDirection(dir);
	};

	return Bottom;
});
