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

define(["style/loading.scss"], function (loadStyle) {

	var Loader = function(type, info){

		this._loadingScreen = document.createElement("DIV");
		this._loadingScreen.id = "LoadingScreen";
		this._loadingScreen.classList.add("Visible");
		document.body.appendChild(this._loadingScreen);

		this._minLoadTime = 500;

		this._GIF = document.createElement("DIV");
		this._GIF.id = "GIF";
		this._loadingScreen.appendChild(this._GIF);

		if (type === "piano") {
			this._GIF.classList.add("icon-svg_piano");
		}

		this._spinner  = document.createElement("div");
		this._spinner.innerHTML = '<svg class="Spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="Circle" fill="none" stroke-width="3" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>';
		this._GIF.appendChild(this._spinner);


		this._scoreText = document.createElement("DIV");
		this._scoreText.id = "Text";
		this._loadingScreen.appendChild(this._scoreText);

		if (type === "score"){
			// this._scoreText.innerHTML = info.composer + "<br>" + info.name;	
		}

		this._loadStart = Date.now();
	};

	Loader.prototype.resolve = function(){
		var elapsedTime = Date.now() - this._loadStart;
		if (elapsedTime < this._minLoadTime){
			setTimeout(this.resolve.bind(this), this._minLoadTime - elapsedTime + 10);
		} else {
			//remove the visibility
			this._loadingScreen.classList.remove("Visible");
			setTimeout(function(){
				this._loadingScreen.remove();
			}.bind(this), 500);
		}
	};

	return Loader;
});