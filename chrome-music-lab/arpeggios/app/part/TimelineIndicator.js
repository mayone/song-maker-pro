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

define(["jquery", "Tone/core/Transport"], function ($, Transport) {

	var makeIndicator = function(container){
		//The timeline position indicator
		var positionIndicator = $("<div>", {
			"id" : "LoopPosition"
		}).appendTo(container);
		function loop(){
			requestAnimationFrame(loop);
			positionIndicator.css("left", Transport.progress * container.width());
		}
		loop();
	};

	return makeIndicator;
});