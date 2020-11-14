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

define(["jquery", "slick-carousel", "slick-carousel/slick/slick.scss"], function ($, slickCarousel, slickStyle) {

	var SnapScroll = function(container, change, init){
		$(container).slick({
			dots : false,
			accessibility : false,
			arrows : true,
			infinite: false,
		}).on("beforeChange", function(e, slick, currentSlide, nextSlide){
			change(currentSlide, nextSlide);
		}).on("mousedown touchstart", function(e){
			//update the chord on touch
			if (init){
				init();
			}
		});

		$(container).find(".slick-arrow").addClass("Button").on("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			$(e.target).blur();
		});

		//remove the text label
		$(container).find(".slick-arrow").text("");

		/*$(window).on("resize", function(){
			console.log('here');
			$(container).width($(window).width());
		});*/

	};

	return SnapScroll;
});