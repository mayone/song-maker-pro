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

define(["style/slider.scss"], function (mainStyle) {

	var Slider = function(container, min, max, initialValue){

		/**
		 * The minimum slider value
		 * @type {Number}
		 * @private
		 */
		this._min = min || 0;

		/**
		 * The maximum slider value
		 * @type {Number}
		 * @private
		 */
		this._max = max || 100;

		/**
		 * The slider container
		 * @type {Element}
		 * @private
		 */
		this._container = document.createElement("div");
		this._container.classList.add("Slider");
		container.appendChild(this._container);

		/**
		 * The slider which captures the inputs
		 * @type {Element}
		 * @private
		 */
		this._range = document.createElement("input");
		this._range.type = "range";
		this._range.id = "Range";
		this._range.min = min;
		this._range.max = max;
		this._container.appendChild(this._range);
		this._range.addEventListener("input", this._change.bind(this));

		/**
		 * The railing behind the handle
		 * @type {Element}
		 * @private
		 */
		this._rail = document.createElement("div");
		this._rail.id = "Rail";
		this._container.appendChild(this._rail);

		/**
		 * The blue indicator within the rail
		 * @type {Element}
		 * @private
		 */
		this._fill = document.createElement("div");
		this._fill.id = "Fill";
		this._rail.appendChild(this._fill);

		/**
		 * The handle of the slider
		 * @type {Element}
		 * @private
		 */
		this._handle = document.createElement("div");
		this._handle.id = "Handle";
		this._container.appendChild(this._handle);

		/**
		 * Internal number holder
		 * @type {Number}
		 * @private
		 */
		this._value = 0;

		/**
		 * Onchange handler
		 * @type {Function}
		 */
		this.onchange = function(){};

		//set the position initially
		this.setValue(initialValue || 50);

		//add a resize handler
		window.addEventListener("resize", this._update.bind(this));
	};

	Slider.prototype._change = function(){
		this._update();
		this._value = parseFloat(this._range.value);
		this.onchange(this._range.value);
	};

	Slider.prototype._update = function(){
		var percent = (this._range.value - this._min) / (this._max - this._min);
		var handleOffset = this._handle.offsetWidth * percent;
		var halfHandle = this._handle.offsetWidth / 2;
		var percentPixels = percent * this._container.offsetWidth;
		//computer the width in pixels
		this._fill.style.width = (percentPixels - handleOffset + halfHandle).toString() + "px";
		this._handle.style.left = (percentPixels - handleOffset).toString() + "px";
	};

	Slider.prototype.setValue = function(val){
		this._value = val;
		this._range.value = val;
		this._update();
	};

	Slider.prototype.getValue = function(){
		return this._value;
	};

	return Slider;
});