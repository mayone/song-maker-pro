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

define(["Tone/core/Transport"], function (Transport) {

	var OrientationListener = function(callback){

		window.addEventListener("orientationchange", this._changed.bind(this));
		if (window.screen && window.screen.orientation){
			window.screen.orientation.addEventListener("change", this._screenChange.bind(this));
		}

		this._callback = callback;
	};

	OrientationListener.prototype._changed = function(){
		//check if it's landscape
		if (Math.abs(window.orientation) === 90){
			if (Transport.state === "started"){
				this._callback();
			}
		}
	};

	OrientationListener.prototype._screenChange = function(){		
		//check if it's landscape
		if (Math.abs(window.screen.orientation.angle) === 90){
			if (Transport.state === "started"){
				this._callback();
			}
		}
	};

	return OrientationListener;
});