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

define(["jquery", "Tone/core/Transport", "Orientation"], function ($, Transport, Orientation) {

	return function PlayButton(container){

		var playButton = $("<div>", {
			"id" : "PlayButton",
			"class" : "Button icon-svg_play"
		}).appendTo(container)
			.on("click", function(e){
				e.preventDefault();
				if (Transport.state === "started"){
					Transport.stop();
					playButton.removeClass("Active");
					playButton.removeClass("icon-svg_pause");
					playButton.addClass("icon-svg_play");
				} else {
					Transport.start();
					playButton.addClass("Active");
					playButton.removeClass("icon-svg_play");
					playButton.addClass("icon-svg_pause");
				}
			});

		var orientation = new Orientation(function(){
			Transport.stop();
			playButton.removeClass("Active");
			playButton.removeClass("icon-svg_pause");
			playButton.addClass("icon-svg_play");
		});
		
	};
});